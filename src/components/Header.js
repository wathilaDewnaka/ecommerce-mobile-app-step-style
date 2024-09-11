import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native'; 
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Header({ isCart, isOrder, isAccount }) {
    const nav = useNavigation();
    const [menuVisible, setMenuVisible] = React.useState(false);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    return (
        <View>
            <TouchableOpacity style={styles.header} onPress={() => nav.navigate("HOME_STACK")}>
                <View style={styles.appContainer}>
                    {(isCart || isOrder || isAccount) ? <Ionicons name={"chevron-back"} size={24} /> :
                        <TouchableOpacity onPress={toggleMenu}>
                            <Image source={require("../assets/apps.png")} style={styles.app} />
                        </TouchableOpacity>
                    }
                </View>

                {isCart && <Text style={styles.myCart}>My Cart</Text>}
                {isOrder && <Text style={styles.myCart}>My Orders</Text>}
                {isAccount && <Text style={styles.myCart}>Account Information</Text>}

                <TouchableOpacity onPress={() => nav.navigate("ACCOUNT")}>
                    <Image source={require("../assets/user.png")} style={styles.user} />
                </TouchableOpacity>
            </TouchableOpacity>

            {/* Menu Modal */}
            <Modal
                transparent={true}
                visible={menuVisible}
                animationType="fade"
                onRequestClose={toggleMenu}
            >
                <TouchableOpacity style={styles.modalBackground} onPress={toggleMenu}>
                    <View style={styles.menuContainer}>
                        <Text style={styles.headers}>Quick Access Menu</Text>
                        <TouchableOpacity style={styles.menuItem} onPress={() => {
                            toggleMenu();
                            nav.navigate("CART_STACK");
                        }}>
                            <Text>Cart</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => {
                            toggleMenu();
                            nav.navigate("ORDERS");
                        }}>
                            <Text>My Orders</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => {
                            toggleMenu();
                            nav.navigate("ACCOUNT");
                        }}>
                            <Text>Account Info</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    user: {
        height: 40,
        width: 40,
    },
    app: {
        height: 28,
        width: 28,
    },
    headers: {
      fontWeight: '600',
      marginBottom: 20,
      fontSize: 20
    },
    appContainer: {
        backgroundColor: "white",
        height: 44,
        width: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    myCart: {
        fontSize: 28,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        minWidth: 150,
        alignItems: 'center',
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center',
    },
});
