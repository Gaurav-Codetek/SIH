import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import if you need to use stored token

const Discover = () => {
    const [totalWorkingHours, setTotalWorkingHours] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTotalWorkingHours = async () => {
            try {
                // Get the token from AsyncStorage (if applicable)
                const token = await AsyncStorage.getItem('Token');
                console.log("token is ",token);
                
                const response = await axios.get('http://192.168.18.208:3000/api/checkins/working-hours', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("response",response.data.totalWorkingHours);
                setTotalWorkingHours(response.data.totalWorkingHours);
                // setTotalWorkingHours(response.data.totalWorkingHours);
            } catch (error) {
                setError('Error fetching total working hours');
            } finally {
                setLoading(false);
            }
        };

        fetchTotalWorkingHours();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }

    return (
        <View style={styles.container}>
          <Text style={styles.title}>Past CheckOut Total Working Hours: {totalWorkingHours}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color:`#007FFF`
    },
    hours: {
        fontSize: 18,
        color: 'red',
        backgroundColor:`green`
    },
    error: {
        fontSize: 18,
        color: 'red',
    },
});

export default Discover;
