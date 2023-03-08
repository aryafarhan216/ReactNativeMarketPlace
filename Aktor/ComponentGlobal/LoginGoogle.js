
import * as React from "react";
import { useState } from "react";
import { db} from "../../firebase";
import { doc, setDoc , getDoc} from "firebase/firestore"; 
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider, Image } from "native-base";
const Logo = require('../../assets/src/Logo.png')

// new google firebase
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { SafeAreaView } from "react-native-safe-area-context";
import auth from '@react-native-firebase/auth';

// tinggal add kedatabase emailnya
export default function LoginGoogle ({navigation}){
    const [isValid, setIsValid] = useState(false);

    React.useEffect(()=>{
        const unsub = auth().onAuthStateChanged(user => {
            console.log(user)
            if(user){
                let uid = user.uid;
                let email = user.email;
                addUser(uid,email)
                navigation.navigate("UserGoogle")
                setIsValid(false)
            }     
        })

        return unsub
    },[isValid])


    const addUser = async(uid, email) =>{
        const id = uid
        const cekUid = await getDoc(doc(db, 'user', uid))
        if(cekUid.exists()){
            return null
        }else{
            await setDoc(doc(db, "user", uid), {
                emailId: email,
                seller:false,
                isGoogle:true
              });
        }
           
             
    }

    GoogleSignin.configure({
        webClientId: '676594783389-071d1dcan0maqledg5apv9c7kq1dmsci.apps.googleusercontent.com',
      });

      async function onGoogleButtonPress() {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();
      
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken)
    
        // Sign-in the user with the credential
        return auth().signInWithCredential(googleCredential)
      }

      const logout = async () =>{
        await GoogleSignin.revokeAccess();
        await auth().signOut();
        navigation.navigate('Login')
      }

    return(
        <NativeBaseProvider>
        <SafeAreaView>
        <Center mt="5">
        <GoogleSigninButton
            style={{ width: 200, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={onGoogleButtonPress}
            />
        </Center>
        </SafeAreaView>
    </NativeBaseProvider>
    )
}