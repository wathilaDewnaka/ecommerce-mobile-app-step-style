import * as React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import Header from '../components/Header';
import CartItem from '../components/CartItem';
import { ShopContext } from '../context/ShopContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; 
import { useEffect } from 'react'; 
import Toast from 'react-native-toast-message';

export default function CartScreen() {
  const { calculateTotal, cartItems, products, isSecondEffectDone, discount, setDiscount, url, token } = React.useContext(ShopContext);
  const [coupon, setCoupon ] = React.useState("");
  const nav = useNavigation();

  const getTotalDiscount = async () => {
    try {
      const res = await axios.post(url + "/api/coupons/get-discount", {}, { headers: { token } });
      setDiscount(res.data.discount || 0);

      if(!res.data.success){
        setDiscount(0);
      }
    } catch (error) {
      console.error("Error fetching discount:", error);
      setDiscount(0);
    }
  };

  const couponHandler = async ()=> {
    try {
      const total = calculateTotal();
      if (discount > 0) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Only one coupon allowed per order !',
          visibilityTime: 3000, // duration in ms
        });
        return;
      }

      const res = await axios.post(url + "/api/coupons/redeem-coupon", { couponCode: coupon }, { headers: { token } });

      if (res.data.success) {
        if (total - 1000 > res.data.discount) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.data.message,
            visibilityTime: 3000, // duration in ms
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.data.message,
          visibilityTime: 3000, // duration in ms
        });
      }

      await getTotalDiscount();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: "Something went wrong !",
        visibilityTime: 3000, // duration in ms
      });
    }
  };


  useEffect(() => {
    async function load() {
      if (isSecondEffectDone) {
        await getTotalDiscount();
        
        const total = calculateTotal();
        
        if (discount > total - 1000 && discount > 0) {
          await axios.post(url + "/api/coupons/deactive-coupon", { discount }, { headers: { token } });
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: "Insufficent total to claim the coupon !",
            visibilityTime: 3000, // duration in ms
          });
          await getTotalDiscount();
        }
      }
    }
    load();
  }, [isSecondEffectDone, calculateTotal]);

  return (
    <LinearGradient colors={['#FDF0F3', '#FFFBFC']} style={styles.linearGradient}>
      <View style={styles.headerC}>
        <Header isCart={true}/>
      </View>

      <ScrollView style={styles.cartItemsContainer}>
        {products.map((item) => {
          if (cartItems[item._id] > 0){
            return <CartItem key={item._id} item={item}/>
          }
          return null;
        })}
      </ScrollView>

      <View style={styles.summaryContainer}>
        <View style={styles.priceAndTitle}>
          <Text style={styles.text}>Sub Total:</Text>
          <Text style={styles.text}>Rs. {calculateTotal()}</Text>
        </View>

        <View style={styles.priceAndTitle}>
          <Text style={styles.text}>Shipping Fee:</Text>
          <Text style={styles.text}>Rs. {calculateTotal() > 0 ? "350" : "0" }</Text>
        </View>

        <View style={styles.priceAndTitle}>
          <Text style={styles.text}>Discount:</Text>
          <Text style={styles.text}>Rs. {discount > calculateTotal() - 1000 ? "0" : discount}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.priceAndTitle}>
          <Text style={[styles.text, styles.totalText]}>Total:</Text>
          <Text style={[styles.text, styles.totalText]}>Rs. {calculateTotal() > 0 ? discount > calculateTotal() - 1000 ? calculateTotal() + 350 : calculateTotal() - discount + 350 : calculateTotal()}</Text>
        </View>

        <View style={styles.couponContainer}>
          <TextInput
            onChangeText={setCoupon}
            value={coupon}
            style={styles.input}
            placeholder="Enter coupon code"
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.applyButton} onPress={couponHandler}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.checkoutButton} onPress={() => nav.navigate("PLACE_ORDER")}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    padding: 20,
  },
  headerC: {
    marginBottom: 20,
  },
  cartItemsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  summaryContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  priceAndTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  divider: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  couponContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    color: '#333',
  },
  applyButton: {
    backgroundColor: '#ff6b81',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#ff6b81',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
