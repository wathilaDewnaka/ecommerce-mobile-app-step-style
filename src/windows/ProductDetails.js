import * as React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Header from '../components/Header';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { ShopContext } from '../context/ShopContext';

export default function ProductDetails() {
  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = ['#000000', '#E5E7EB', '#FDE047', '#EA580C'];

  const [sizeS, setSizeS] = React.useState("M");
  const [colorC, setColorC] = React.useState("#000000");
  const {cartItems, addToCart, removeCart} = React.useContext(ShopContext)

  const route = useRoute();
  const item = route.params?.item; // Optional chaining to handle undefined route params

  if (!item) {
    // Handle the case where item is not available
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Item not found.</Text>
      </View>

    );
  }

  return (
    <LinearGradient colors={['#FDF0F3', '#FFFBFC']} style={styles.linearGradient}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Header />
        </View>

        <Image 
          source={{ uri: item?.image || "https://shoes.lk/wp-content/uploads/2024/02/47-300x300.png.webp" }} 
          style={styles.productImg} 
        />
        <View style={styles.details}>
          <Text style={styles.title}>{item?.name || "Winter Coat"}</Text>
          <Text style={styles.price}>{`Rs. ${item?.price || 1000}`}</Text>
        </View>

        <Text style={styles.desc}>
          {item.description}
        </Text>

        <Text style={styles.size}>Size</Text>

        <View style={styles.sizeContainer}>
          {sizes.map((size) => (
            <TouchableOpacity 
              key={size}
              style={styles.touch} 
              onPress={() => setSizeS(size)}
            >
              <Text style={[styles.sizes, sizeS === size && { color: "red" }]}>{size}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.size}>Colors</Text>

        <View style={styles.colorsContainer}>
          {colors.map((color, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.colorTouch, colorC === color && styles.circleBorder]}
              onPress={() => setColorC(color)}
            >
              <View style={[styles.singleColor, { backgroundColor: color }]}></View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.qbox}>
          <TouchableOpacity onPress={() => removeCart(item._id, sizeS, colorC)}>
            <AntDesign name="minussquare" size={30} style={styles.qbuttons}/>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{cartItems[item._id] || 0}</Text>
          <TouchableOpacity onPress={() => addToCart(item._id, sizeS, colorC)}>
            <AntDesign name="plussquare" size={30} style={styles.qbuttons}/>
          </TouchableOpacity>
        </View>

      </ScrollView>
      
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
    backgroundColor: 'white'
  },
  linearGradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
  },
  productImg: {
    width: "100%",
    height: 420,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    color: "#444444",
    fontWeight: '500',
  },
  price: {
    fontSize: 20,
    color: "#444444",
    fontWeight: '500',
  },
  size: {
    fontSize: 20,
    color: "#444444",
    fontWeight: '500',
    marginHorizontal: 20,
  },
  sizeContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
  },
  touch: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: 'center',
    marginHorizontal: 10,
  },
  sizes: {
    fontSize: 18,
    fontWeight: "600",
  },
  desc: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  colorsContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  colorTouch: {
    height: 36,
    width: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: 'center',
    marginHorizontal: 10,
  },
  singleColor: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  circleBorder: {
    borderWidth: 1
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 20,
    color: 'red',
  },
  qbox: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#f2f2f2", // Light background color for the box
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 10,
    elevation: 2, // Adds shadow to give a more elevated look
  },
  qbuttons: {
    color: "#333", // Dark color for the buttons
    marginHorizontal: 10,
  },
  quantityText: {
    fontSize: 18,
    color: "#333",
    fontWeight: '600',
    marginHorizontal: 15,
  }
});
