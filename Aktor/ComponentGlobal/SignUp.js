import * as React from "react";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db} from "../../firebase";
import { doc, setDoc } from "firebase/firestore"; 
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider, Image, Alert } from "native-base";
import { serverTimestamp } from "firebase/firestore";
const Logo = require('../../assets/src/Logo.png')

const SignUp = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [hp, setHp] = useState('')

    const handelSignUp = () =>{
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            addUser(user.uid, user.email)
            navigation.navigate('Login')
        })
        .catch(err => alert(err));

    }

    const addUser = async(uid, email) =>{
        await setDoc(doc(db, "user", uid), {
            emailId: email,
            noHp: hp,
            address:"",
            seller:false,
            isSiantar:false,
            timestamp: serverTimestamp()
          });
    }

  return (
    <NativeBaseProvider>
    <Center  flex={1} px="3">
        <Center w="100%">
    <Box safeArea p="2" py="5" w="90%" maxW="290">
        <HStack justifyContent="center">
        <Center>
        <Image 
            source={Logo}
            size="xl"
            alt="Logo"
            />
        </Center>
        </HStack>
        <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
            color: "warmGray.50"
        }}>
        Sign Up
        </Heading>
        <VStack space={3} mt="5">
        <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input 
                type="text"
                placeholder="sbc@sbc.com"
                value={email}
                onChangeText= {text => setEmail(text)}
            />
        </FormControl>
            <FormControl>
            <FormControl.Label>No Handphone</FormControl.Label>
            <Input keyboardType="numeric"
                placeholder="081234567890"
                value={hp}
                onChangeText= {text => setHp(text)}
            />
        </FormControl>
        <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input type="password" 
                value={password}
                onChangeText= {text => setPassword(text)}
                secureTextEntry
            />
        </FormControl>
        <Button mt="2" colorScheme="yellow" onPress={handelSignUp}>
            Sign Up
        </Button>
        <HStack mt="6" justifyContent="center">
            <Text fontSize="sm" color="coolGray.600" _dark={{
            color: "warmGray.200"
        }}>
            Already have an account?.{" "}
            </Text>
            <Link _text={{
            color: "#EFAF00",
            fontWeight: "medium",
            fontSize: "sm"
        }} onPress={()=> navigation.navigate('Login')}>
            Login
            </Link>
        </HStack>
        </VStack>
    </Box>
    </Center>
    </Center>
</NativeBaseProvider>
  )
}

export default SignUp