import {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image, Box, NativeBaseProvider, Divider, Text, Stack, Button, VStack, HStack, ScrollView} from 'native-base'
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import {  db } from "../../../firebase";
import { collection,  where,doc, deleteDoc, onSnapshot, getDoc, setDoc } from "firebase/firestore";
import auth from '@react-native-firebase/auth';

const DetailProdukGoogle = ({route, navigation}) => {
    const [dataDetail, setDataDetail] = useState({})
    const [dataPembeli, setDataPembeli] = useState({})
    const {detailProduk} = route.params
    const [dataBeli, setDataBeli] = useState({
        userUid : "",
        detailToko : "",
        produk : ""
    })
    const focus = useIsFocused()

    useEffect(() =>{
        console.log("masuk list")
        // realtime
        const getUser = async () =>{
                const docRef = doc(db, "user", detailProduk.userUid)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setDataDetail(docSnap.data())
                    setDataBeli({
                        userUid : auth().currentUser?.uid,
                        detailToko : docSnap.data(),
                        produk : detailProduk
                    })
                
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }
            const getPembeli = async () =>{

                const docRef = doc(db, "user", auth().currentUser?.uid)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setDataPembeli(docSnap.data())
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }
            getUser()
            getPembeli()
    }, [])

    const handleWishlist = async() =>{
        const idWishlist = "C" + auth().currentUser?.uid + detailProduk.idProduk
        await setDoc(doc(db, "wishlist",`${idWishlist}` ), {
            idWishlist : idWishlist,
            userUid : auth().currentUser?.uid,
            detailToko : dataDetail,
            produk : detailProduk
        }).then(() => {
            alert("Produk Masuk Ke Wishlist")
        }).catch((error) =>{
            alert(error)
        })
    }

    const addList = async() =>{
        const idList = "L" + detailProduk.userUid
        await setDoc(doc(db, "list_chat",`${idList}` ), {
            idList : idList,
            userPenjual :auth().currentUser?.uid,
            userToko : detailProduk.userUid,
            namaToko : dataDetail?.namaToko,
            namaPembeli : dataPembeli?.nama
        }).then(() => {
            alert("masuk list chat")
        })
    }

    const handleBuy =  () =>{
        navigation.navigate('FormPembelianGoogle', {
            detailPembelian : dataBeli
            })
    }
  return (
    <NativeBaseProvider>
    <SafeAreaView>
    <ScrollView>
        <Box p="3" >
            <Box width="100%" px="3" rounded="xl" backgroundColor="white" pt="3">
                <Box alignItems="center" mt="5" >
                <Image 
                    source={{uri : detailProduk.imgProduk}}
                    width="300px"
                    height="300px"
                    alt="image produk"
                />
                </Box>
                <Box py="3">
                    <Text bold fontSize="xl" color="#EFAF00" m="0" p="0"> Rp {detailProduk.hargaProduk} </Text>
                    <Text bold fontSize="lg"> {detailProduk.namaProduk}</Text>
                    <HStack>
                    <Box>
                            <Text> Toko : {dataDetail.namaToko} </Text>
                            <Text> Stok : {detailProduk.stokProduk}</Text>
                        </Box>
                    </HStack>
                </Box>
                <Divider />
                <Box py="3">
                    <Text fontSize="md" bold> Kategori :</Text>
                    <Box>

                        <HStack space={3}>

                            <Box>
                                <Text> Zodiak : {detailProduk.zodiak}</Text>
                                <Text> Cocok : {detailProduk.jenisKelamin}</Text>
                            </Box>
                            <Box>
                                <Text> Umur : {detailProduk.umurProduk}</Text>
                                <Text> Ukuran : {detailProduk.miliProduk} ml</Text>
                            </Box>
                        </HStack>

                    </Box>
                </Box>
                <Divider />
                <Box py="1">
                    <Text fontSize="md" bold> Deskripsi :</Text>
                    <Text fontSize="sm"> {detailProduk.descProduk}</Text>
                    <Text fontSize="sm">  {detailProduk.idProduk}</Text>
                </Box>
                <Divider />
                <Stack direction="row" alignSelf="flex-end" space={2} my="3">

                <Button size="sm" variant="outline">
                <Ionicons name="heart" size={24} color="#EFAF00"onPress={handleWishlist} />
                </Button>
                <Button size="sm" variant="outline">
                <Ionicons name="chatbox" size={24} onPress={addList} color="#EFAF00"/>
                </Button>
                <Button size="sm" colorScheme="green" onPress={handleBuy}>Buy</Button>
                </Stack>
            </Box>
        </Box>
        </ScrollView>
    </SafeAreaView>
    </NativeBaseProvider>
  )
}

export default DetailProdukGoogle