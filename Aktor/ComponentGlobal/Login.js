
import * as React from "react";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider, Image } from "native-base";
const Logo = require('../../assets/src/Logo.png')

export default function Login ({navigation}){
    const [email, setEmail]= useState('');
    const [password, setPassword] = useState('');
    const [isValid, setIsValid] = useState(false);

    React.useEffect(()=>{
        const unsub = auth.onAuthStateChanged(user => {
            if(user){
                navigation.navigate("User")
                setIsValid(false)
            }
        })

        return unsub
    },[isValid])

    const handleSignIn = () =>{
        console.log("masuk")
        if(email === "admin" && password === "admin"){
            navigation.navigate("Admin")
        }else{
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                setIsValid(true)
                // ...
            })
            .catch((error) => { 
                alert(error)
            });
        }

    }
    return(
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
            Welcome
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
                <FormControl.Label>Password</FormControl.Label>
                <Input type="password" 
                value={password}
                onChangeText= {text => setPassword(text)}
                secureTextEntry
            />
            </FormControl>
            <Button mt="2" colorScheme="yellow" onPress={handleSignIn}>
                Sign In
            </Button>
            <HStack mt="6" justifyContent="center">
                <Text fontSize="sm" color="coolGray.600" _dark={{
                color: "warmGray.200"
            }}>
                I'm a new user.{" "}
                </Text>
                <Link _text={{
                color: "#EFAF00",
                fontWeight: "medium",
                fontSize: "sm"
            }} onPress={()=> navigation.navigate('SignUp')}>
                Sign Up
                </Link>
            </HStack>
            </VStack>
        </Box>
        </Center>
        </Center>
    </NativeBaseProvider>
    )
}