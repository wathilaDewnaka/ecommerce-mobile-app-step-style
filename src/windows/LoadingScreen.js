import React, { useContext, useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import { ShopContext } from '../context/ShopContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const LoadingScreen = ({route}) => {
  const { success, orderId } = route.params;
  const { token, url, discount, isSecondEffectDone } = useContext(ShopContext);
  const nav = useNavigation()

  const hasRun = useRef(false);

  const verifyPayment = async () => {
        const res = await axios.post(url + "/api/order/verify", { success, orderId });
        console.log(res.data)
        if (res.data.success) {
            await axios.post(url + "/api/coupons/remove-coupon-user", {}, { headers: { token } });
            nav.navigate("ORDERS")
        } else {
            await axios.post(url + "/api/coupons/deactive-coupon", { discount }, { headers: { token } });
            nav.navigate("HOME_STACK")
        }
    };
    
    useEffect(() => {
        if (!hasRun.current && isSecondEffectDone) {
            verifyPayment();
            hasRun.current = true;
        }
    }, [isSecondEffectDone]); 


  return (
    <LinearGradient colors={['#FDF0F3', '#FFFBFC']} style={styles.linearGradient}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ff6b81" style={styles.spinner} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  linearGradient: {
    flex: 1,
    padding: 20,
  },
  spinner: {
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default LoadingScreen;
