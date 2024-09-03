import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Platform,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import {request, PERMISSIONS} from 'react-native-permissions';
import geolib from 'geolib';
import getDistance from 'geolib/es/getDistance';
import moment from 'moment';

// Define office coordinates and check-in distance
// const OFFICE_LATITUDE = 30.747472; // Replace with  office latitude
// const OFFICE_LONGITUDE = 76.7740157; // Replace with  office longitude
const OFFICE_LATITUDE = 30.7491385; // Replace with  office latitude
const OFFICE_LONGITUDE = 76.7567876; // Replace with  office longitude
const CHECKIN_DISTANCE_METERS = 150; // 200 meters radius
interface Location {
  coords: {
    latitude: number;
    longitude: number;
  };
}

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const [location, setLocation] = useState<Location | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('Not checked in');
  const [distance1, setDistance] = useState(0);

  //total time
  const [totalTime, setTotalTime] = useState<string>('00:00:00');

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

  const getLocation = () => {
    if (permissionGranted) {
      Geolocation.getCurrentPosition(
        (position: GeoPosition) => {
          const userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation({coords: userLocation});
          checkInOut(userLocation);
          console.log("user latitude: ",userLocation );
        },
        error => {
          console.warn('Error getting location:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    } else {
      console.warn('Location permission not granted');
    }
  };

  const checkInOut = (userLocation: {latitude: number; longitude: number}) => {
    const distance = getDistance(
      {latitude: userLocation.latitude, longitude: userLocation.longitude},
      {latitude: OFFICE_LATITUDE, longitude: OFFICE_LONGITUDE},
    );
    console.log('user location latitude: ', userLocation.latitude);
    console.log('user location longitude: ', userLocation.longitude);
    console.log('user Office latitude: ', OFFICE_LATITUDE);
    console.log('user Office longitude: ', OFFICE_LONGITUDE);
    console.log(distance);
    setDistance(distance);

    if (distance <= CHECKIN_DISTANCE_METERS) {
      setStatus('Checked in');
    } else {
      setStatus('Checked out');
    }
  };
  useEffect(() => {
    let locationInterval: NodeJS.Timeout | null = null;

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
    if (status == 'Checked in') {
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
    if (status == 'Checked in') {
      setIsActive(true);
    }
  };

  const handlePause = () => {
    if (status != 'Checked in') {
      setIsActive(true);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
  };



  const currentTime = "12:34:56";
  const locationStatus = "Inside Office";
  const feedbackMessage = "You have successfully checked in.";
  const isCheckedIn = false;
  console.log("helo")

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: 'blue',
          fontWeight: 'bold',
          padding: 10,
          borderRadius: 5,
          fontSize: 20,
        }}>
        Total Working Hours:{' '}
        <Text style={styles.timer}>
          {Math.floor(seconds / 60)
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
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  timer: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logo: {
    width: 40,
    height: 40,
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  statusText: {
    fontSize: 20,
    color: '#555',
  },
  checkButton: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkedIn: {
    backgroundColor: '#4CAF50',
  },
  checkedOut: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  feedbackText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 40,
    textAlign: 'center',
  },
  featureContainer: {
    width: '100%',
    marginBottom: 40,
  },
  featureButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});

export default Timer;
