
import React, {useState, useEffect} from 'react'
import { Box, Divider, HStack, NativeBaseProvider, Pressable, ScrollView, Text } from 'native-base'
import { auth, db } from "../../../firebase";
import { collection,  where,onSnapshot, query} from "firebase/firestore";
import { useIsFocused } from '@react-navigation/native';

const ListChatPenjual = ({navigation}) => {
    const [data, setData] = useState([null])
    const focus = useIsFocused()
    useEffect(() =>{
        if (focus === true){
          console.log("masuk list")
          let produkRef = collection(db,"list_chat")
          let q = query(produkRef, where("userToko", "==", `${auth.currentUser?.uid}`))
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
                    navigation.navigate('ChatPenjual', {
                    listDetail : data
                    })
                    
                }} key={index}>
                
                <Divider mb='3'/>
                    <HStack>
                      <Box style={{
                            width:'7%'
                          }}
                      ><Text>{index +1}</Text></Box>
                      <Box><Text>{data?.namaPembeli}</Text></Box>
                    </HStack>
                <Divider  mt='3'/>
                </Pressable>
                )
            })}
            </Box>
            </Box>
        </ScrollView>
    </NativeBaseProvider>
  )
}

export default ListChatPenjual