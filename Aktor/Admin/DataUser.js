import { Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
// Firebase
import { db} from "../../firebase";
import { collection,  where, onSnapshot, query } from "firebase/firestore";
import { HStack, NativeBaseProvider, ScrollView, Box, Divider,Button } from 'native-base';

const DataUser = ({navigation}) => {
  const [data, setData] = useState([null])
  const focus = useIsFocused()
  useEffect(()=>{
    if(focus){
      let userRef = collection(db,"user")
      let q = query(userRef, where("seller", "==", false))
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


  console.log("data", data)
  return (
    <NativeBaseProvider>
      <ScrollView backgroundColor="white">
        <Box m="3" p="2">
        <Box alignItems="flex-end">
        <Button size="sm" colorScheme="red" my="3" onPress={() =>{
          navigation.navigate('Login')
        }}>Log Out</Button>
        </Box>
        <Box p="5" backgroundColor="#EFAF00" rounded="sm" alignSelf="center">
          <Text bold> Total : {data?.length}</Text>
        </Box>
        <Box mt="3">
        <Divider bg="yellow.500" thickness="1" my="2"/>
        <HStack space={3} >
          <Box style={{
          width: '5%'
        }}><Text>#</Text></Box>
          <Box style={{
          width: '18%'
        }}>Nama</Box>
          <Box style={{
          width: '40%'
        }}>Email</Box>
          <Box style={{
          width: '40%'
        }}>NoHp</Box>
        </HStack>
        <Divider bg="yellow.500" thickness="1" my="2"/>
        </Box>


        {data?.map((data, index)=>{
          return(
        <Box key={index} style={{

        }}>
          <HStack space={3} >
            <Box style={{
          width: '5%'
        }}>
        <Text>{index + 1}</Text></Box>
        
            <Box style={{
          width: '18%'
        }}>{data?.nama}</Box>
            <Box style={{
          width: '39%'
        }}>{data?.emailId}</Box>
            <Box style={{
          width: '41%'
        }}>{data?.noHp}</Box>
          </HStack>
          <Divider my="2"/>
        </Box>
          )
        })}


        </Box>
      </ScrollView>
    </NativeBaseProvider>
  )
}

export default DataUser