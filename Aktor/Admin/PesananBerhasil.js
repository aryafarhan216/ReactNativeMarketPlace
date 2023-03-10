
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
// Firebase
import { db} from "../../firebase";
import { collection,  where, onSnapshot, query, doc, updateDoc } from "firebase/firestore";
import { HStack, NativeBaseProvider, ScrollView, Box, Divider, Text,Modal, Image, Button, Pressable, Center, VStack } from 'native-base';

const PesananBerhasil = () => {
  const [data, setData] = useState([null])
  const [showModal,setShowModal] = useState(false)

  const [dataModal, setDataModal] = useState({
    idPesanan:"",
    jasaOngkir: "",
    totalOngkir: "",
    // produk
    idProduk:"",
    namaProduk:"",
    hargaProduk: "",
    imgProduk :"",
    descProduk:"",
    // pembeli
    namaPembeli:"",
    noHpPembeli:"",
    // penjual
    namaToko:"",
    rekening:"",
    noRekening:"",
    atasNama:""

  })
  const focus = useIsFocused()
  useEffect(()=>{
    if(focus){
      let userRef = collection(db,"pesanan")
      let q = query(userRef, where("isConfirm", "==", true))
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

  return (
    <NativeBaseProvider>
      <ScrollView backgroundColor="white">
        <Box m="3" p="2">

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
          width: '40%'
        }}>Id Pesanan</Box>
          <Box style={{
          width: '30%'
        }}>TotalOngkir</Box>
          <Box style={{
          width: '25%'
        }}>More</Box>
        </HStack>
        <Divider bg="yellow.500" thickness="1" my="2"/>
        </Box>

        {data?.map((data, index)=>{
          return(
        <Pressable key={index}
          onPress={() =>{
            setShowModal(true)
            setDataModal({
              idPesanan:data?.idPesanan,
              jasaOngkir: data?.jasaOngkir,
              totalOngkir: data?.totalOngkir,
              // produk
              idProduk:data?.detailPenjual?.produk?.idProduk,
              namaProduk:data?.detailPenjual?.produk?.namaProduk,
              hargaProduk: data?.detailPenjual?.produk?.hargaProduk,
              imgProduk :data?.detailPenjual?.produk?.imgProduk,
              descProduk: data?.detailPenjual?.produk?.descProduk,
              //admin
              imgAdmin : data?.imgValidAdmin,
              // pembeli
              namaPembeli:data?.detailPembeli?.nama,
              noHpPembeli:data?.detailPembeli?.noHp ,
              imgBukti:data?.imgValid,
              // penjual
              namaToko:data?.detailPenjual?.detailToko?.namaToko,
              rekening:data?.detailPenjual?.detailToko?.bank?.rekening,
              noRekening:data?.detailPenjual?.detailToko?.bank?.noRekening,
              atasNama:data?.detailPenjual?.detailToko?.bank?.atasNama

            })
          }}
        >
        <Box key={index}>
          <HStack space={3} >
            <Box style={{
          width: '5%'
        }}>
        <Text>{index + 1}</Text></Box>
            <Box style={{
          width: '40%'
        }}><Text fontSize="sm">{data?.idPesanan}</Text>
        </Box>
            <Box style={{
          width: '33%'
        }}><Text>Rp. {data?.totalOngkir}</Text></Box>
            <Box style={{
          width: '25%'
        }} >...</Box>
          </HStack>
          <Divider my="2"/>
        </Box>
        </Pressable>
          )
        })}


        </Box>
      </ScrollView>
       {/* Modal */}
    <Center>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Detail Pesanan {dataModal?.idPesanan}</Modal.Header>
          <Modal.Body>
          <VStack>
         <Box>
         <Text mb="2" bold>Detail Penjual:</Text>
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
              <Box>
              <Text fontSize="sm">
                {dataModal?.namaToko}
              </Text>
              </Box>
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
                  { dataModal?.jasaOngkir ==="one"
                  ? <Text>Kurir : JNE</Text>
                  : <Text>Diantar</Text>
                  }
                </Text>
              </Box>
              </VStack>
              </Box>

            </HStack>
            <Box>
            </Box>
        </Box>
        <Divider my="2"/>
        <Box>
        <Text>Rekening       : {dataModal?.rekening}</Text>
        <Text>No Rekening : {dataModal?.noRekening}</Text>
        <Text>Atas Nama    : {dataModal?.atasNama}</Text>
      </Box>
        </VStack>
        <Divider my="2"/>
        {/* detail pembeli */}
        <VStack>
         <Box>
         <Text mb="2" bold>Detail Pembeli:</Text>
            <HStack space={3}>
              <Box pt="2">
              <Image 
                source={{uri : dataModal?.imgBukti}}
                size="xl"
                alt='foto'
                rounded="sm"
                />
              </Box>
              <Box>
              <VStack space={0}>
              <Box>
              <Text fontSize="lg">
                {dataModal?.namaPembeli}
              </Text>
              </Box>
                <Box >
                <Text fontSize="sm">
                {dataModal?.noHpPembeli}
                </Text>
              </Box>
                <Box >
                <Text bold color="#EFAF00" fontSize="sm">
                  RP. {dataModal?.hargaProduk}
                </Text>
                </Box>
                <Box >
                <Text fontSize="xs">
                  { dataModal?.jasaOngkir ==="one"
                  ? <Text>Kurir : JNE</Text>
                  : <Text>Diantar</Text>
                  }
                </Text>
              </Box>
              </VStack>
              </Box>
            </HStack>
            <Box>
            </Box>
        </Box>
        <Text mt="2"> Bukti Admin</Text>
        <Box pt="2">
              <Image 
                source={{uri : dataModal?.imgAdmin}}
                size="2xl"
                alt='foto'
                rounded="sm"
                />
              </Box>
        </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
              setShowModal(false);
            }}>
                Close
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
    </NativeBaseProvider>
  )
}

export default PesananBerhasil