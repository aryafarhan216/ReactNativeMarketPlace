import React, {useState, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NativeBaseProvider, ScrollView, Box, Text, VStack, HStack, ZStack, Image, AspectRatio, Pressable } from 'native-base'
import { auth, db } from "../../../firebase";
import { collection,  where,doc, deleteDoc, onSnapshot, query } from "firebase/firestore";
import { useIsFocused } from '@react-navigation/native';
// image
import { Ionicons } from '@expo/vector-icons';
import { async } from '@firebase/util';
const img = require('../../../assets/src/DrawKit-Vector-Illustration-ecommerce-17.png')

const Wishlist = ({navigation}) => {
  const [data, setData] = useState([null])
  const focus = useIsFocused()

    useEffect(() =>{
      if (focus === true){
        console.log("masuk list", auth.currentUser?.uid)
        let WishlistRef = collection(db,"wishlist")
        let q = query(WishlistRef, where("userUid", "==", `${auth.currentUser?.uid}`))
        // realtime
        const realData  = onSnapshot(
          q,
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

    const handleDelete = async(id) =>{
      console.log("msujk")
      try{
        await deleteDoc(doc(db, "wishlist", `${id}`));
      } catch(e){
        alert(e)
      }
    }

    console.log("cart", data[0]?.detailToko.namaToko)
  return (
    <NativeBaseProvider>
    <SafeAreaView>
      <ScrollView>

      {/* Wishlist */}
      {data?.map((data, index) =>{
        return(
          <Pressable onPress={() =>{
            navigation.navigate('FormPembelian', {
              detailPembelian : data
            })
          }} key={index}>
          <Box bg="white" rounded="xl" p="5" mt="4" mx="5" key={index}>
        <VStack>
        <Box>
        <Text bold fontSize="xs" mb="1">
        {data?.detailToko.namaToko}
        </Text>
        </Box>
         <Box>
            <HStack space={3}>
              <Box>
              <Image 
                source={{uri : data?.produk.imgProduk}}
                size="sm"
                alt='foto'
                rounded="md"
                />
              </Box>
              <Box>
              <VStack>
                <Box m="0" p="0">
                <Text>
                {data?.produk.namaProduk}
                </Text>
              </Box>
                <Box m="0" p="0">
                <Text bold color="#EFAF00" fontSize="xl">
                  RP. {data?.produk.hargaProduk}
                </Text>
                </Box>
              </VStack>
              </Box>
              <Ionicons name="trash-bin-outline" size={15} color="black" onPress={() => handleDelete(data?.idWishlist)}/>
            </HStack>
        </Box>
        </VStack>
        </Box>
        </Pressable>
        )
      })}
        
      {/* End Of Wishlist */}
      </ScrollView>
    </SafeAreaView>
    </NativeBaseProvider>
  )
}

export default Wishlist

