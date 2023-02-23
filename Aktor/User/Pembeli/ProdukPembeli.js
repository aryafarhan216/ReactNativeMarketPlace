import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Linking } from 'react-native';
import { NativeBaseProvider, ScrollView, Box, Text, VStack, HStack, 
  Center,FormControl, Input, Modal, Button,  ZStack, Image, AspectRatio, Pressable, Divider } from 'native-base'
import { auth, db } from "../../../firebase";
import { collection,  where, onSnapshot, query } from "firebase/firestore";
import { useIsFocused } from '@react-navigation/native';

  // image
import { Ionicons } from '@expo/vector-icons';
const img = require('../../../assets/src/DrawKit-Vector-Illustration-ecommerce-17.png')
const ProdukPembeli = () => {
  const [showModal, setShowModal] = useState(false);
  const [dataPesanan, setDataPesanan] = useState([null])
  const [dataModal, setDataModal] = useState(
    {
      namaToko:"", 
      namaProduk:"", 
      imgProduk:"",
      hargaProduk:"", 
      kurir:"", 
      resi:""
  })
  const focus = useIsFocused()

  useEffect(() =>{
    if (focus) {
       console.log("masuk")
      // realtime
      let produkRef = collection(db,"pesanan")
      let q = query(produkRef, where("userPembeli", "==", `${auth.currentUser?.uid}`))
      const realData  = onSnapshot(q,
        (snapShot) =>{
          let tempList = []
          snapShot.docs.forEach((doc) => {
            tempList.push(doc.data())
          });
          setDataPesanan(tempList)
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

  return (
    <NativeBaseProvider>
    <SafeAreaView>
      <ScrollView>
      { dataPesanan &&
      <Box>
 {/* Pesanan */}
 {dataPesanan?.map((dataPesanan, index) =>{
        return(
          <Pressable onPress={() => {
        setDataModal({
          namaToko : dataPesanan?.detailPenjual?.detailToko?.namaToko,
          namaProduk : dataPesanan?.detailPenjual?.produk?.namaProduk,
          imgProduk : dataPesanan?.detailPenjual?.produk?.imgProduk,
          hargaProduk : dataPesanan?.detailPenjual?.produk?.hargaProduk,
          kurir : dataPesanan?.jasaOngkir,
          resi : dataPesanan?.resi
      })
        setShowModal(true)
        }} key={index}>
        <Box bg="white" rounded="xl" p="5" mt="4" mx="5" key={index}>
        <VStack>
        <Box>
        <Text bold fontSize="xs" mb="1">
          {dataPesanan?.detailPenjual?.detailToko?.namaToko}
        </Text>
        </Box>
         <Box>
            <HStack space={3}>
              <Box pt="2">
              <Image 
                source={{uri : dataPesanan?.detailPenjual?.produk?.imgProduk}}
                size="sm"
                alt='foto'
                rounded="sm"
                />
              </Box>
              <Box style={{
                    width: '30%'
                  }}>
              <VStack space={0}>
                <Box >
                <Text fontSize="sm">
                {dataPesanan?.detailPenjual?.produk?.namaProduk}
                </Text>
              </Box>
                <Box >
                <Text bold color="#EFAF00" fontSize="sm">
                  RP. {dataPesanan?.totalOngkir}
                </Text>
                </Box>
                <Box >
                <Text fontSize="xs">
                  {dataPesanan?.jasaOngkir === "one"
                  ?<Text >Kurir : JNE</Text>
                  : <Text >On the way</Text>
                  }
                </Text>
              </Box>
              </VStack>
              </Box>
              <Divider
             orientation="vertical"
                    bg="black"
               />
              <Box>
              <Text mt="3">Status :</Text>
            {dataPesanan?.isConfirm === false
            ?<Text>Waiting to Admin</Text>
            :<Text>Seller Preparing</Text>
            }
              </Box>
            </HStack>

        </Box>
        </VStack>
        </Box>
        </Pressable>
        )

      })}
      
      {/* End Of Peanan */}
      </Box>

      }
     
      </ScrollView>
    </SafeAreaView>
    {/* Modal */}
    <Center>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Detail Pesanan</Modal.Header>
          <Modal.Body>
          <VStack>
        <Box>
        <Text bold fontSize="xs" mb="1">
          {dataModal?.namaToko}
        </Text>
        </Box>
         <Box>
            <HStack space={3}>
              <Box pt="2">
              <Image 
                source={{uri : dataModal?.imgProduk}}
                size="sm"
                alt='foto'
                rounded="sm"
                />
              </Box>
              <Box>
              <VStack space={0}>
                <Box >
                <Text fontSize="sm">
                {dataModal?.namaProduk}
                </Text>
              </Box>
                <Box >
                <Text bold color="#EFAF00" fontSize="sm">
                  RP. {dataModal?.hargaProduk}
                </Text>
                </Box>
                                <Box >
                <Text fontSize="xs">
                  { dataModal?.kurir ==="one"
                  ? <Text> Kurir : JNE</Text>
                  : <Text> On the way</Text>
                  }
                </Text>
              </Box>
                <Box >
                <Text fontSize="xs">
                {dataModal?.resi === ""
                  ? <Text> Waiting to Seller</Text>
                  : <Text> Resi : {dataModal?.resi} </Text>
                  }
                </Text>
                </Box>
              </VStack>
              </Box>
            </HStack>
            <Box>
            {dataModal?.kurir === "one" &&
            <Box>
            <Text>Your paket</Text>

            {dataModal?.resi != "" &&
            <Text style={{color: 'blue'}}
                onPress={() => Linking.openURL(`https://cekresi.jne.co.id/${dataModal?.resi}`)}>
            link resi
          </Text>
            }
            </Box>

            }
              
            </Box>
        </Box>
        </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
              setShowModal(false);
            }}>
                Cancel
              </Button>
              <Button onPress={() => {
              setShowModal(false);
            }} colorScheme="yellow">
                Done
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>

    </NativeBaseProvider>
  )
}

export default ProdukPembeli