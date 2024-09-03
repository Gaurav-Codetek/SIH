// import React, {useEffect, useState} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   Platform,
// } from 'react-native';
// import Geolocation from 'react-native-geolocation-service';
// import {request, PERMISSIONS} from 'react-native-permissions';
// import getDistance from 'geolib/es/getDistance';
// import moment from 'moment';

// // Define office coordinates and check-in distance
// const OFFICE_LATITUDE = 30.747461; // Replace with  office latitude
// const OFFICE_LONGITUDE = 76.7740133; // Replace with  office longitude
// const CHECKIN_DISTANCE_METERS = 150; // 200 meters radius

// const Timer = () => {
//   const [seconds, setSeconds] = useState(0);
//   const [isActive, setIsActive] = useState(false);
//   const [intervalId, setIntervalId] = useState(null);
//   const [location, setLocation] = useState(null);
//   const [permissionGranted, setPermissionGranted] = useState(false);
//   const [status, setStatus] = useState('Not checked in');
//   const [distance1, setDistance] = useState(0);

//   // total time
//   const [totalTime, setTotalTime] = useState('00:00:00');

//   useEffect(() => {
//     const checkPermissions = async () => {
//       if (Platform.OS === 'android') {
//         const permission = await request(
//           PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
//         );
//         setPermissionGranted(permission === 'granted');
//       } else {
//         // Handle iOS or other platforms as needed
//       }
//     };

//     checkPermissions();
//   }, []);

//   const getLocation = () => {
//     if (permissionGranted) {
//       Geolocation.getCurrentPosition(
//         (position) => {
//           const userLocation = {
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           };
//           setLocation({coords: userLocation});
//           checkInOut(userLocation);
//           console.log("user latitude: ", userLocation);
//         },
//         (error) => {
//           console.warn('Error getting location:', error.message);
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 15000,
//           maximumAge: 10000,
//         },
//       );
//     } else {
//       console.warn('Location permission not granted');
//     }
//   };

//   const checkInOut = (userLocation) => {
//     const distance = getDistance(
//       {latitude: userLocation.latitude, longitude: userLocation.longitude},
//       {latitude: OFFICE_LATITUDE, longitude: OFFICE_LONGITUDE},
//     );
//     console.log('user location latitude: ', userLocation.latitude);
//     console.log('user location longitude: ', userLocation.longitude);
//     console.log('user Office latitude: ', OFFICE_LATITUDE);
//     console.log('user Office longitude: ', OFFICE_LONGITUDE);
//     console.log(distance);
//     setDistance(distance);

//     if (distance <= CHECKIN_DISTANCE_METERS) {
//       setStatus('Checked in');
//     } else {
//       setStatus('Checked out');
//     }
//   };

//   useEffect(() => {
//     let locationInterval = null;

//     if (permissionGranted) {
//       locationInterval = setInterval(() => {
//         getLocation();
//       }, 10000); // Update location every 10 seconds instead of 3 seconds
//     }

//     return () => {
//       if (locationInterval) clearInterval(locationInterval);
//     };
//   }, [permissionGranted]);

//   useEffect(() => {
//     if (status === 'Checked in') {
//       const id = setInterval(() => {
//         setSeconds(prevSeconds => prevSeconds + 1);
//       }, 1000);
//       setIntervalId(id);
//     } else {
//       clearInterval(intervalId);
//     }
//     return () => clearInterval(intervalId);
//   }, [status]);

//   const handleStart = () => {
//     if (status === 'Checked in') {
//       setIsActive(true);
//     }
//   };

//   const handlePause = () => {
//     if (status !== 'Checked in') {
//       setIsActive(true);
//     }
//   };

//   const handleReset = () => {
//     setIsActive(false);
//     setSeconds(0);
//   };

//   return (
//     <View style={{}}>
//       <Text
//         style={{
//           color: 'blue',
//           fontWeight: 'bold',
//           padding: 10,
//           borderRadius: 5,
//           fontSize: 20,
//         }}>
//         Total Working Hours:{' '}
//         <Text style={{}}>
//           {Math.floor(seconds / 3600)
//             .toString()
//             .padStart(2, '0')}
//           :{Math.floor((seconds % 3600) / 60)
//             .toString()
//             .padStart(2, '0')}
//           :{(seconds % 60).toString().padStart(2, '0')}
//         </Text>
//       </Text>
//       <Text
//         style={{
//           backgroundColor: status === 'Checked in' ? 'green' : 'red',
//           color: 'white',
//           padding: 10,
//           borderRadius: 5,
//         }}>
//         Status: {status}
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({});

// export default Timer;
