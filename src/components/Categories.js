import * as React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function Categories({item, category, setCategory}) {

    return (
        <TouchableOpacity onPress={() => setCategory(item)}>
            <Text style={[styles.categories, category === item && {color: "white", backgroundColor: "#E96E6E"}]}>{item}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    categories: {
        fontSize: 16, 
        fontWeight: "600", // Fixed fontWeight
        // color: "white",
        // backgroundColor: "#E96E6E", // Fixed backgroundColor
        color: "#938F8F",
        backgroundColor: "#DFDCDC",
        paddingHorizontal: 20,
        textAlign: "center",
        borderRadius: 16,
        marginHorizontal: 10,
        paddingVertical: 10,
    }
});
