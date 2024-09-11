import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import { LinearGradient } from 'expo-linear-gradient'; 
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function LoginScreen({ isAuthenticated, setIsAuthenticated }) {
  const [state, setState] = useState('login');
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    otp: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const { url, setToken } = useContext(ShopContext);


  useEffect(() => {
    // Show the loading message for 4 seconds
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 4000);

  }, []);

  const handleInputChange = (name, value) => {
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    setLoading(true);
    let newUrl = url;

    switch (state) {
      case 'login':
        newUrl += '/api/user/login';
        break;
      case 'Sign Up':
        newUrl += '/api/user/send-otp';
        break;
      case 'OTP':
        newUrl += '/api/user/register';
        break;
      case 'Forget Password':
        newUrl += '/api/user/forget-password';
        break;
      case 'Forget Password OTP':
        newUrl += '/api/user/reset-password';
        break;
      default:
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong !',
          visibilityTime: 3000, // duration in ms
        });
        setLoading(false);
        return;
    }
    
    try {
      const res = await axios.post(newUrl, data);


      if (res.data.success) {
        if (state === 'login') {
          await AsyncStorage.setItem('token', res.data.token);
          setToken(res.data.token);
          setIsAuthenticated(true);
        } else if (state === "Forget Password"){
          setState("Forget Password OTP");
        } else if (state === "Forget Password OTP"){
          await AsyncStorage.setItem('token', res.data.token);
          setToken(res.data.token);
          setIsAuthenticated(true);
        } else if (state === "Sign Up"){
          setState("OTP");
        } else if (state === "OTP"){
          await AsyncStorage.setItem('token', res.data.token);
          setToken(res.data.token);
          setIsAuthenticated(true);
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong !',
          visibilityTime: 3000, // duration in ms
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong !',
        visibilityTime: 3000, // duration in ms
      });
      console.log(error)
    } finally {
      setLoading(false);
    }
  };



  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b81" />
        <Text style={styles.loadingText}>Welcome to <Text style={{color: 'red'}}>StepStyle</Text></Text>
      </View>
    );
  }


  return (
    <LinearGradient colors={['#FDF0F3', '#FFFBFC']} style={styles.linearGradient}>
    <View style={styles.container}>
      <Text style={styles.header}>
        {state === 'Forget Password OTP'
          ? 'Forget Password OTP'
          : state !== 'OTP'
          ? state.charAt(0).toUpperCase() + state.slice(1).toLowerCase()
          : 'OTP Verification'}
      </Text>

      {state !== 'OTP' && state !== 'Forget Password OTP' && (
        <>
          {state === 'Sign Up' && (
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={data.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={data.email}
            onChangeText={(text) => handleInputChange('email', text)}
          />
          {state !== 'Forget Password' && (
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={data.password}
                onChangeText={(text) => handleInputChange('password', text)}
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#6c757d" />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {state === 'OTP' && (
        <>
          <Text style={styles.infoText}>
            We have just sent you a six-digit one-time passcode to {data.email}. Please enter it to verify your email address. Check your spam folder if the email is not there! OTP is valid for 10 minutes.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="OTP Number"
            value={data.otp}
            onChangeText={(text) => handleInputChange('otp', text)}
          />
        </>
      )}

      {state === 'Forget Password OTP' && (
        <>
          <Text style={styles.infoText}>
            We have just sent you a six-digit one-time passcode to {data.email}. Please enter it to verify your email address. Check your spam folder if the email is not there! OTP is valid for 10 minutes.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="OTP Number"
            value={data.otp}
            onChangeText={(text) => handleInputChange('otp', text)}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry={!showPassword}
              value={data.newPassword}
              onChangeText={(text) => handleInputChange('newPassword', text)}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
              <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#6c757d" />
            </TouchableOpacity>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={!showPassword}
              value={data.confirmNewPassword}
              onChangeText={(text) => handleInputChange('confirmNewPassword', text)}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
              <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#6c757d" />
            </TouchableOpacity>
          </View>
        </>
      )}

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: '#ff6b81',
          paddingVertical: 15,
          borderRadius: 5,
          alignItems: 'center',
          marginTop: 20,
          width: "100%"
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontSize: 16 }}>
            {state === 'Forget Password'
              ? 'Reset Password'
              : state === 'login' || state === 'Forget Password OTP'
              ? 'Login'
              : 'Create an account'}
          </Text>
        )}
      </TouchableOpacity>


      {(state !== 'OTP' && state !== 'Forget Password') && (
        <View style={styles.termsContainer}>
          <TouchableOpacity>
            <Text>By clicking continue you agree to our <Text style={styles.linkText}>Terms & Conditions</Text></Text>
          </TouchableOpacity>
        </View>
      )}

      {state === 'Sign Up' ? (
        <Text>
          Already have an account? <Text onPress={() => setState('login')} style={styles.linkText}>Login</Text>
        </Text>
      ) : state === 'login' ? (
        <View>
          <Text>
            Don't have an account? <Text onPress={() => setState('Sign Up')} style={styles.linkText}>Sign Up</Text>
          </Text>
          <Text style={styles.linkText} onPress={() => setState('Forget Password')}>
            Forget password?
          </Text>
        </View>
      ) : null}
    </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  linearGradient: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  termsContainer: {
    marginVertical: 20
  },
  linkText: {
    color: '#FF7F50',
    fontWeight: 'bold',
  },
  infoText: {
    marginBottom: 20,
    textAlign: 'center',
  },
});