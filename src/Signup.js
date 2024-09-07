// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet, Alert } from 'react-native';
// import axios from 'axios';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// //write here 
// //so we cant write simultaneously right
// //we can 
// //can you see thhe session chat on the right hand side noooo
// //okay we will talk in half duplex mode
// // my views -> in office schmea , we have to create a employee array in which ,as soon as i create the user, the employe
// //will be also be added there (use the department code as a reference ) got itt, first have to chance the schema 
// const SignUp = () => {
//   const [name, setName] = useState('');
//   const [employeeId, setEmployeeId] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [gender, setGender] = useState('');
//   const [address, setAddress] = useState('');
//   const [age, setAge] = useState('');
//   const [selectedOffice, setSelectedOffice] = useState('Select Office Location');
//   const [selectedDepartment, setSelectedDepartment] = useState('Select Department');
//   const [officeModalVisible, setOfficeModalVisible] = useState(false);
//   const [departmentModalVisible, setDepartmentModalVisible] = useState(false);
//   const [offices, setOffices] = useState([]);
//   const [departments, setDepartments] = useState([]);

//   const navigation = useNavigation();

//   // Fetch office locations from the backend when the component mounts
//   useEffect(() => {
//     axios.get('http://192.168.18.208:3000/api/office/getAllOffices')
//       .then(response => {
//         console.log(response.data);
//         setOffices(response.data.offices);  // Adjust based on the actual structure
//       })
//       .catch(error => {
//         console.error("Error fetching offices:", error.response ? error.response.data : error.message);
//         Alert.alert("Error", "Unable to fetch office locations.");
//       });
//   }, []);  // The empty dependency array ensures this effect runs only once

//   // const handleOfficeSelect = (officeName) => {
//   //   setSelectedOffice(officeName);
//   //   setOfficeModalVisible(false);

//   //   // Fetch departments based on selected office
//   //   axios.get(`http://192.168.18.208:3000/api/department/getDepartmentsByOffice/${officeName}`)
//   //     .then(response => {
//   //       console.log(response.data.departments);
//   //       setDepartments(response.data.departments);  // Assuming the response is an array of department objects with 'name'
//   //       setSelectedDepartment('Select Department'); // Reset department selection
//   //     })
//   //     .catch(error => {
//   //       console.error("Error fetching departments:", error);
//   //       Alert.alert("Error", "Unable to fetch departments for the selected office.");
//   //     });
//   // };
//   const handleOfficeSelect = async (officeName) => {
//     setSelectedOffice(officeName);
//     setOfficeModalVisible(false);
  
//     try {
//       const officeData = offices.find((office) => office.name === officeName);
//       if (officeData) {
//         const { latitude, longitude } = officeData;
  
//         // Store latitude and longitude in AsyncStorage
//         await AsyncStorage.setItem('officeLatitude', JSON.stringify(latitude));
//         await AsyncStorage.setItem('officeLongitude', JSON.stringify(longitude));
//         console.log(JSON.stringify(latitude))
//         console.log(JSON.stringify(longitude))
  
//         console.log('Office location saved:', latitude, longitude);
//       }
  
//       // Fetch departments based on selected office
//       const response = await axios.get(`http://192.168.18.208:3000/api/department/getDepartmentsByOffice/${officeName}`);
//       setDepartments(response.data.departments);
//       setSelectedDepartment('Select Department');
//     } catch (error) {
//       console.error("Error fetching departments or storing location:", error);
//       Alert.alert("Error", "Unable to fetch departments for the selected office.");
//     }
//   };
  

//   const handleSignUp = () => {
//     if (!name || !email || !gender || !employeeId || selectedOffice === 'Select Office Location' || selectedDepartment === 'Select Department' || !address || !age) {
//       Alert.alert("Validation Error", "Please fill all the fields");
//       return;
//     }

//     const userData = {
//       EmployeeId: employeeId,
//       name,
//       email,
//       password,
//       gender,
//       Address: address,
//       office: selectedOffice,
//       department: selectedDepartment,
//       age,
//     };

//     axios.post('http://192.168.18.208:3000/api/v1/signup', userData)  // Replace with your actual API endpoint
//       .then(response => {
//         Alert.alert("Success", `Welcome ${name}!`);
//         navigation.navigate('Login');
//       })
//       .catch(error => {
//         console.error("Error signing up:", error);
//         Alert.alert("Error", "Sign-up failed.");
//       });
//   };

//   const renderOfficeItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.option}
//       onPress={() => handleOfficeSelect(item.name)}
//     >
//       <Text>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   const renderDepartmentItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.option}
//       onPress={() => {
//         setSelectedDepartment(item.name);
//         setDepartmentModalVisible(false);
//       }}
//     >
//       <Text>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.input}
//         placeholder="Name"
//         value={name}
//         onChangeText={setName}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Employee ID"
//         value={employeeId}
//         onChangeText={setEmployeeId}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Enter Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Gender"
//         value={gender}
//         onChangeText={setGender}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Address"
//         value={address}
//         onChangeText={setAddress}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Age"
//         value={age}
//         onChangeText={setAge}
//         keyboardType="numeric"
//       />

//       <TouchableOpacity onPress={() => setOfficeModalVisible(true)} style={styles.selector}>
//         <Text>{selectedOffice}</Text>
//       </TouchableOpacity>

