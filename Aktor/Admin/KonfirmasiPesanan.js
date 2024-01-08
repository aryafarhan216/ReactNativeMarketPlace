
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
// Firebase
import { db, storage} from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection,  where, onSnapshot, query, doc, updateDoc } from "firebase/firestore";
import { HStack, NativeBaseProvider, ScrollView, Box, Divider, Text,Modal, Image, Button, Pressable, Center, VStack } from 'native-base';

const KonfirmasiPesanan = () => {
  const [data, setData] = useState([null])
  const [showModal,setShowModal] = useState(false)
  const [selectedProductIndex, setSelectedProductIndex] = useState(0)
  // image
  const [fotoProduk, setFotoProduk] = useState(null)
  const [image, setImage] = useState(null)

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
    stokBeli:"",
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
      let q = query(userRef, where("isConfirm", "==", false), where("isCancel", "==", false));
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
  }, [image])

  const handleStatus = async(idPesanan) =>{
    console.log(idPesanan)
    const updateUser = doc(db, "pesanan",`${idPesanan.idPesanan}`)
    await updateDoc(updateUser, {
      isConfirm:true,
      imgValidAdmin: fotoProduk
    }).then(()=>{
      
      alert("Terkonfirmasi")
    })
    .catch((err) => alert(err))
    setImage(null)
  }

  const getTotalOngkirSum = () => {
    const produkData = dataModal?.pesanan?.detailDataPenjual[0]?.detailPenjual?.produk;
    const totalOngkirData = dataModal?.pesanan?.totalDataOngkir;
    
    const hargaProduk =  dataModal.pesanan?.produk[0].miliBeli === "1" ? dataModal.pesanan?.detailDataPenjual[0]?.detailPenjual?.produk[0].hargaProduk : dataModal.pesanan?.detailDataPenjual[0]?.detailPenjual?.produk[0][`hargaProduk${dataModal.pesanan?.produk[0].miliBeli - 1}`]
    const hargaOngkir = dataModal?.pesanan?.totalDataOngkir[0].hargaOngkir
    const ongkir = hargaOngkir - hargaProduk
    
    if (produkData && totalOngkirData) {
      const produkLength = produkData.length;
      console.log(produkLength)
      let sum = 0;
      for (let i = 0; i < produkLength; i++) {
        const hargaProduk1 = dataModal.pesanan?.produk[i].miliBeli === "1" ? dataModal.pesanan?.detailDataPenjual[0]?.detailPenjual?.produk[i].hargaProduk : dataModal.pesanan?.detailDataPenjual[0]?.detailPenjual?.produk[i][`hargaProduk${dataModal.pesanan?.produk[i].miliBeli - 1}`]
        sum += parseInt(hargaProduk1)
      }
      console.log(sum + ongkir)
      return sum + ongkir;
    }
    
    
    return 0; // Return 0 in case the necessary data is not available
  };

  const getOngkir = () =>{

    const hargaProduk =  dataModal.pesanan?.produk[0].miliBeli === "1" ? dataModal.pesanan?.detailDataPenjual[0]?.detailPenjual?.produk[0].hargaProduk : dataModal.pesanan?.detailDataPenjual[0]?.detailPenjual?.produk[0][`hargaProduk${dataModal.pesanan?.produk[0].miliBeli - 1}`]
    const hargaOngkir = dataModal?.pesanan?.totalDataOngkir[0].hargaOngkir
    const ongkir = hargaOngkir - hargaProduk
    return ongkir
  }
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
            const tglPembelian = data?.TglPembelian?.toDate().toString();
            setShowModal(true)
            setDataModal({
              pesanan: data,
              selectedProductIndex: index,
              idPesanan:data?.idPesanan,
              jasaOngkir: data?.jasaOngkir,
              totalOngkir: data?.totalOngkir,
              // produk
              idProduk:data?.detailPenjual?.produk?.idProduk,
              namaProduk:data?.detailPenjual?.produk?.namaProduk,
              hargaProduk: data?.detailPenjual?.produk?.hargaProduk,
              imgProduk :data?.detailPenjual?.produk?.imgProduk,
              descProduk: data?.detailPenjual?.produk?.descProduk,
              tglPembelian : tglPembelian,
              // pembeli
              namaPembeli:data?.detailPembeli?.nama,
              noHpPembeli:data?.detailPembeli?.noHp ,
              imgBukti:data?.imgValid,
              stokBeli : data?.stokBeli,
              miliTerjual: data?.miliTerjual,
              rekeningP : data?.detailPembeli?.rekening,
              noRekeningP : data?.detailPembeli?.noRekening,
              atasNamaP : data?.detailPembeli?.atasNama,
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
        }}>{data?.idPesanan}
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
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} propagateSwipe>
      
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Detail Pesanan {dataModal?.idPesanan}</Modal.Header>
          <Modal.Body>
          <VStack>
         <Box>
         <Text bold>Detail Penjual:</Text>
         <Text mb="2">{dataModal?.tglPembelian}</Text>

         {dataModal.pesanan?.detailDataPenjual[0]?.detailPenjual?.produk.map((produk, index) => (
  <VStack key={index} my={2}>
    <Box>
      <Text fontSize="xs">
        Toko: {dataModal.pesanan?.detailDataPenjual[0]?.detailPenjual?.detailToko?.namaToko}
      </Text>
      <Text fontSize="sm">
        Produk: {produk.namaProduk}
      </Text>
    </Box>
    <Box>
      <HStack space={3}>
        <Box pt="2">
          <Image
            source={{ uri: produk.imgProduk }}
            size="md"
            alt='foto'
            rounded="sm"
          />
        </Box>
        <Box>
          <VStack space={0}>
            <Box>
              <Text fontSize="sm">
              <Text fontSize="sm">
              <Text fontSize="sm">
  {dataModal.pesanan?.produk[index].miliBeli === "1"
    ? dataModal.pesanan?.detailDataPenjual[0]?.detailPenjual?.produk[index].miliProduk
    : dataModal.pesanan?.detailDataPenjual[0]?.detailPenjual?.produk[index][`miliProduk${dataModal.pesanan?.produk[index].miliBeli - 1}`]} \ mili
</Text>

</Text>


              </Text>
              <Text fontSize="sm">
              {dataModal.pesanan?.produk[index].miliBeli}
                Stok dibeli: {dataModal.pesanan?.produk[index].stokBeli}
              </Text>
            </Box>
            <Box>
              <Text bold color="#EFAF00" fontSize="sm">
                RP. {dataModal.pesanan?.produk[index].miliBeli === "1"
    ? dataModal.pesanan?.detailDataPenjual[0]?.detailPenjual?.produk[index].hargaProduk
    : dataModal.pesanan?.detailDataPenjual[0]?.detailPenjual?.produk[index][`hargaProduk${dataModal.pesanan?.produk[index].miliBeli - 1}`]}
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs">
                {dataModal.pesanan?.jasaDataOngkir[index] === "one" ? <Text>Kurir : JNE</Text> : <Text>Diantar</Text>}
              </Text>
            </Box>
          </VStack>
        </Box>
      </HStack>
     
    </Box>
  </VStack>
))}



            
            <Box>
            </Box>
        </Box>
        <Divider my="2"/>
        <Box>
        <Text bold fontSize="md">ONGKIR : {getOngkir()} </Text>
        <Text bold fontSize="md">Admin TRANSFER : {getTotalOngkirSum()}</Text>
        <Text>Rekening       : {dataModal.pesanan?.detailDataPenjual[0]?.detailPenjual?.detailToko.bank.rekening}</Text>
        <Text>No Rekening : {dataModal.pesanan?.detailDataPenjual[0]?.detailPenjual?.detailToko.bank.noRekening}</Text>
        <Text>Atas Nama    : {dataModal.pesanan?.detailDataPenjual[0]?.detailPenjual?.detailToko.bank.atasNama}</Text>
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
                <Text>
                {dataModal?.noHpPembeli}
                </Text>
              </Box>
                <Box >
     

                <Text bold  fontSize="sm">
                 Total Pembayaran:
                </Text>
                <Text bold  fontSize="sm">
                 RP. {dataModal?.totalOngkir}
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
            <Divider my="2"/>
        <Box>
        <Text>Rekening       : {dataModal?.rekeningP}</Text>
        <Text>No Rekening : {dataModal?.noRekeningP}</Text>
        <Text>Atas Nama    : {dataModal?.atasNamaP}</Text>
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
              handleStatus(dataModal?.pesanan);
              
            }} colorScheme="yellow">
                Konfirmasi
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
    </NativeBaseProvider>
  )
}

export default KonfirmasiPesanan