import * as React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Icons
import { Foundation } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';


// Pages
import Homepage from "../User/Pembeli/Homepage";
import ProdukPembeli from "../User/Pembeli/ProdukPembeli";
import ProfilPembeli from "../User/Pembeli/ProfilPembeli";
import ListChat from "../User/Pembeli/ListChat";
import Wishlist from "../User/Pembeli/Wishlist";


const Tab = createBottomTabNavigator();

const BottomNav = ({navigation}) => {
  return (
    <Tab.Navigator
    initialRouteName="Wishlist"
    >
      <Tab.Screen name="Home" component={Homepage} 
        options={{
            headerShown:false,
            tabBarLabel:"Home",
            tabBarIcon:({color, size}) => (
                <Foundation name="home" size={24} color="#EFAF00" />
            )
        }}
      />
      <Tab.Screen name="Keranjang" component={Wishlist} 
            options={{
            tabBarLabel:"Keranjang",
            tabBarIcon:({color, size}) => (
              <Entypo name="shopping-cart" size={24} color="#EFAF00"/>
            )
        }}
      />
      <Tab.Screen name="Pesanan" component={ProdukPembeli} 
            options={{
            tabBarLabel:"Pesanan",
            tabBarIcon:({color, size}) => (
                <Entypo name="text-document-inverted" size={24} color="#EFAF00" />
            )
        }}
      />
      <Tab.Screen name="ChatList" component={ListChat} 
            options={{
            tabBarLabel:"ChatList",
            tabBarIcon:({color, size}) => (
                <Ionicons name="chatbox" size={24} color="#EFAF00"/>
            )
        }}
      />
      <Tab.Screen name="Profil" component={ProfilPembeli} 
            options={{
            tabBarLabel:"Profile",
            tabBarIcon:({color, size}) => (
                <FontAwesome name="user" size={24} color="#EFAF00"/>
            )
        }}
      />
    </Tab.Navigator>
  )
}

export default BottomNav