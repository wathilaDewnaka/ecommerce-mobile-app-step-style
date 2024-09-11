import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function Products({ item }) {
    const nav = useNavigation();

    return (
        <TouchableOpacity onPress={() => nav.navigate("PRODUCT_DETAILS", { item })} style={styles.productContainer}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.productImg} accessible={true} accessibilityLabel={item.title} />
            </View>

            <View style={styles.details}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.price}>Rs. {item.price}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    productContainer: {
        width: "48%",  // Ensure two products per row
        borderRadius: 10,
        overflow: 'hidden',  // Ensure image stays within the container
        marginBottom: 10,  // Space between items
        padding: 10,  // Padding inside each container
        marginTop: 12
    },
    imageContainer: {
        width: '100%',
        height: 200,  // Consistent image height
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center', 
        alignItems: 'center',
    },
    productImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',  // Keep the image aspect ratio consistent
    },
    details: {
        marginTop: 10,  // Space between the image and details
    },
    title: {
        fontSize: 16,
        color: "#444444",
        fontWeight: "600",
    },
    price: {
        color: "#9C9C9C",
        fontSize: 14,
        fontWeight: "600",
        marginTop: 5,
    }
});
