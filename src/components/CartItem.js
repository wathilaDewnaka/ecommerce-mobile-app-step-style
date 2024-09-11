import * as React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import { ShopContext } from '../context/ShopContext';

export default function CartItem({item}) {
    const { cartItems, removeCart, size, color  } = React.useContext(ShopContext)
    let colorValue = "#000000"

    if(color[item._id] === "Grey"){
        colorValue = "#E5E7EB"
    }else if(color[item._id] === "Yellow"){
        colorValue = "#FDE047"
    }else if(color[item._id] === "Grey"){
        colorValue = "#EA580C"
    }

    return (
        <View style={styles.cartContainer}>
            <Image source={{uri : item.image}} style={styles.cartImg}/>
            <View style={styles.cartDetails}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.price}>Rs. {item.price} x {cartItems[item._id]}</Text>
                <Text style={[styles.price, {fontWeight: "600"}]}>Rs. {item.price * cartItems[item._id]}</Text>

                <View style={styles.sizecolorcontainer}>    
                    <View style={[styles.color, {backgroundColor: colorValue}]}></View>
                    <View style={styles.cicle}>
                        <Text style={styles.size}>{size[item._id]}</Text>
                    </View>

                </View>
            </View>
            <TouchableOpacity style={{paddingRight: 10}} onPress={() => removeCart(item._id)}><Feather name={'trash-2'} size={26}/></TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    cartImg : {
        width: 94,
        height: 134,
        borderRadius: 25
    },
    cartContainer: {
        marginVertical: 20,
        flexDirection: "row"
    },
    cartDetails: {
        flex: 1,
        marginHorizontal: 10
    },
    title: {
        fontSize: 18
    },
    price: {
        color: "#797979",
        fontSize: 18,
        marginVertical: 10
    },
    color: {
        height: 32,
        width: 32,
        borderRadius: 16
    },
    sizecolorcontainer: {
        flexDirection: "row",
        marginHorizontal: 10
    },
    cicle: {
        height: 32,
        width: 32,
        borderRadius: 16,
        backgroundColor: "white",
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    size: {
        fontWeight: '600'
    }
});
