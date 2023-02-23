import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NativeBaseProvider, ScrollView, Box, Text, VStack, HStack,
 Center, Image, Pressable } from 'native-base'
import { auth, db } from "../../../firebase";
import { collection,  where,doc, deleteDoc, onSnapshot, query } from "firebase/firestore";
import { useIsFocused } from '@react-navigation/native';
// image
import { Ionicons } from '@expo/vector-icons';
const img = require('../../../assets/src/DrawKit-Vector-Illustration-ecommerce-17.png')

const ListProduk = () => {
  const [data, setData] = useState([null])
  const focus = useIsFocused()

    useEffect(() =>{
      if (focus === true){
        console.log("masuk list")
        let produkRef = collection(db,"produk")
        let q = query(produkRef, where("userUid", "==", `${auth.currentUser?.uid}`))
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

  const handleDelete = async (id) =>{
    try{
      await deleteDoc(doc(db, "produk", `${id}`));
    } catch(e){
      alert(e)
    }
  }
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
            <Box bg="white" rounded="xl" p="5" mt="4" mx="5" key={index}>
            <VStack>
            <Box>
                <HStack space={3}>
                  <Box>
                <Image 
                    source={{ uri : data?.imgProduk}}
                    size="xl"
                    alt='foto'
                    />
                  

                  </Box>

                  <Box>
                  <VStack space={0}>
                    <Box >
                    <Text fontSize="md" bold>
                    {data?.namaProduk}
                    </Text>
                  </Box>
                    <Box >
                    <Text bold color="#EFAF00" fontSize="sm">
                      RP. {data?.hargaProduk}
                    </Text>
                    </Box>

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
                  </Box>
                  <VStack>
                  </VStack>
                </HStack>
                <Box mt="2">
                    <Text bold>
                      Deskripsi 
                    </Text>
                    <Text>
                      {data?.descProduk}
                    </Text>
                </Box>
                <Box alignSelf="flex-end">
                <Ionicons name="trash-bin-outline" size={15} color="black" onPress={() => handleDelete(data.idProduk)}/>
                </Box>
            </Box>
          
            </VStack>
            </Box>
          )})}
    </Box>
      }
   

      </ScrollView>
    </SafeAreaView>
    </NativeBaseProvider>
    
  )
}


export default ListProduk