import React, {useState,useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NativeBaseProvider, ScrollView, Box, Text, VStack, HStack, ZStack, Modal, Center,FormControl, Input,  Button, Image, AspectRatio, Pressable, Divider } from 'native-base'
import { auth, db, storage} from "../../../firebase";
import { collection,  where, onSnapshot, query, doc, updateDoc } from "firebase/firestore";
import { useIsFocused } from '@react-navigation/native';
// image
import { Ionicons } from '@expo/vector-icons';
const img = require('../../../assets/src/DrawKit-Vector-Illustration-ecommerce-17.png')

const HistoryPenjual = () => {
  const [showModal, setShowModal] = useState(false);
  const [resi, setResi] = useState("")
  const [total, setTotal] = useState("")
  const [dataModal, setDataModal] = useState({
    namaProduk: "",
    imgProduk : "",
    hargaProduk : "",
    idPesanan:"",
    imgValid :""
  })
  const [data, setData] = useState([null])
  const focus = useIsFocused()
  useEffect(()=>{
    if(focus){
      let userRef = collection(db,"pesanan")
      let q = query(userRef, where( "userToko", "==",`${auth?.currentUser?.uid}`), where("isDone", "==", true,))
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

  useEffect(() => {
    if (data) {
      setTotal(totalIncome(data));
    }
  }, [data]);
  
  const totalIncome = (data) => {
    let total = 0;
  
    if (data?.length) { // Check if the data array is not empty
      data.forEach((item) => {
        if (item && item.totalOngkir) { // Add a null check for each item
          const produk = item.detailDataPenjual[0]?.detailPenjual?.produk;
          const produkLength = produk.length;
          let sum = 0;
          for (let i = 0; i < produkLength; i++) {
            sum += item.totalDataOngkir[i]?.hargaOngkir || 0;
          }
          total += sum; // Add the calculated sum to the total variable
        }
      });
    }
  
    return total;
  };
  

      const getTotalOngkirSum = () => {
  const produkData = dataModal?.pesanan?.detailDataPenjual[0]?.detailPenjual?.produk;
  const totalOngkirData = dataModal?.pesanan?.totalDataOngkir;
  
  
  if (produkData && totalOngkirData) {
    const produkLength = produkData.length;
    console.log(produkLength)
    let sum = 0;
    for (let i = 0; i < produkLength; i++) {
      sum += totalOngkirData[i]?.hargaOngkir || 0;
    }
    console.log(sum)
    return sum;
  }
  
  return 0; // Return 0 in case the necessary data is not available
};

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
    <HStack>
    <Box bg="white" rounded="xl" p="5" mt="4" ml="5">
      <HStack>
      <Text>Total : {data?.length}</Text>
      </HStack>
    </Box>

    <Box bg="white" rounded="xl" p="5" mt="4" mx="2">
      <HStack>
      {data?.length > 0
      ?
      <Text>Income : {total}</Text>
      :
      <Text>Income : 0</Text>
      }
      
      </HStack>
    </Box>
    </HStack>
    {data?.map((data, index) =>{
      return(
            <Pressable
              onPress={() => {
                const tglPembelian = data?.TglPembelian?.toDate();
                const formattedDate = tglPembelian?.toLocaleDateString();
                const tglSelesai = data?.tglSelesai?.toDate();
                const formattedDate1 = tglSelesai?.toLocaleDateString();

                setDataModal({
                  namaPembeli: data?.detailPembeli?.nama,
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
                  RP. {produk.hargaProduk}
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
              RP. {produk.hargaProduk}
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
      <Text bold fontSize="md"> Total {getTotalOngkirSum()}</Text>
      <Divider mt="2"/>
      <FormControl mt="3">
        <FormControl.Label>ADD RESI</FormControl.Label>

        <Box>
          resi : {dataModal.resi}
        </Box>

        
       
      </FormControl>
      </Box>
      :
      <Box>
      <FormControl mt="1">
      <Text bold fontSize="md">Total {getTotalOngkirSum()}</Text>
      <Text>Detail Pengantar: </Text>
        <Box>
          Nama Pengirim: {dataModal.pesanan?.namaAntar}
          No Pengirim: {dataModal.pesanan?.noAntar}
        </Box>
       
      </FormControl>
      </Box>
      
      }

      <Divider mt="4"/>
      <Box alignSelf="center">
      <Text my="3" bold>Bukti Transfer Admin</Text>
      <Image 
              source={{uri : dataModal.pesanan?.imgValidAdmin}}
              size="2xl"
              alt='foto'
              />
      </Box>
              


  
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

export default HistoryPenjual