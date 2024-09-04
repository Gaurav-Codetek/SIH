import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const storedToken = await AsyncStorage.getItem("Token");
      if (storedToken) {
        setToken(storedToken);
        console.log("Token exists:", storedToken);
        // Optionally navigate to another screen or handle the token
        navigation.navigate('Records', { token: storedToken }); // Example of navigation if token exists
        
      }
    };

    getData();
  }, [navigation]);


  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.18.208:3000/api/v1/login', {
        email,
        password,
      });
      
      if (response.data.success) {
        console.log("This is token (inside login page) ",response.data.token);
        //this is the token
        const storedToken= await AsyncStorage.setItem("Token",response.data.token);
        Alert.alert('Login Successful', response.data.message);
        // Navigate to another screen or save token

        setToken(storedToken);
        navigation.navigate('Records', { token: response.data.token }); // Example of navigation if token exists
      } else {
        Alert.alert('Login Failed', response.data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Login Error', 'An error occurred during login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" color={`blue`} onPress={handleLogin} />
      <View style={{marginTop:15}}/>
      <Button title='Sign Up ?' color={`red`} onPress={()=>{navigation.navigate('Register')}}>SignUp</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
});

export default LoginScreen;
