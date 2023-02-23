import * as React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Icons
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';

// Pages
import Login from "./Login";
import AddProduk from "../User/Penjual/AddProduk";
import PesananPenjual from "../User/Penjual/PesananPenjual";
import ProfilPenjual from "../User/Penjual/ProfilPenjual";
import ListProduk from "../User/Penjual/ListProduk";
import ListChatPenjual from "../User/Penjual/ListChatPenjual";


const Tab = createBottomTabNavigator();

const BottomNavPenjual = () => {
  return (
    <Tab.Navigator
    initialRouteName="Profil"
    >
        <Tab.Screen name="List Produk" component={ListProduk} 
          options={{
          tabBarLabel:"List Produk",
          tabBarIcon:({color, size}) => (
            <Octicons name="tasklist" size={24} color="#EFAF00" />
          )
      }}
      />
      <Tab.Screen name="Add Produk" component={AddProduk} 
            options={{
            tabBarLabel:"Add Produk",
            tabBarIcon:({color, size}) => (
              <Ionicons name="add-circle" size={24} color="#EFAF00" />
            )
        }}
      />
      <Tab.Screen name="Pesanan" component={PesananPenjual} 
            options={{
            tabBarLabel:"Pesanan",
            tabBarIcon:({color, size}) => (
                <Entypo name="text-document-inverted" size={24} color="#EFAF00" />
            )
        }}
      />
      <Tab.Screen name="ListChatPenjual" component={ListChatPenjual} 
            options={{
            tabBarLabel:"ListChatPenjual",
            tabBarIcon:({color, size}) => (
                <Ionicons name="chatbox" size={24} color="#EFAF00"/>
            )
        }}
      />
      <Tab.Screen name="Profil" component={ProfilPenjual} 
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

export default BottomNavPenjual