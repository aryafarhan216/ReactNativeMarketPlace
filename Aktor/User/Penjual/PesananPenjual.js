import React, {useState,useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NativeBaseProvider, ScrollView, Box, Text, VStack, HStack, ZStack, Modal, Center,FormControl, Input,  Button, Image, AspectRatio, Pressable, Divider } from 'native-base'
import { auth, db, storage} from "../../../firebase";
import { collection,  where, onSnapshot, query, doc, updateDoc } from "firebase/firestore";
import { useIsFocused } from '@react-navigation/native';
// image
import { Ionicons } from '@expo/vector-icons';
const img = require('../../../assets/src/DrawKit-Vector-Illustration-ecommerce-17.png')

const PesananPenjual = () => {
  const [showModal, setShowModal] = useState(false);
  const [resi, setResi] = useState("")
  const [dataModal, setDataModal] = useState({
    namaProduk: "",
    imgProduk : "",
    hargaProduk : "",
    idPesanan:"",
    imgValid :"",
    alamat: ""
  })
  const [data, setData] = useState([null])
  const focus = useIsFocused()
  useEffect(()=>{
    if(focus){
      let userRef = collection(db,"pesanan")
      let q = query(userRef, where( "userToko", "==",`${auth?.currentUser?.uid}`), where("isConfirm", "==", true,))
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

  const handleUpdateResi = async(idPesanan) =>{
    console.log(idPesanan)
    const updateUser = doc(db, "pesanan",`${idPesanan}`)
    await updateDoc(updateUser, {
      resi: resi
    }).then(()=>{
      alert("Resi Update")
    })
    .catch((err) => alert(err))
  }

  console.log("pesanan", auth.currentUser.uid)
  return (
    <NativeBaseProvider>
    <SafeAreaView>
      <ScrollView>
      {/* Keranjang */}
      { data === null 
      ?
      <Box>

      </Box>
      :
      <Box>
        {data?.map((data, index) =>{
          return(
            <Pressable onPress={() => {
              setShowModal(true)
              setDataModal({
                namaPembeli: data?.detailPembeli?.nama,
                namaProduk: data?.detailPenjual?.produk?.namaProduk,
                imgProduk : data?.detailPenjual?.produk?.imgProduk,
                hargaProduk : data?.totalOngkir,
                idPesanan : data?.idPesanan,
                imgValid : data?.imgValidAdmin,
                jasaOngkir : data?.jasaOngkir,
                resi : data?.resi,
                alamat : `${data?.detailPembeli?.address?.city}, ${data?.detailPembeli?.address?.district}, ${data?.detailPembeli?.address?.street}, ${data?.detailPembeli?.address?.region}, ${data?.detailPembeli?.address?.subregion}`
              })

              }} key={index}>
        <Box bg="white" rounded="xl" p="5" mt="4" mx="5" key={index}>
        <VStack>
        <Box>
        <Text bold fontSize="lg" mb="1">
            {data?.detailPembeli?.nama}
        </Text>
        </Box>
         <Box>
            <HStack space={3}>
              <Box pt="2">
              <Image 
                source={{uri : data?.detailPenjual?.produk?.imgProduk}}
                size="sm"
                alt='foto'
                rounded="sm"
                />
              </Box>
              <Box>
              <VStack space={0}>
                <Box >
                <Text fontSize="sm">
                {data?.detailPenjual?.produk?.namaProduk}
                </Text>
              </Box>
                <Box >
                <Text bold color="#EFAF00" fontSize="sm">
                 Beli : {data?.stokBeli}
                </Text>
                <Text bold color="#EFAF00" fontSize="sm">
                  RP. {data?.totalOngkir}
                </Text>
                </Box>
                                <Box >
                <Text fontSize="xs">
                  {data?.jasaOngkir === "one"
                  ?<Text>Kurir : JNE</Text>
                  :<Text>Diantar</Text>
                  }
                </Text>
              </Box>
                <Box >
                <Text fontSize="xs">
                {data?.jasaOngkir === "one" &&
                  <Text>resi : {data?.resi}</Text>
                  }
                </Text>
                </Box>
              </VStack>
              </Box>
            </HStack>
        </Box>
        </VStack>
        </Box>
  </Pressable>
          )
        })}
      </Box>

      }
      
      {/* End Of Keranjang */}
      </ScrollView>
    </SafeAreaView>
    {/* ModalPesanan */}
    
    <Center>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Detail Pesanan</Modal.Header>
          <Modal.Body>
          <VStack>
        <Box>
        <Text bold fontSize="md" mb="1">
        {dataModal?.idPesanan}
        </Text>
        </Box>
         <Box>
            <HStack space={3}>

              <Box mt="4">
              <Image 
                source={{uri : dataModal.imgProduk}}
                size="sm"
                alt='foto'
                rounded="sm"
                />
              </Box>
              <Box>
              <VStack space={0}>
              <Box>
                <Text fontSize="lg">
                  {dataModal.namaPembeli}
                </Text>
              </Box>
                <Box >
                <Text fontSize="sm">
                {dataModal?.namaProduk}
                </Text>
              </Box>
                <Box >
                <Text bold color="#EFAF00" fontSize="sm">
                  RP. {dataModal.hargaProduk}
                </Text>
                </Box>
                  <Box >
                <Text fontSize="xs">
                  Kurir : JNE
                </Text>
              </Box>
              </VStack>
              </Box>
            </HStack>
        </Box>
        </VStack>
        <Box my="3">
          <Text>
            Alamat Pembeli  :
          </Text>
          <Text>
            {dataModal.alamat}
          </Text>
        </Box>
        {dataModal.jasaOngkir === "one" 
        ?
        <Box>
        <Divider mt="4"/>
        <FormControl mt="3">
          <FormControl.Label>ADD RESI</FormControl.Label>
          { dataModal.resi == ""
          ?
          <Input 
                type="text"
                value={resi}
                onChangeText= {text => setResi(text)}
          />
          :
          <Box>
            resi : {dataModal.resi}
          </Box>

          }
         
        </FormControl>
        </Box>
        :
        <Box>

        </Box>
        
        }
     

  
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
              handleUpdateResi(dataModal?.idPesanan);
              setResi("")
            }} colorScheme="green">
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

export default PesananPenjual