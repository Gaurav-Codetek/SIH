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




// Final code

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { request, PERMISSIONS } from 'react-native-permissions';
import geolib from 'geolib';
import  getDistance  from 'geolib/es/getDistance';
import moment from 'moment';

// Define office coordinates and check-in distance
const OFFICE_LATITUDE = 30.747472; // Replace with your office latitude
const OFFICE_LONGITUDE = 76.7740157; // Replace with your office longitude
const CHECKIN_DISTANCE_METERS = 5; // 200 meters radius

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
  const [distance1,setDistance] = useState(0);

  //current time 
  const [currentTime, setCurrentTime] = useState<string>('');
  //this is the array of time , i will store the 
  // const [statusChangeTimes, setStatusChangeTimes] = useState<string[]>([]);

  // Array to store check-in/check-out statuses
  const [statusLog, setStatusLog] = useState<string[]>([]);
  // Array to store the corresponding timestamps
  const [statusChangeTimes, setStatusChangeTimes] = useState<string[]>([]);


  //total time 
  const [totalTime, setTotalTime] = useState<string>('00:00:00');

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
    console.log("user location latitude: ",userLocation.latitude);
    console.log("user location longitude: ",userLocation.longitude);
    console.log("user Office latitude: ",OFFICE_LATITUDE);
    console.log("user Office longitude: ",OFFICE_LONGITUDE);
    console.log(distance);
    setDistance(distance);

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



  //timer
  useEffect(() => {
    // Function to update the time
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    // Update the time immediately
    updateTime();

    // Set up an interval to update the time every second
    const intervalId = setInterval(updateTime, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

useEffect(() => {
  // Store the status in the statusLog array
  setStatusLog((prevStatusLog) => [...prevStatusLog, status]);

  // Store the corresponding time in the statusChangeTimes array
  setStatusChangeTimes((prevTimes) => [...prevTimes, currentTime]);

  // Calculate the total time whenever the status changes
  calculateTotalTime();

}, [status]); // Depend on status


const calculateTotalTime = () => {
  let totalDuration = moment.duration(); // Initialize total duration

  // General case: Iterate over statusLog for both single and multiple pairs
  for (let i = 0; i < statusLog.length; i++) {
    console.log("i am inside for loop");
    console.log("statusChangeTimes.length",statusChangeTimes.length);

    //edge case where there is only one checkin and one checkout
    if(statusChangeTimes.length == 2){
      console.log("comparing statuslog[0]: ",statusLog[0]);
      console.log("comparing statusChangeTimes[0]: ",statusChangeTimes[0]);
      console.log("comparing statuslog[1]: ",statusLog[1]);
      console.log("comparing statusChangeTimes[1]: ",statusChangeTimes[1]);
      console.log("comparing statuslog[2]: ",statusLog[2]);
      console.log("comparing statusChangeTimes[2]: ",statusChangeTimes[2]);
      if (statusLog[1] == 'Checked in') {
          console.log(`I am inside first if here the checkIn time is ${statusChangeTimes[1]} and checkOut time is ${statusChangeTimes[2]} but i am taking current time which is this ${currentTime}`);
          const checkInTime = statusChangeTimes[1];
          const checkOutTime = currentTime;
          const format = "HH:mm:ss";
          const checkInMoment = moment(checkInTime, format);
          const checkOutMoment = moment(checkOutTime, format);
  
          // Calculate the difference and add it to the total duration
        const diffDuration = moment.duration(checkOutMoment.diff(checkInMoment));
        totalDuration.add(diffDuration);

          // Skip to the next potential "Checked in" after the current "Checked out"
          // i = checkOutIndex;
          break;
      }
    }
    else if (statusLog[i] === 'Checked in') {
      console.log("inside general loop")
      const checkInIndex = i;
      const checkOutIndex = statusLog.indexOf('Checked out', checkInIndex + 1);

      if (checkOutIndex !== -1 ) {
        const checkInTime = statusChangeTimes[checkInIndex];
        const checkOutTime = statusChangeTimes[checkOutIndex];
        // const checkOutTime = currentTime;

        const format = "HH:mm:ss";
        const checkInMoment = moment(checkInTime, format);
        const checkOutMoment = moment(checkOutTime, format);

        // Calculate the difference and add it to the total duration
        const diffDuration = moment.duration(checkOutMoment.diff(checkInMoment));
        totalDuration.add(diffDuration);

        // Skip to the next potential "Checked in" after the current "Checked out"
        i = checkOutIndex;
      }
      else if(checkOutIndex == -1){
        const checkInTime = statusChangeTimes[checkInIndex];
        // const checkOutTime = statusChangeTimes[checkOutIndex];
        const checkOutTime = currentTime;

        
        const format = "HH:mm:ss";
        const checkInMoment = moment(checkInTime, format);
        const checkOutMoment = moment(checkOutTime, format);

        const diffDuration = moment.duration(checkOutMoment.diff(checkInMoment));
        totalDuration.add(diffDuration);
        break;
      }
      // else {
      //  break; // No more check-out found for this check-in, exit the loop
      // }
    }
    // else break;
  }

  // Convert the total duration to "HH:mm:ss"
  const hours = Math.floor(totalDuration.asHours()).toString().padStart(2, '0');
  const minutes = totalDuration.minutes().toString().padStart(2, '0');
  const seconds = totalDuration.seconds().toString().padStart(2, '0');

  setTotalTime(`${hours}:${minutes}:${seconds}`);
};

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
          <Text>Your distance from office : {distance1} meters</Text>
          {/* <Text>Status: {status}</Text> */}
          <Text style={{ 
                backgroundColor: status === 'Checked in' ? 'green' : 'red', 
                color: 'white',
                padding: 10,
                borderRadius: 5 
                }}>
              Status: {status}
          </Text>
          </View>
          </View>

          <Text style={{}}>Time:{currentTime}</Text>
          <View style={{ marginTop: 20 }}>
            <Text>Status Change Log:</Text>
            {statusLog.map((status, index) => (
              <Text key={index}>
                {status} at {statusChangeTimes[index]}
              </Text>
            ))}
          </View>
          
          <Text style={{ 
                color: 'blue', // or 'orange'
                fontWeight: 'bold',
                // padding: 10,
                borderRadius: 5 
                }}>
              Total Time: {totalTime}
          </Text>

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
    backgroundColor: 'grey',
  },
  text: {
    fontSize: 20,
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
});

export default App;





// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, Button, Platform } from 'react-native';
// import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
// import { request, PERMISSIONS } from 'react-native-permissions';
// import geolib from 'geolib';
// import  getDistance  from 'geolib/es/getDistance';
// import moment from 'moment';



// const App = () => {

//   const time1 = moment('12:00:00', 'HH:mm:ss');
//   const time2 = moment('13:00:00', 'HH:mm:ss');
//   const duration = moment.duration(time2.diff(time1));
//   // Get the difference in hours, minutes, and seconds
//   const hours = duration.hours();
//   const minutes = duration.minutes();
//   const seconds = duration.seconds();
//   return (
//     <View>
//       <Text>Time Difference: {hours} hour(s), {minutes} minute(s), and {seconds} second(s)</Text>
//     </View>
//   )
// }

// export default App

// const styles = StyleSheet.create({})