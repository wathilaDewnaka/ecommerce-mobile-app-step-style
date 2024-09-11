import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'; 
import Header from '../components/Header';
import Toast from 'react-native-toast-message';

export default function PlaceOrder() {
  const { calculateTotal, cartItems, token, url, products, discount, color, size } = useContext(ShopContext);
  const navigation = useNavigation();

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Stripe');

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then((response) => {
        const countryOptions = response.data.map((country) => country.name.common);
        setCountries(countryOptions);
      })
      .catch((error) => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong !',
          visibilityTime: 3000, // duration in ms
        });
      });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      axios.post('https://countriesnow.space/api/v0.1/countries/cities', { country: selectedCountry })
        .then((response) => {
          setCities(response.data.data);
        })
        .catch((error) => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Something went wrong !',
            visibilityTime: 3000, // duration in ms
          });
          setCities([]);
        });
    }
  }, [selectedCountry]);

  const changeHandle = (name, value) => {
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const placeOrder = async () => {
    if(calculateTotal() <= 0){
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Total should be greater than zero !',
        visibilityTime: 3000, // duration in ms
      });
      return;
    }

    // Basic validation
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'state', 'zipcode', 'country'];
    for (const field of requiredFields) {
      if (!data[field]) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please fill all the fields !',
          visibilityTime: 3000, // duration in ms
        });
        return;
      }
    }

    let orderItems = [];

    products.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { 
          ...item, 
          quantity: cartItems[item._id], 
          size: size[item._id], 
          color: color[item._id] 
        };
    
        // Remove description and image to balance server payload
        delete itemInfo.description;
        delete itemInfo.image;
    
        orderItems.push(itemInfo);
      }
    });
    

    const orderData = {
      address: data,
      items: orderItems,
      amount: calculateTotal(),
      discount: discount,
      paymentMethod: paymentMethod,
    };

    try {
      const res = await axios.post(`${url}/api/order/place/`, orderData, {
        headers: { token },
      });

      if (res.data.success) {
        const { session_url } = res.data;
        navigation.navigate('Checkout', { sessionId: session_url });
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
    }
  };

  return (
    <LinearGradient colors={['#FDF0F3', '#FFFBFC']} style={styles.linearGradient}>
      <Header isCart={true} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.header}>Delivery Information</Text>
          <View style={styles.inputGroup}>
            <TextInput
              onChangeText={(text) => changeHandle('firstName', text)}
              value={data.firstName}
              placeholder="First name"
              style={styles.input}
              required
            />
            <TextInput
              onChangeText={(text) => changeHandle('lastName', text)}
              value={data.lastName}
              placeholder="Last name"
              style={styles.input}
              required
            />
          </View>
          <TextInput
            onChangeText={(text) => changeHandle('email', text)}
            value={data.email}
            placeholder="Email address"
            style={styles.input}
            required
          />
          <TextInput
            onChangeText={(text) => changeHandle('phone', text)}
            value={data.phone}
            placeholder="Phone number"
            style={styles.input}
            required
          />
          <TextInput
            onChangeText={(text) => changeHandle('street', text)}
            value={data.street}
            placeholder="Street"
            style={styles.input}
            required
          />
          <View style={styles.inputGroup}>
            <TextInput
              onChangeText={(text) => changeHandle('zipcode', text)}
              value={data.zipcode}
              placeholder="ZIP Code"
              style={styles.input}
              required
            />
            <TextInput
              onChangeText={(text) => changeHandle('state', text)}
              value={data.state}
              placeholder="State"
              style={styles.input}
              required
            />
          </View>

          <View style={styles.selectWrapper}>
            <Picker
              selectedValue={selectedCountry}
              onValueChange={(value) => {
                setSelectedCountry(value);
                changeHandle('country', value);
                setCities([]); // Reset cities when country changes
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select Country" value={null} />
              {countries.map((country) => (
                <Picker.Item key={country} label={country} value={country} />
              ))}
            </Picker>
          </View>

          <View style={styles.selectWrapper}>
            <Picker
              selectedValue={data.city}
              onValueChange={(value) => changeHandle('city', value)}
              style={styles.picker}
              enabled={!!selectedCountry}
            >
              <Picker.Item label="Select City" value={null} />
              {cities.map((city) => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.summary}>
          <Text style={styles.header}>Summary</Text>
          <View style={styles.summaryItem}>
            <Text>Subtotal:</Text>
            <Text>Rs. {calculateTotal()}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text>Shipping Fee:</Text>
            <Text>{calculateTotal() > 0 ? 'Rs. 350' : 'Rs. 0'}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text>Coupon Discount:</Text>
            <Text>Rs. {discount > calculateTotal() - 1000 ? "0" : discount}</Text>
          </View>
          <View style={[styles.summaryItem, {marginTop: 10, marginBottom: 10}]}>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>Total:</Text>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>
              Rs. {calculateTotal() > 0 ? discount > calculateTotal() - 1000 ? calculateTotal() + 350 : calculateTotal() - discount + 350 : calculateTotal()}
            </Text>
          </View>

          <View style={styles.selectWrapper}>
            <Picker
              selectedValue={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value)}
              style={styles.picker}
            >
              <Picker.Item label="Pay with Card" value="Stripe" />
              <Picker.Item label="Cash on Delivery" value="COD" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.button} onPress={placeOrder}>
            <Text style={styles.buttonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  form: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  summary: {
    marginTop: 20,
  },
  linearGradient: {
    flex: 1,
    padding: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  selectWrapper: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ff6b81',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    color: '#000',
  },
});
