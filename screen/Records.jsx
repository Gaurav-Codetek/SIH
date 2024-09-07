import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity,Platform, ScrollView, StyleSheet, Text, View, AppState } from 'react-native';
import BackgroundActions from 'react-native-background-actions';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS} from 'react-native-permissions';
import getDistance from 'geolib/es/getDistance';
import moment from 'moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Discover from './Discover';


const Records = ({ route }) => {
  const { token: storedToken, latitude,longitude,CHECKIN_DISTANCE_METERS } = route.params; // Access the token from route params
  const [token, setToken] = useState(storedToken);
  const [officeLat, setOfficeLat] = useState(latitude || 0);
  const [officeLon, setOfficeLon] = useState(longitude || 0);

  const [selectedBox, setSelectedBox] = useState('Your Status');
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [location, setLocation] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [permissionGrantedBG, setPermissionGrantedBG] = useState(false);
  const [status, setStatus] = useState('Not checked in');
  const [distance1, setDistance] = useState(0);
  const [Latitude, setLatitude] = useState();
  const [Longitude, setLongitude] = useState();
  const [userOfficeLatitude, setUserOfficeLatitude] = useState(0);
  const [userOfficeLongitude, setUserOfficeLongitude] = useState(0);
useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch Token
      const storedToken = await AsyncStorage.getItem("Token");
      if (storedToken) {
        setToken(storedToken);
        console.log("Token exists:", storedToken);
      }

    } catch (error) {
      console.error("Error retrieving data from AsyncStorage:", error);
    }
  };

  fetchData();
}, []);
// const CHECKIN_DISTANCE_METERS = 200; 
//current time 
  const [currentTime, setCurrentTime] = useState('');

  // Array to store check-in/check-out statuses
  const [statusLog, setStatusLog] = useState([]);
  // Array to store the corresponding timestamps
  const [statusChangeTimes, setStatusChangeTimes] = useState([]);

  const [totalTime, setTotalTime] = useState('00:00:00');
  useEffect(() => {
    const checkPermissions = async () => {
      if (Platform.OS === 'android') {
        const permission = await request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
        setPermissionGranted(permission === 'granted');
      } else {
        // Handle iOS or other platforms as needed
      }
    };

    checkPermissions();
  }, []);

  useEffect(() => {
    const checkPermissions = async () => {
      if (Platform.OS === 'android') {
        const permission = await request(
          PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
        );
        setPermissionGrantedBG(permission === 'granted');
      } else {
        // Handle iOS or other platforms as needed
      }
    };

    checkPermissions();
  }, []);

  const getLocation = () => {
    console.log("Checking for get location permission  ");
    if (permissionGranted) {
        console.log("Permission is granted");
        Geolocation.getCurrentPosition(
        (position) => {
          // watch position async  ( possible ) 
          //push notification
          const userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation({coords: userLocation});
          checkInOut(userLocation);
          console.log("user latitude: ", userLocation);
        },
        (error) => {
          console.warn('Error getting location:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 30000, //30 seconds
          maximumAge: 10000,
        },
      );
    } else {
      console.warn('Location permission not granted');
    }
  };

  const checkInOut = (userLocation) => {
    console.log("Now first calculating the type ");
    // console.log(typeof(userOfficeLatitude));
    // console.log(typeof(userOfficeLongitude));
    // console.log(typeof(userLocation.latitude));
    // console.log(typeof(userLocation.longitude));
    console.log("User Location:", userLocation);
    console.log("Office Coordinates:", {latitude: officeLat, longitude: officeLon});
    const distance = getDistance(
      {latitude: userLocation.latitude, longitude: userLocation.longitude},
      {latitude: officeLat, longitude: officeLon},
    );
    console.log('user location latitude: ', userLocation.latitude);
    console.log('user location longitude: ', userLocation.longitude);
    // setLatitude(userLocation.latitude);
    // setLongitude(userLocation.longitude);
    // console.log('user Office latitude: ', OFFICE_LATITUDE);
    // console.log('user Office longitude: ', OFFICE_LONGITUDE);
    console.log(distance);
    setDistance(distance);

    if (distance <= CHECKIN_DISTANCE_METERS) {
      setStatus('Checked in');
    } else {
      setStatus('Checked out');
    }
  };

  useEffect(() => {
    let locationInterval = null;

    if (permissionGranted) {
      locationInterval = setInterval(() => {
        getLocation();
      }, 10000); // Update location every 10 seconds instead of 3 seconds
    }

    return () => {
      if (locationInterval) clearInterval(locationInterval);
    };
  }, [permissionGranted]);

  useEffect(() => {
    if (status === 'Checked in') {
      const id = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [status]);

  const handleStart = () => {
    if (status === 'Checked in') {
      setIsActive(true);
    }
  };

  const handlePause = () => {
    if (status !== 'Checked in') {
      setIsActive(true);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
  };
  
  useEffect(() => {
    if (status) {
      setStatusLog((prevStatusLog) => [...prevStatusLog, status]);
      getCurrentTime();
      setStatusChangeTimes((prevTimes) => [...prevTimes, currentTime]);
  
      console.log("Stored Token:", storedToken);
      if (storedToken) {
      //First API
      //This API call to update status chechin model  -> used to calculate the total working hours and history of user
      axios.post('http://192.168.188.132:3000/api/checkins/checkin', {
        latitude: Latitude,
        longitude: Longitude,
        status: status,
        // totalWorkingHours:totalTime
      }, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })
      .then(response => {
        console.log(response.data.message);
      })
      .catch(error => {
        console.error('Error recording status change:', error.response ? error.response.data : error.message);
      });
      //Second API 
      // This API call is to manipulate the User model -> CheckIN -> true or false 
      console.log("Checking status");
      console.log(status);
      axios.put('http://192.168.188.132:3000/api/v1/updateStatus', {
        status: status=='Checked in' ? true : false
      }, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        .then(response => {
          console.log('Status change recorded(in 2nd API):', response.data);
          console.log("2nd API ends here");
        })
        .catch(error => {
          console.error('Error recording status change(in 2nd api):', error.response ? error.response.data : error.message);
        });


        
      if(status == 'Checked in'){
        // 3.1 api for live stats checkedIn
        axios.post('http://192.168.188.132:3000/api/v1/admin/recentData', {
          // employee:
        }, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        .then(response => {
          console.log('Status change recorded:', response.data);
        })
        .catch(error => {
          console.error('Error recording status change:', error.response ? error.response.data : error.message);
        });
        //3.2 API to update the checkedINEmployee array of that particular office
        axios.post('http://192.168.188.132:3000/api/office/checkInUserOffice', {
        }, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        .then(response => {
          console.log('checkInUserOffice:', response.data);
        })
        .catch(error => {
          console.error('Error While pushing the employee inside the array of CheckedIN employee change:', error.response ? error.response.data : error.message);
        });
      }
      else{
        //3.4 api for live stats checkedOut
        axios.put('http://192.168.188.132:3000/api/v1/admin/recentData', {
          // employee:
        }, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        .then(response => {
          console.log('Status change recorded:', response.data);
        })
        .catch(error => {
          console.error('Error recording status change:', error.response ? error.response.data : error.message);
        }); 

        //3.5 API to update the checkedINEmployee array of that particular office
        axios.post('http://192.168.188.132:3000/api/office/checkOutUserOffice', {
        }, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        .then(response => {
          console.log('checkInUserOffice:', response.data);
        })
        .catch(error => {
          console.error('Error While pushing the employee inside the array of CheckedIN employee change:', error.response ? error.response.data : error.message);
        });
 
      }
      
      } else {
        console.error('No token available');
      }
    }
  }, [status, token]); // Depend on status and token
  
  const getCurrentTime = () => {
    const now = new Date();
    return setCurrentTime(now.toLocaleTimeString()); // Returns time in a readable format
  };



  //get location background 
  const getLocationBG = () => {
    console.log("Checking for get location permission in background ");
    if (permissionGrantedBG) {
        console.log("Permission is granted in background");
      Geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation({coords: userLocation});
          checkInOut(userLocation);
          console.log("user latitude: ", userLocation);
        },
        (error) => {
          console.warn('Error getting location:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 30000, //30 seconds
          maximumAge: 10000,
        },
      );
    } else {
      console.warn('Location permission not granted');
    }
  };


  //background
  const [counter, setCounter] = useState(0);

  const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

  const veryIntensiveTask = async (taskDataArguments) => {
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {
      for (let i = 0; BackgroundActions.isRunning(); i++) {
        getLocationBG();
        // checkInOut();
        
        useEffect(() => {
          console.log("Currenly Status in bg: ", status);
          if (status === 'Checked in') {
            const id = setInterval(() => {
              setSeconds(prevSeconds => prevSeconds + 1);
            }, 1000);
            setIntervalId(id);
          } else {
            clearInterval(intervalId);
          }
          return () => clearInterval(intervalId);
        }, [status]);
      
          useEffect(() => {
            // Store the status in the statusLog array
            setStatusLog((prevStatusLog) => [...prevStatusLog, status]);
            
            getCurrentTime();
            // Store the corresponding time in the statusChangeTimes array
            setStatusChangeTimes((prevTimes) => [...prevTimes, currentTime]);
          
          }, [status]); // Depend on status


        await sleep(10000); // Wait for the delay period
      }
      resolve(); // End the task when the loop finishes
    });
  };

  useEffect(() => {
    const options = {
      taskName: 'Counter',
      taskTitle: 'Smart ChecKIn Running',
      taskDesc: 'Smart ChecKIn  in the background',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      color: '#ff00ff',
      linkingURI: 'yourapp://home', // Optional: Deep link to open when clicking on notification
      parameters: {
        delay: 1000,
      },
      stopWithTask: false, // Ensure the task does not stop when the app is closed
    };

    const startBackgroundTask = async () => {
      try {
        await BackgroundActions.start(veryIntensiveTask, options);
        console.log('Background task started');
      } catch (e) {
        console.error('Error starting background task:', e);
      }
    };

    const stopBackgroundTask = async () => {
      try {
        await BackgroundActions.stop();
        console.log('Background task stopped');
      } catch (e) {
        console.error('Error stopping background task:', e);
      }
    };

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background') {
        startBackgroundTask();
      } else if (nextAppState === 'active') {
        stopBackgroundTask();
        // startBackgroundTask();
      }

    };

    // Add event listener
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup by removing the listener and stopping the background task
    return () => {
      subscription.remove();
      stopBackgroundTask();
    };
  }, []);



  //UI
  const renderDetails = () => {
    switch (selectedBox) {
      case 'Your Status':
        return (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsText}>Details for Your Status</Text>
            <Text
      style={{
        color: 'blue',
        fontWeight: 'bold',
        padding: 10,
        borderRadius: 5,
        fontSize: 20,
      }}>
      Total Working Hours:{' '}
      <Text style={{}}>
        {Math.floor(seconds / 3600)
          .toString()
          .padStart(2, '0')}
        :{Math.floor((seconds % 3600) / 60)
          .toString()
          .padStart(2, '0')}
        :{(seconds % 60).toString().padStart(2, '0')}
      </Text>
    </Text>
    <Text
      style={{
        backgroundColor: status === 'Checked in' ? 'green' : 'red',
        color: 'white',
        padding: 10,
        borderRadius: 5,
      }}>
      Status: {status}
    </Text>
          </View>
        );
      case 'ABHA':
        return (
          <View style={[styles.detailsContainer]}>
            <Discover/>
          </View>
        );
      case 'Vaccination':
        return (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsText}>Check Your Rank in Office</Text>
          </View>
        );
      case 'COVID Updates':
        return (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsText}>Details for SmartCheckIn Updates</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
    {/* Header */}
    <View style={styles.header}>
      <Text style={styles.headerText}>SmartCheckIn</Text>
      <View style={styles.headerIcons}>
        <Icon name="chatbubble-outline" size={20} color="#fff" />
        <Icon name="notifications-outline" size={20} color="#fff" style={{ marginLeft: 10 }} />
      </View>
    </View>
    <View>
      <Text>Office Longitude: {officeLat}</Text>
      <Text>Office Longitude: {officeLon}</Text>
      <Text>minimum distance: {CHECKIN_DISTANCE_METERS}</Text>
    </View>

<View style={{marginTop:15,padding:4}}>
    <View style={styles.boxContainer}>
      <TouchableOpacity
        style={[styles.box,{backgroundColor: status === 'Checked in' ? `green`: 'red'}]}
        onPress={() => setSelectedBox('Your Status')}
      >
        <Icon name="heart-outline" size={30} color= {status === 'Checked in' ? `blue`: 'orange'} />
        <Text style={styles.boxText}>Your Status</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          alignItems: 'center',
          padding: 10,
          backgroundColor: selectedBox=='ABHA' ? 'skyblue':`white`,
          borderRadius: 8,
          width: '22%',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.3,
          shadowRadius: 2,
          elevation: 3,
        }}
        onPress={() => setSelectedBox('ABHA')}
      >
        <Icon name="card-outline" size={30} color="#1E88E5" />
        <Text style={[styles.boxText]}>Total Hours</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.box}
        onPress={() => setSelectedBox('Vaccination')}
      >
        <Icon name="medkit-outline" size={30} color="#1E88E5" />
        <Text style={styles.boxText}>Rank</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.box}
        onPress={() => setSelectedBox('COVID Updates')}
      >
        <Icon name="megaphone-outline" size={30} color="#1E88E5" />
        <Text style={styles.boxText}>Updates</Text>
      </TouchableOpacity>
    </View>

    {renderDetails()}
  </View>

  <View style={styles.container}>
    <Text>SmartCheckIn Status: {status}</Text>
    <Text>Distance from Office: {distance1} meters</Text>
    {/* <TouchableOpacity style={{backgroundColor:`yellow`,margin:4,padding:5,borderRadius:10,marginBottom:10}} onPress={startBackgroundTask}>
      <Text>Start Background Task</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{backgroundColor:`orange`,padding:5,borderRadius:10}}  onPress={stopBackgroundTask}>
      <Text>Stop Background Task</Text>
    </TouchableOpacity> */}
  </View>

    <ScrollView style={styles.recordsContainer}>
      <Text style={styles.recordsTitle}>My Previous Records</Text>
      <TouchableOpacity style={styles.recordItem}>
      <Text>Minimum distance from office: {CHECKIN_DISTANCE_METERS} meters</Text>
      <Text>Your distance from office : {distance1} meters</Text>
      </TouchableOpacity>
      <View style={styles.recordItem}>
          {statusLog.map((status, index) => (
            <Text key={index} >
              <Text style={{ backgroundColor: status=='Checked in' ? 'green' : 'red'}}>{status}</Text> at {statusChangeTimes[index]}
            </Text>
          ))}
      </View>
    </ScrollView>
      {/* <Text style={styles.counterText}>Counter: {counter}</Text> */}
  </View>
  );
};

export default Records;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: '#f4f4f4',
        padding: 15,
      },
      boxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
      },
      box: {
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        width: '22%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
        // backgroundColor:`red`
      },
      boxText: {
        marginTop: 5,
        fontSize: 14,
        color: 'blue',
      },
      detailsContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
        // backgroundColor:`red`
      },
      detailsText: {
        fontSize: 16,
        color: '#333',
      },
  container: {
    // flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    backgroundColor: '#1E88E5',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  userInfo: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
  },
  userInfoText: {
    // flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  kycText: {
    color: 'green',
    marginTop: 2,
  },
  abhaText: {
    marginTop: 5,
    color: '#666',
  },
  abhaAddress: {
    color: '#666',
  },
  qrCode: {
    width: 40,
    height: 40,
  },
  recordsContainer: {
    backgroundColor: '#fff',
    padding: 15,
  },
  recordsTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  recordItem: {
    // paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  recordText: {
    fontSize: 16,
  },
  linkText: {
    color: '#888',
    marginTop: 2,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navText: {
    color: '#1E88E5',
  },
});