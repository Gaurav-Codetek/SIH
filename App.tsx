// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, Button, Platform } from 'react-native';
// import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
// import { request, PERMISSIONS } from 'react-native-permissions';

// // Define types for location state
// interface Location {
//   coords: {
//     latitude: number;
//     longitude: number;
//   };
// }

// const App = () => {
//   const [location, setLocation] = useState<Location | null>(null);
//   const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

//   useEffect(() => {
//     const checkPermissions = async () => {
//       if (Platform.OS === 'android') {
//         const permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
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
//         (position: GeoPosition) => {
//           setLocation({
//             coords: {
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//             },
//           });
//         },
//         (error) => {
//           console.warn('Error getting location:', error.message);
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 15000,
//           maximumAge: 10000,
//         }
//       );
//     } else {
//       console.warn('Location permission not granted');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>App</Text>
//       <Button title="Get Location" onPress={getLocation} />
//       {location && (
//         <View>
//           <Text>Latitude: {location.coords.latitude}</Text>
//           <Text>Longitude: {location.coords.longitude}</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   text: {
//     fontSize: 20,
//   },
// });

// export default App;

// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, Button, Platform } from 'react-native';
// import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
// import { request, PERMISSIONS } from 'react-native-permissions';
// import { getDistance } from 'geolib';

// // Define types for location state
// interface Location {
//   coords: {
//     latitude: number;
//     longitude: number;
//   };
// }

// const App = () => {
//   const [location, setLocation] = useState<Location | null>(null);
//   const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  
//   // Define the geofence center coordinates
//   const geofenceCenter = {
//     latitude: 30.7455217, // Replace with your latitude
//     longitude: 76.7745884 // Replace with your longitude
//   };

//   useEffect(() => {
//     const checkPermissions = async () => {
//       if (Platform.OS === 'android') {
//         const permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
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
//         (position: GeoPosition) => {
//           const currentLocation = {
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           };
//           setLocation({ coords: currentLocation });

//           // Calculate distance from the geofence center
//           const distance = getDistance(currentLocation, geofenceCenter);

//           if (distance <= 50) { // 50 meters radius
//             console.log('Check-In');
//           } else {
//             console.log('Check-Out');
//           }
//         },
//         (error) => {
//           console.warn('Error getting location:', error.message);
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 15000,
//           maximumAge: 10000,
//         }
//       );
//     } else {
//       console.warn('Location permission not granted');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>App</Text>
//       <Button title="Get Location" onPress={getLocation} />
//       {location && (
//         <View>
//           <Text>Latitude: {location.coords.latitude}</Text>
//           <Text>Longitude: {location.coords.longitude}</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   text: {
//     fontSize: 20,
//   },
// });

// export default App;

// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, Button } from 'react-native';
// import BackgroundGeolocation from 'react-native-background-geolocation';
// import { getDistance } from 'geolib';

// const App = () => {
//   const [isTracking, setIsTracking] = useState<boolean>(false);
  
//   // Define the geofence center coordinates
//   const geofenceCenter = {
//     latitude: 30.7455217, // Replace with your latitude
//     longitude: 76.7745884 // Replace with your longitude
//   };

//   useEffect(() => {
//     BackgroundGeolocation.onLocation((location) => {
//       const currentLocation = {
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       };
//       const distance = getDistance(currentLocation, geofenceCenter);

//       if (distance <= 50) { // 50 meters radius
//         console.log('Check-In');
//       } else {
//         console.log('Check-Out');
//       }
//     });

//     BackgroundGeolocation.onProviderChange((provider) => {
//       console.log('Provider change:', provider);
//     });

//     BackgroundGeolocation.onHttp((response) => {
//       console.log('HTTP response:', response);
//     });

//     return () => {
//       BackgroundGeolocation.removeListeners();
//     };
//   }, []);

//   const startTracking = () => {
//     BackgroundGeolocation.configure({
//       desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
//       distanceFilter: 10, // Update every 10 meters
//       stopOnTerminate: false,
//       startOnBoot: true,
//       enableHeadless: true,
//     });

//     BackgroundGeolocation.start();
//     setIsTracking(true);
//   };

//   const stopTracking = () => {
//     BackgroundGeolocation.stop();
//     setIsTracking(false);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Background Geolocation</Text>
//       <Button title={isTracking ? "Stop Tracking" : "Start Tracking"} onPress={isTracking ? stopTracking : startTracking} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   text: {
//     fontSize: 20,
//   },
// });

// export default App;



import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { request, PERMISSIONS } from 'react-native-permissions';
import geolib from 'geolib';
import  getDistance  from 'geolib/es/getDistance';

// Define office coordinates and check-in distance
const OFFICE_LATITUDE = 30.7474678; // Replace with your office latitude
const OFFICE_LONGITUDE = 76.774018; // Replace with your office longitude
const CHECKIN_DISTANCE_METERS = 10; // 200 meters radius

// Define types for location state
interface Location {
  coords: {
    latitude: number;
    longitude: number;
  };
}

const App = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('Not checked in');

  useEffect(() => {
    const checkPermissions = async () => {
      if (Platform.OS === 'android') {
        const permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        setPermissionGranted(permission === 'granted');
      } else {
        // Handle iOS or other platforms as needed
      }
    };

    checkPermissions();
  }, []);

  const getLocation = () => {
    if (permissionGranted) {
      Geolocation.getCurrentPosition(
        (position: GeoPosition) => {
          const userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation({ coords: userLocation });
          checkInOut(userLocation);
        },
        (error) => {
          console.warn('Error getting location:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    } else {
      console.warn('Location permission not granted');
    }
  };

  const checkInOut = (userLocation: { latitude: number; longitude: number }) => {
    const distance = getDistance(
      { latitude: userLocation.latitude, longitude: userLocation.longitude },
      { latitude: OFFICE_LATITUDE, longitude: OFFICE_LONGITUDE }
    );

    if (distance <= CHECKIN_DISTANCE_METERS) {
      setStatus('Checked in');
    } else {
      setStatus('Checked out');
    }
  };

  useEffect(() => {
    
    let intervalId: NodeJS.Timeout | null = null;

    if (permissionGranted) {
      // Start the interval to get location every 3 seconds
      intervalId = setInterval(() => {
        getLocation();
      }, 3000);
    }

    // Cleanup the interval on component unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [permissionGranted]);

  // useEffect(() => {
  //   // Set up an interval to call the function every 10 seconds
    
  //   const intervalId = setInterval(getLocation, 5000);
    

  //   // Clean up the interval on component unmount
  //   return () => clearInterval(intervalId);
  // }, [permissionGranted]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>App</Text>
      <Button title="Get Location" onPress={getLocation} />
      {location && (
        <View style={{marginTop:20}}>
          <Text>User's Details</Text>
          <Text>User's Latitude: {location.coords.latitude}</Text>
          <Text>User's Longitude: {location.coords.longitude}</Text>
          {/* <Text>Status: {status}</Text> */}

          <View style={{marginTop:20}}>
          <Text>Office's Details</Text>
          <Text>Office's Latitude: {OFFICE_LATITUDE}</Text>
          <Text>Office's Longitude: {OFFICE_LONGITUDE}</Text>



          <View style={{marginTop:20}}>
          <Text>Final Ouput</Text>
          <Text>Minimum distance from office: {CHECKIN_DISTANCE_METERS} meters</Text>
          <Text>Status: {status}</Text>
          </View>
          </View>

        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
  },
});

export default App;
