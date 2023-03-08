import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Pages
import Login from './Aktor/ComponentGlobal/Login';
import SignUp from './Aktor/ComponentGlobal/SignUp';
import BottomNav from './Aktor/ComponentGlobal/BottomNav';
import DetailProduk from './Aktor/User/Pembeli/DetailProduk';
import FormPembelian from './Aktor/User/Pembeli/FormPembelian';
import BottomNavPenjual from './Aktor/ComponentGlobal/BottomNavPenjual';
import BottomNavAdmin from './Aktor/ComponentGlobal/BottomNavAdmin';
import Chat from './Aktor/User/Pembeli/Chat';
import ChatPenjual from './Aktor/User/Penjual/ChatPenjual';
import Loading from './Aktor/ComponentGlobal/Loading';
import 'expo-dev-client';
import LoginGoogle from './Aktor/ComponentGlobal/LoginGoogle';
import BottomNavGoogle from './Aktor/ComponentGlobal/BottomNavGoogle';
import DetailProdukGoogle from './Aktor/User/PembeliGoogle/DetailProdukGoogle';
import FormPembelianGoogle from './Aktor/User/PembeliGoogle/FormPembelianGoogle';
import ChatGoogle from './Aktor/User/PembeliGoogle/ChatGoogle';

// Variable Stack
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      {/* ComponentGlobal */}
        <Stack.Screen 
        name="Login" 
        component={Login} 
        options={{headerShown:false}}
        />
        <Stack.Screen 
        name="LoginGoogle" 
        component={LoginGoogle} 
        />
        <Stack.Screen 
        name="SignUp" 
        component={SignUp} 
        options={{headerShown:false}}
        />
        <Stack.Screen 
        name="User" 
        component={BottomNav} 
        options={{headerShown:false}}
        />
         <Stack.Screen 
        name="UserGoogle" 
        component={BottomNavGoogle} 
        options={{headerShown:false}}
        />
        <Stack.Screen 
        name="Penjual" 
        component={BottomNavPenjual} 
        options={{headerShown:false}}
        />
        <Stack.Screen 
        name="Admin" 
        component={BottomNavAdmin} 
        options={{headerShown:false}}
        />
        <Stack.Screen 
        name="DetailPage" 
        component={DetailProduk} 
        />
        <Stack.Screen 
        name="DetailPageGoogle" 
        component={DetailProdukGoogle} 
        />
        <Stack.Screen 
        name="FormPembelian" 
        component={FormPembelian} 
        />
         <Stack.Screen 
        name="FormPembelianGoogle" 
        component={FormPembelianGoogle} 
        />
        <Stack.Screen 
        name="Chat" 
        component={Chat} 
        />
          <Stack.Screen 
        name="ChatGoogle" 
        component={ChatGoogle} 
        />
       <Stack.Screen 
        name="ChatPenjual" 
        component={ChatPenjual} 
        />
      <Stack.Screen 
        name="Loading" 
        component={Loading} 
        options={{headerShown:false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
