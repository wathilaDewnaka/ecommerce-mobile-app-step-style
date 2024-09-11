import * as React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import Header from '../components/Header';
import Categories from '../components/Categories';
import Products from '../components/Products';
import { ShopContext } from '../context/ShopContext';

export default function HomeScreen() {
  const categories = ['All', 'Men', 'Women', 'Boys', 'Girls'];
  const [category, setCategory] = React.useState("All");
  const { products } = React.useContext(ShopContext);

  // Filter products based on selected category
  const filteredProducts = category === 'All' 
    ? products 
    : products.filter(product => product.category === category);

  return (
    <LinearGradient colors={['#FDF0F3', '#FFFBFC']} style={styles.linearGradient}>
      <Header />
      <Text style={styles.order}>Order Your Footwear</Text>

      <FlatList
        numColumns={2}
        ListHeaderComponent={
          <>
            <FlatList
              data={categories}
              renderItem={({ item }) => (
                <Categories item={item} category={category} setCategory={setCategory} />
              )}
              keyExtractor={(item) => item}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesList}
            />
          </>
        }
        data={filteredProducts}  // Use filteredProducts here
        renderItem={({ item, idx }) => (
          <Products item={item} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    padding: 20,
  },
  order: {
    fontSize: 28,
    color: "#000000",
    fontWeight: "bold",
    marginTop: 20,
  },
  categoriesList: {
    marginTop: 20, // Adjust as needed
  },
  view: {
    flexDirection: "row"
  }
});