//       {selectedOffice !== 'Select Office Location' && (
//         <TouchableOpacity onPress={() => setDepartmentModalVisible(true)} style={styles.selector}>
//           <Text>{selectedDepartment}</Text>
//         </TouchableOpacity>
//       )}

//       <TouchableOpacity onPress={handleSignUp} style={styles.button}>
//         <Text style={styles.buttonText}>Sign Up</Text>
//       </TouchableOpacity>

//       {/* Office Modal */}
//       <Modal
//         visible={officeModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setOfficeModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <FlatList
//               data={offices}
//               renderItem={renderOfficeItem}
//               keyExtractor={(item) => item.name}
//             />
//           </View>
//         </View>
//       </Modal>

//       {/* Department Modal */}
//       <Modal
//         visible={departmentModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setDepartmentModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <FlatList
//               data={departments}
//               renderItem={renderDepartmentItem}
//               keyExtractor={(item) => item.name}
//             />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   input: {
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//     marginBottom: 12,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//   },
//   selector: {
//     padding: 16,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     marginBottom: 12,
//   },
//   button: {
//     backgroundColor: '#007BFF',
//     padding: 16,
//     alignItems: 'center',
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     padding: 20,
//     margin: 20,
//     borderRadius: 8,
//   },
//   option: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//   },
// });

// export default SignUp;

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUp = () => {
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [age, setAge] = useState('');
  const [selectedOffice, setSelectedOffice] = useState('Select Office Location');
  const [selectedDepartment, setSelectedDepartment] = useState('Select Department');
  const [officeModalVisible, setOfficeModalVisible] = useState(false);
  const [departmentModalVisible, setDepartmentModalVisible] = useState(false);
  const [offices, setOffices] = useState([]);
  const [departments, setDepartments] = useState([]);

  const navigation = useNavigation();

  // Fetch office locations from the backend when the component mounts
  useEffect(() => {
    axios.get('http://192.168.188.132:3000/api/office/getAllOffices')
      .then(response => {
        console.log(response.data);
        setOffices(response.data.offices);  // Adjust based on the actual structure
      })
      .catch(error => {
        console.error("Error fetching offices:", error.response ? error.response.data : error.message);
        Alert.alert("Error", "Unable to fetch office locations.");
      });
  }, []);  // The empty dependency array ensures this effect runs only once

  const handleOfficeSelect = async (officeName) => {
    setSelectedOffice(officeName);
    setOfficeModalVisible(false);

    try {
      const officeData = offices.find((office) => office.name === officeName);
      if (officeData) {
        const { latitude, longitude,distance } = officeData;

        // Store latitude and longitude in AsyncStorage
        await AsyncStorage.setItem('officeLatitude', JSON.stringify(latitude));
        await AsyncStorage.setItem('officeLongitude', JSON.stringify(longitude));
        await AsyncStorage.setItem('Minimumdistance', JSON.stringify(distance));
        // console.log(distance);
        // console.log(typeof(distance));
        // await AsyncStorage.setItem('Minimumdistance', distance);

        console.log('Office location saved:', latitude, longitude,distance);
      }

      // Fetch departments based on selected office
      const response = await axios.get(`http://192.168.188.132:3000/api/department/getDepartmentsByOffice/${officeName}`);
      setDepartments(response.data.departments);
      setSelectedDepartment('Select Department');
    } catch (error) {
      console.error("Error fetching departments or storing location:", error);
      Alert.alert("Error", "Unable to fetch departments for the selected office.");
    }
  };

  const handleSignUp = () => {
    if (!name || !email || !gender || !employeeId || selectedOffice === 'Select Office Location' || selectedDepartment === 'Select Department' || !address || !age) {
      Alert.alert("Validation Error", "Please fill all the fields");
      return;
    }

    const userData = {
      EmployeeId: employeeId,
      name,
      email,
      password,
      gender,
      Address: address,
      office: selectedOffice,
      department: selectedDepartment,
      age,
    };

    axios.post('http://192.168.188.132:3000/api/v1/signup', userData)  // Replace with your actual API endpoint
      .then(response => {
        Alert.alert("Success", `Welcome ${name}!`);
        navigation.navigate('Login');
      })
      .catch(error => {
        console.error("Error signing up:", error);
        Alert.alert("Error", "Sign-up failed.");
      });
  };

  const renderOfficeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => handleOfficeSelect(item.name)}
    >
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderDepartmentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => {
        setSelectedDepartment(item.name);
        setDepartmentModalVisible(false);
      }}
    >
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Employee ID"
        value={employeeId}
        onChangeText={setEmployeeId}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <TouchableOpacity onPress={() => setOfficeModalVisible(true)} style={styles.selector}>
        <Text>{selectedOffice}</Text>
      </TouchableOpacity>

      {selectedOffice !== 'Select Office Location' && (
        <TouchableOpacity onPress={() => setDepartmentModalVisible(true)} style={styles.selector}>
          <Text>{selectedDepartment}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={handleSignUp} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Office Modal */}
      <Modal
        visible={officeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setOfficeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={offices}
              renderItem={renderOfficeItem}
              keyExtractor={(item) => item.name}
            />
          </View>
        </View>
      </Modal>

      {/* Department Modal */}
      <Modal
        visible={departmentModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDepartmentModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={departments}
              renderItem={renderDepartmentItem}
              keyExtractor={(item) => item.name}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  selector: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});

export default SignUp;
