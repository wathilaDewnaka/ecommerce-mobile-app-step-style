import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { ShopContext } from '../context/ShopContext';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { LinearGradient } from 'expo-linear-gradient'; 
import axios from 'axios';

const AccountScreen = () => {
  const { token, setToken, url } = useContext(ShopContext);
  const nav = useNavigation();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true); // Loading state

  async function logout() {
    await AsyncStorage.removeItem("token");
    setToken("");
  }

  async function userDetails() {
    try {
      const res = await axios.get(url + "/api/user/details", { headers: { token } });
      setEmail(res.data.email);
      setName(res.data.name);
    } catch (error) {
      console.error("Failed to fetch user details", error);
    } finally {
      setLoading(false); // Stop loading once the data is fetched
    }
  }

  useEffect(() => {
    userDetails();
  }, []);

  return (
    <LinearGradient colors={['#FDF0F3', '#FFFBFC']} style={styles.linearGradient}>
      <View style={styles.container}>
        <Header isAccount={true} />
        {loading ? (
          // Center the loading indicator and the text
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff6b81" />
            <Text style={styles.loadingText}>Account details loading...</Text>
          </View>
        ) : (
          <>
            <Image style={styles.image} source={require("../assets/user.png")} />
            <Text style={styles.title}>Account Information</Text>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{name}</Text>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{email}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.btn} onPress={logout}>
                <Text style={styles.btnText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    marginBottom: 20,
  },
  linearGradient: {
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: 'white',
  },
  buttonContainer: {
    marginTop: 20,
  },
  btn: {
    backgroundColor: '#ff6b81',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Style for loading container
  loadingContainer: {
    flex: 1,
    justifyContent: 'center', // Centers vertically
    alignItems: 'center', // Centers horizontally
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ff6b81',
    fontWeight: 'bold',
  },
});

export default AccountScreen;
