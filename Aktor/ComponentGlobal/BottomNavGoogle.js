import * as React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Icons
import { Foundation } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// Pages
import ProfilPembeliGoogle from "../User/PembeliGoogle/ProfilPembeliGoogle";
import WishlistGoogle from "../User/PembeliGoogle/WishlistGoogle";
import ProdukPembeliGoogle from "../User/PembeliGoogle/ProdukPembeliGoogle";
import ListChatGoogle from "../User/PembeliGoogle/ListChatGoogle";
import HomepageGoogle from "../User/PembeliGoogle/HomepageGoogle";


const Tab = createBottomTabNavigator();

const BottomNavGoogle = ({navigation}) => {
  return (
    <Tab.Navigator
    initialRouteName="Home"
    >
      <Tab.Screen name="HomeGoogle" component={HomepageGoogle} 
        options={{
            headerShown:false,
            tabBarLabel:"Home",
            tabBarIcon:({color, size}) => (
                <Foundation name="home" size={24} color="#EFAF00" />
            )
        }}
      />
      <Tab.Screen name="KeranjangGoogle" component={WishlistGoogle} 
            options={{
            tabBarLabel:"Keranjang",
            tabBarIcon:({color, size}) => (
              <Entypo name="shopping-cart" size={24} color="#EFAF00"/>
            )
        }}
      />
      <Tab.Screen name="PesananGoogle" component={ProdukPembeliGoogle} 
            options={{
            tabBarLabel:"Pesanan",
            tabBarIcon:({color, size}) => (
                <Entypo name="text-document-inverted" size={24} color="#EFAF00" />
            )
        }}
      />
      <Tab.Screen name="ChatListGoogle" component={ListChatGoogle} 
            options={{
            tabBarLabel:"ChatList",
            tabBarIcon:({color, size}) => (
                <Ionicons name="chatbox" size={24} color="#EFAF00"/>
            )
        }}
      />
      <Tab.Screen name="Profil" component={ProfilPembeliGoogle} 
            options={{
            tabBarLabel:"Profil",
            tabBarIcon:({color, size}) => (
                <FontAwesome name="user" size={24} color="#EFAF00"/>
            )
        }}
      />
    </Tab.Navigator>
  )
}

export default BottomNavGoogle