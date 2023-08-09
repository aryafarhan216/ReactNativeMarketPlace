import React, {useState, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NativeBaseProvider, ScrollView, Box, Text, VStack, HStack, ZStack, Image, AspectRatio, Pressable } from 'native-base'
import { db } from "../../../firebase";
import { collection,  where,doc, deleteDoc, onSnapshot, query } from "firebase/firestore";
import { useIsFocused } from '@react-navigation/native';
// image
import { Ionicons } from '@expo/vector-icons';
import { async } from '@firebase/util';
const img = require('../../../assets/src/DrawKit-Vector-Illustration-ecommerce-17.png')
// import google
import auth from '@react-native-firebase/auth';

const WishlistGoogle = ({navigation}) => {
  const [data, setData] = useState([null])
  const focus = useIsFocused()
  const [filteredCart, setFilteredCart] = useState(null);

    useEffect(() =>{
      if (focus === true){
        let WishlistRef = collection(db,"wishlist")
        let uid = auth().currentUser?.uid
        let q = query(WishlistRef, where("userUid", "==", `${uid}`))
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

    }, [focus])

    useEffect(() => {
      // Check if all elements in the `data` array are not null
      const isDataAvailable = data.every((item) => item !== null);
    
      if (isDataAvailable) {
        const filteredData = data.reduce((acc, item) => {
          if (item.produk) {
            const existingProduct = acc.find((accItem) => accItem.produk[0]?.userUid === item.produk.userUid);
            if (existingProduct) {
              existingProduct.produk.push(item.produk);
            } else {
              acc.push({ ...item, produk: [item.produk] });
            }
          }
          return acc;
        }, []);
        setFilteredCart(filteredData);
      }
    }, [data]);
    
    const handleDelete = async (id) => {
      console.log("masuk");
      try {
        await deleteDoc(doc(db, "wishlist", `${id}`));
      } catch (e) {
        alert(e);
      }
    };
    const dataLength = data?.length;
    console.log("isi filter cart", filteredCart)
    
  return (
    <NativeBaseProvider>
    <SafeAreaView>
      <ScrollView>
{/* Baru */}
<Pressable onPress={() =>{
          navigation.navigate('FormPembelianGoogle', {
            detailPembelian : filteredCart
          })
        }}>
        <Box bg="white" rounded="xl" p="5" mt="4" mx="5" >
          <VStack>
          <Box>
          <Text bold fontSize="md" mb="1">
            Total Keranjang: {dataLength}
          </Text>
          </Box>
          <Box>
            
          </Box>
          </VStack>
          </Box>
        </Pressable>
      {/* end of baru */}
      {/* Wishlist */}
      {data?.map((data, index) =>{
        return(
          <Pressable onPress={() =>{
            navigation.navigate('FormPembelianGoogle', {
              detailPembelian : [data]
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

export default WishlistGoogle

