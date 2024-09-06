import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student'); // Default role
  const navigation = useNavigation();

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://192.168.18.208:3000/api/v1/signup', {
        name,
        email,
        password,
        role,
      });

      if (response.data.success) {
        console.log("This is full message: ",response.data);
        console.log("Token is this ",response.data.token);
        Alert.alert('Signup Successful', response.data.message);
        // await AsyncStorage.setItem("Token", response.data.token);
        // Navigate to another screen or login page
        navigation.navigate('Login');
      } else {
        Alert.alert('Signup Failed', response.data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Signup Error', 'An error occurred during signup');
    }
  };

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Role"
        value={role}
        onChangeText={setRole}
      />
      <Button title="Signup" color={`blue`} onPress={handleSignup} />
      <View style={{marginTop:15}}/>
      <Button title='Login ?' color={`red`} onPress={()=>{navigation.navigate('Login')}}>Login</Button>

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

export default SignUpScreen;
