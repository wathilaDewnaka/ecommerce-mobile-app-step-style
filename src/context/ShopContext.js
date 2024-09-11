import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import Toast from "react-native-toast-message";

export const ShopContext = createContext(null);

export default function ShopContextProvider(props) {
    const url = "https://ecommerce-website-step-style-backend.vercel.app";

    const [token, setToken] = useState("");
    const [products, setProducts] = useState({});
    const [discount, setDiscount] = useState(0)

    const [cartItems, setCartItems] = useState({});
    const [color, setColor] = useState({});
    const [size, setSize] = useState({});
    const [isFirstEffectDone, setIsFirstEffectDone] = useState(false);
    const [isSecondEffectDone, setIsSecondEffectDone] = useState(false);

    const addToCart = async (itemId, sizeValue, colorValue) => {
      
      if(colorValue === "#000000"){
        colorValue = "Black"
      }else if(colorValue === "#E5E7EB"){
        colorValue = "Grey"
      }else if(colorValue === "#FDE047"){
        colorValue = "Yellow"
      }else if(colorValue === "#EA580C"){
        colorValue = "Orange"
      }

      if(!cartItems[itemId]){
        Toast.show({
          type: 'success',
          text1: 'Product Added',
          text2: 'Product added successfully !',
          visibilityTime: 3000, // duration in ms
        });
      }

      try {  
        setCartItems((prev) => ({
          ...prev,
          [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
        }));
        setSize((prev) => ({ ...prev, [itemId]: sizeValue }));
        setColor((prev) => ({ ...prev, [itemId]: colorValue }));
  
        if (token) {
          await axios.post(url + "/api/cart/add", { itemId, size: sizeValue, color: colorValue }, { headers: { token } });
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
  
    const removeCart = async (itemId) => {
      try {
        setCartItems((prev) => {
          const updatedItems = { ...prev };
          let itemRemoved = false;
    
          if (updatedItems[itemId] > 1) {
            updatedItems[itemId] -= 1;
          } else {
            itemRemoved = true;
            delete updatedItems[itemId];
          }
    
          if (itemRemoved) {
            setSize((prev) => {
              const updatedSize = { ...prev };
              delete updatedSize[itemId];
              return updatedSize;
            });
    
            setColor((prev) => {
              const updatedColor = { ...prev };
              delete updatedColor[itemId];
              return updatedColor;
            });
            Toast.show({
              type: 'success',
              text1: 'Product Removed',
              text2: 'Product removed from cart successfully !',
              visibilityTime: 3000, // duration in ms
            });
          }
  
          return updatedItems;
        });
    
        if (token) {
          await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
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

    const fetchProducts = async () => {
        try {
            const res = await axios.get(url + "/api/product/list");
            setProducts(res.data.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const loadCart = async (token) => {
        try {
          const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
          setCartItems(response.data.cartData);
          setSize(response.data.sizeData);
          setColor(response.data.colorData);
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Something went wrong !',
            visibilityTime: 3000, // duration in ms
          });
        }
      };

      const calculateTotal = () => {
        let newTotal = 0;
      
        for (const item in cartItems) {
          if (cartItems[item] > 0) {
            const info = products.find((product) => product._id === item);
            if (info) {
              newTotal += info.price * cartItems[item];
            }
          }
        }
    
        return newTotal;
    
      };

    useEffect(() => {
        const initialize = async () => {
            await fetchProducts();

            const storedToken = await AsyncStorage.getItem("token");

            if (storedToken) {
                setToken(storedToken);
                await loadCart(storedToken)
            }
        };

        initialize();
        setIsFirstEffectDone(true)
    }, []);

    useEffect(() => {
        if (isFirstEffectDone) {
            setIsSecondEffectDone(true)
            calculateTotal();
          }
    },[cartItems, isFirstEffectDone])

    const contextValue = {
        token,
        setToken,
        url,
        products,
        calculateTotal,
        addToCart,
        removeCart,
        isSecondEffectDone, 
        loadCart,
        discount,
        setDiscount,
        cartItems,
        size, 
        color
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
}
