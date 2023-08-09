import * as React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Icons
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// Pages
import DataPenjual from "../Admin/DataPenjual";
import DataUser from "../Admin/DataUser";
import KonfirmasiPesanan from "../Admin/KonfirmasiPesanan";
import PesananBerhasil from "../Admin/PesananBerhasil";
import PesananSelesai from "../Admin/PesananSelesai";
import Batal from "../Admin/Batal";


const Tab = createBottomTabNavigator();

const BottomNavAdmin = () => {
  return (
    
    <Tab.Navigator
    initialRouteName="Data User"
    >
      <Tab.Screen name="Data User" component={DataUser} 
        options={{
            tabBarLabel:"Data User",
            tabBarIcon:({color, size}) => (
              <Ionicons name="pie-chart" size={24} color="#EFAF00" />
            )
        }}
      />
      <Tab.Screen name="Data Penjual" component={DataPenjual} 
            options={{
            tabBarLabel:"Data Penjual",
            tabBarIcon:({color, size}) => (
              <Ionicons name="pie-chart-outline" size={24} color="#EFAF00" />
            )
        }}
      />
      <Tab.Screen name="Konfirmasi Pesanan" component={KonfirmasiPesanan} 
            options={{
            tabBarLabel:"Konfirmasi",
            tabBarIcon:({color, size}) => (
              <MaterialIcons name="pending-actions" size={24} color="#EFAF00" />
            )
        }}
      />
        <Tab.Screen name="Batal" component={Batal} 
            options={{
            tabBarLabel:"Batal",
            tabBarIcon:({color, size}) => (
              <MaterialIcons name="pending-actions" size={24} color="#EFAF00" />
            )
        }}
      />
            <Tab.Screen name="Pesanan Selesai" component={PesananSelesai} 
            options={{
            tabBarLabel:"Pesanan Selesai",
            tabBarIcon:({color, size}) => (
              <MaterialIcons name="pending-actions" size={24} color="#EFAF00" />
            )
        }}
      />
            <Tab.Screen name="Pesanan" component={PesananBerhasil} 
            options={{
            tabBarLabel:"Pesanan",
            tabBarIcon:({color, size}) => (
                <Entypo name="text-document-inverted" size={24} color="#EFAF00" />
            )
        }}
      />
    </Tab.Navigator>
  )
}

export default BottomNavAdmin