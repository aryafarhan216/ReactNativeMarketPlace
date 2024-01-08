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
  const [namaAntar, setNamaAntar] = useState("")
  const [noAntar, setNoAntar] = useState("")
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
    const updateUser = doc(db, "pesanan",`${idPesanan.idPesanan}`)
    await updateDoc(updateUser, {
      resi: resi,
      noAntar: noAntar,
      namaAntar: namaAntar,
    }).then(()=>{
      alert("data sudah di update")
    })
    .catch((err) => alert(err))
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
              <Pressable
                onPress={() => {
                  const tglPembelian = data?.TglPembelian?.toDate();
                  const formattedDate = tglPembelian?.toLocaleDateString();

                  setDataModal({
                    resi : data?.resi,
                    noAntar : data?.noAntar,
                    namaAntar : data?.namaAntar,
                    alamat : `${data?.detailPembeli?.address?.city}, ${data?.detailPembeli?.address?.district}, ${data?.detailPembeli?.address?.street}, ${data?.detailPembeli?.address?.region}, ${data?.detailPembeli?.address?.subregion}`,
                    detailAlamat : data?.detailAlamat,
                    pesanan: data, // Set the entire data object to pesanan property
                    idPesanan: data?.idPesanan,
                    namaToko: data?.detailDataPenjual[0]?.detailPenjual?.detailToko?.namaToko,
                    namaProduk: data?.detailDataPenjual[0]?.detailPenjual?.produk[0].namaProduk,
                    tglPembelian: formattedDate,
                    imgProduk: data?.detailDataPenjual[0]?.detailPenjual?.produk[0].imgProduk,
                    totalHarga: data?.detailDataPenjual[0]?.detailPenjual?.produk[0].hargaProduk,
                    totalOngkir:data?.totalOngkir,
                    stokBeli: data?.detailDataPenjual[0]?.detailPenjual?.produk[0].stokBeli,
                    miliTerjual: data?.detailDataPenjual[0]?.detailPenjual?.produk[0].miliTerjual,
                    isCanceled: data?.detailDataPenjual[0]?.detailPenjual?.produk[0].isCancel,
                    isCanceled1: data?.detailDataPenjual[0]?.detailPenjual?.produk[0].isCancel1,
                    imgValidAdmin: data?.detailDataPenjual[0]?.detailPenjual?.produk[0].imgValidAdmin,
                    isConfirm: data?.detailDataPenjual[0]?.detailPenjual?.produk[0].isConfirm,
                    isDone: data?.detailDataPenjual[0]?.detailPenjual?.produk[0].isDone,
                    jasaOngkir : data?.jasaDataOngkir[0].jasaOngkir
                  });

                  setShowModal(true);
                }}
                key={index}
              >
        <Box bg="white" rounded="xl" p="5" mt="4" mx="5" key={index}>
        <VStack>
        <Box>
        <Text bold fontSize="xs" mb="1">
          {data?.detailPembeli.nama}
        </Text>
        </Box>
        {data?.detailDataPenjual[0]?.detailPenjual?.produk.map((produk, index) => (
        <Box key={index} mb={3}>
          <HStack space={3}>
            <Box pt="2">
              <Image
                source={{ uri: produk.imgProduk }}
                size="sm"
                alt="foto"
                rounded="sm"
              />
            </Box>
            <Box style={{ width: '30%' }}>
              <VStack space={0}>
                <Box>
                  <Text fontSize="sm">{produk.namaProduk}</Text>
                </Box>
                <Box>
                  <Text bold color="#EFAF00" fontSize="sm">
                    RP. {data?.produk[index].miliBeli === "1"
    ? data?.detailDataPenjual[0]?.detailPenjual?.produk[index].hargaProduk
    : data?.detailDataPenjual[0]?.detailPenjual?.produk[index][`hargaProduk${data?.produk[index].miliBeli - 1}`]}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="xs">
                    {produk.jasaOngkir === 'one' ? (
                      <Text>Kurir : JNE</Text>
                    ) : (
                      <Text>On the way</Text>
                    )}
                  </Text>
                </Box>
              </VStack>
            </Box>
            
          </HStack>
        </Box>
      ))}
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
        <Text mb="2">Tanggal Pemesanan: {dataModal?.tglPembelian}</Text>
        </Box>
         <Box>
         {dataModal.pesanan?.detailDataPenjual[0]?.detailPenjual?.produk.map((produk, index) => (
  <VStack key={index}>
    <Box>
      <Text fontSize="xs">
        Toko: {dataModal.pesanan?.detailDataPenjual[0]?.detailPenjual?.detailToko?.namaToko}
      </Text>
      <Text fontSize="sm">
        Produk: {produk.namaProduk}
      </Text>
      <Text bold fontSize="xs" mb="1">
        Tanggal Pembelian: {dataModal.tglPembelian}
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
              {dataModal.pesanan?.produk[index].miliBeli === "1"
    ? dataModal.pesanan?.detailDataPenjual[0]?.detailPenjual?.produk[index].miliProduk
    : dataModal.pesanan?.detailDataPenjual[0]?.detailPenjual?.produk[index][`miliProduk${dataModal.pesanan?.produk[index].miliBeli - 1}`]} \ mili
         
              </Text>
              <Text fontSize="sm">
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
                {dataModal.pesanan?.jasaDataOngkir[0].jasaOngkir === "one" ? <Text>Kurir : JNE</Text> : <Text>Diantar</Text>}
              </Text>
            </Box>
          </VStack>
        </Box>
      </HStack>
    </Box>
  </VStack>
))}
     
          
        </Box>
        </VStack>
        <Box mt="3">
          <Text>
            Alamat Pembeli  :
          </Text>
          <Text>
            {dataModal.alamat}
          </Text>
        </Box>
        <Box mb="3" mt="1">
          <Text>
            Detail Alamat  :
          </Text>
          <Text>
            {dataModal.detailAlamat}
          </Text>
        </Box>
        {dataModal.jasaOngkir === "one" 
        ?
        <Box>
        <Text bold> Ongkir {getOngkir()}</Text>
        <Text bold fontSize="xl"> Total {getTotalOngkirSum()}</Text>
        <Divider mt="2"/>
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
        <FormControl mt="1">
          
          { dataModal.noAntar == ""
          ?
          <Box>
          <FormControl.Label>Nama Pengirim</FormControl.Label>
          <Input 
                type="text"
                value={namaAntar}
                onChangeText= {text => setNamaAntar(text)}
          />
          <FormControl.Label>No Pengirim</FormControl.Label>
          <Input 
                keyboardType="numeric"
                placeholder="081234567890"
                type="text"
                value={noAntar}
                onChangeText= {text => setNoAntar(text)}
          />
          </Box>

          :
          <Box>
            Nama Pengirim: {dataModal.namaAntar}
            No Pengirim: {dataModal.noAntar}
          </Box>

          }
         
        </FormControl>
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
              handleUpdateResi(dataModal?.pesanan);
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