
import React, {useState, useEffect} from 'react'
import { Box, Divider, HStack, NativeBaseProvider, Pressable, ScrollView, Text } from 'native-base'
import { db } from "../../../firebase";
import { collection,  where,onSnapshot, query, } from "firebase/firestore";
import { useIsFocused } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
const ListChatGoogle = ({navigation}) => {
    const [data, setData] = useState([null])
    const focus = useIsFocused()
    useEffect(() =>{
        if (focus === true){
          console.log("masuk list")
          let produkRef = collection(db,"list_chat")
          let uid = auth().currentUser?.uid
          let q = query(produkRef, where("userPenjual", "==", `${uid}`))
          // realtime
          const realData  = onSnapshot(q,
            (snapShot) =>{
              let tempList = []
              snapShot.docs.forEach((doc) => {
                tempList.push(doc.data())
              });
              setData(tempList)
            },
            (error) =>{
              console.log(error)
            }
          )
          return () =>{
            realData()
          }
        }
  
      }, [])

      console.log(data)
  return (
    <NativeBaseProvider>
        <ScrollView backgroundColor="white">
        <Box p="3">
            <Box>
                <Text bold fontSize="lg">
                    List Chat
                </Text>
            </Box>
            <Box mt="3" mx="3">
            {data?.map((data,index) =>{
                return(
                <Pressable onPress={() =>{
                    navigation.navigate('Chat', {
                    listDetail : data
                    })
                    
                }} key={index}>
                
                <Divider mb='3' />
                    <HStack>
                         <Box style={{
                          width:'7%'
                         }}
                         ><Text>{index +1}</Text></Box>
                        <Box><Text>{data?.namaToko}</Text></Box>
                        
                    </HStack>
                <Divider mt='3' />
                
                </Pressable>
                )
            })}
            </Box>
            
        </Box>
        </ScrollView>
    </NativeBaseProvider>
  )
}

export default ListChatGoogle