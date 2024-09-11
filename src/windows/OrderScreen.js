import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import Header from '../components/Header';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import Toast from 'react-native-toast-message';

export default function OrderScreen() {
  const { url, token } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const loadOrders = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      setOrders(response.data.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };

  useEffect(() => {
    if (token) {
      loadOrders();
    }
  }, [token]);

  const trackOrders = () => {
    loadOrders();
    Toast.show({
      type: 'success',
      text1: 'Order Updated',
      text2: 'Order status updated successfully!',
      visibilityTime: 3000, // duration in ms
    });
  };

  return (
    <LinearGradient colors={['#FDF0F3', '#FFFBFC']} style={styles.linearGradient}>
      <Header isOrder />

      <ScrollView style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Items</Text>
          <Text style={styles.headerText}>Quantity</Text>
          <Text style={styles.headerText}>Details</Text>
          <Text style={[styles.headerText, { textAlign: "right" }]}>Status</Text>
          <Text style={styles.headerText}>Track</Text>
        </View>

        {loading ? (
          // Center loading spinner and text
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff6b81" />
            <Text style={styles.loadingText}>Loading orders...</Text>
          </View>
        ) : orders.length > 0 ? (
          orders.map((order, index) => (
            <View style={styles.orderRow} key={index}>
              <Text style={styles.itemText}>
                {order.items.map((item, idx) => (
                  <Text key={idx}>
                    {`${item.name} X ${item.quantity} (Size: ${item.size}, Color: ${item.color})`}
                    {idx < order.items.length - 1 && ', '}
                  </Text>
                ))}
              </Text>

              <Text style={styles.quantityText}>{order.items.length}</Text>

              <Text style={styles.detailsText}>
                <Text>Amount: {"\n"}Rs. {order.amount}</Text>{"\n"}
                <Text>Discount: {"\n"}Rs. {order.discount}</Text>{"\n"}
                <Text>Mode: {"\n"}{order.mode}</Text>
              </Text>

              <Text style={styles.statusText}>{order.status}</Text>

              <Text onPress={trackOrders} style={styles.trackButton}>Track</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noOrdersText}>No orders available</Text>
        )}
      </ScrollView>
      
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerText: {
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  itemText: {
    flex: 2,
    flexWrap: 'wrap',
    textAlign: 'left',
    fontSize: 12,
  },
  quantityText: {
    flex: 1,
    textAlign: 'left',
    fontSize: 12,
  },
  detailsText: {
    flex: 2,
    textAlign: 'left',
    fontSize: 12,
  },
  statusText: {
    flex: 1,
    textAlign: 'left',
    fontSize: 12,
  },
  trackButton: {
    flex: 1,
    color: '#007BFF',
    textAlign: 'left',
  },
  table: {
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ff6b81',
    fontWeight: 'bold',
  },
  noOrdersText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#ff6b81',
    marginTop: 20,
  },
});
