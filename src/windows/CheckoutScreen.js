import React from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useNavigation } from '@react-navigation/native'; 

const CheckoutScreen = ({ route }) => {
  const { sessionId } = route.params;
  const navigation = useNavigation();

  const handleNavigationChange = (navState) => {
    const { url } = navState;
    if (!(url.includes('https://checkout.stripe.com/'))) {
      const urlParams = new URLSearchParams(new URL(url).search);
      const success = urlParams.get('success'); 
      const orderId = urlParams.get('orderId'); 

      navigation.navigate("Loading", {
        success,
        orderId
      });
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: sessionId }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationChange}
        startInLoadingState={true} 
        renderLoading={() => (
          <LinearGradient colors={['#FDF0F3', '#FFFBFC']} style={styles.linearGradient}>
            <View style={styles.container}>
              <ActivityIndicator size="large" color="#ff6b81" style={styles.spinner} />
              <Text style={styles.text}>Redirecting to checkout...</Text>
            </View>
          </LinearGradient>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1, // Ensure WebView takes the full screen size
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CheckoutScreen;
