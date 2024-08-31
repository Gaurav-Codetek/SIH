import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { request, PERMISSIONS } from 'react-native-permissions';

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
          setLocation({
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          });
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

  return (
    <View style={styles.container}>
      <Text style={styles.text}>App</Text>
      <Button title="Get Location" onPress={getLocation} />
      {location && (
        <View>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
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
