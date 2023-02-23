import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NativeBaseProvider, ScrollView, Box, Text, VStack, HStack,
 Center, Image, Pressable, Divider } from 'native-base'
import { auth, db } from "../../../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useIsFocused } from '@react-navigation/native';
// image


const Homepage = ({navigation}) => {
  const [data, setData] = useState([null])
  const focus = useIsFocused()

    useEffect(() =>{
      if (focus === true){
        // realtime

      let produkRef = collection(db,"produk")
      let q = query(produkRef, where("stokProduk", "!=", "0"))
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


        // const realData  = onSnapshot(
        //   collection(db,"produk"),
        //   (snapShot) =>{
        //     let tempList = []
        //     snapShot.docs.forEach((doc) => {
        //       tempList.push(doc.data())
        //     });
        //     setData(tempList)
        //   },
        //   (error) =>{
        //     console.log(error)
        //   }
        )
        return () =>{
          realData()
        }
      }

    }, [])

  console.log("isi", data)

  return (
    <NativeBaseProvider>
    <SafeAreaView>
      <ScrollView>
      {data === null
      ? <Center pt="5"> 
        <Text>Produk Kosong Produk</Text>
        
        </Center>
      : 
      <Box>
    {data?.map((data, index) =>{
          return(
            <Pressable key={index} onPress={() => navigation.navigate('DetailPage', {
              detailProduk : data
            })}>
            <Box bg="white" rounded="xl" p="5" mt="4" mx="5" >
            <VStack>
            <Box>
                <HStack space={2}>
                  <Box pt="1">
                    <Image 
                        source={{ uri : data?.imgProduk}}
                        size="sm"
                        alt='foto'
                        rounded="sm"
                        />
                  </Box>
                  <Divider 
                    orientation="vertical"
                    bg="black"
                  />
                  <VStack style={{
                    width: '40%'
                  }}>
                  <Box>
                    <Text fontSize="xs">
                      Zodiak : {data?.zodiak}
                    </Text>
                  </Box>
                  <Box >
                    <Text fontSize="xs">
                      Cocok : {data?.jenisKelamin}
                    </Text>
                  </Box>
                                <Box >
                    <Text fontSize="xs">
                      Umur : {data?.umurProduk}
                    </Text>
                  </Box>
                  <Box >
                    <Text fontSize="xs">
                      Stok : {data?.stokProduk}
                    </Text>
                  </Box>
                  </VStack>
                  <Divider 
                    orientation="vertical"
                    bg="black"
                  />
                  <Box pt="2" style={{
                    width: '30%'
                  }}>
                  <VStack space={0}>
                    <Box >
                    <Text fontSize="md" bold>
                    {data?.namaProduk}
                    </Text>
                  </Box>
                    <Box >
                    <Text bold color="#EFAF00" fontSize="xl">
                      RP. {data?.hargaProduk}
                    </Text>
                    </Box>
                  </VStack>
                  </Box>
                </HStack>
                <Box alignSelf="flex-end">
                </Box>
            </Box>
            </VStack>
            </Box>
            </Pressable>
          )})}
    </Box>
      }
   

      </ScrollView>
    </SafeAreaView>
    </NativeBaseProvider>
    
  )
}


export default Homepage