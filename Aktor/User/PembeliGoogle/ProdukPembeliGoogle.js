import {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Linking } from 'react-native';
import { NativeBaseProvider, ScrollView, Box, Text, VStack, HStack, 
  Center,FormControl, Input, Modal, Button,  ZStack, Image, AspectRatio, Pressable, Divider } from 'native-base'
import { db } from "../../../firebase";
import { collection,  where, onSnapshot, query, doc, getDoc, updateDoc } from "firebase/firestore";
import { useIsFocused } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const ProdukPembeliGoogle = ({navigation}) => {
  const [showModal, setShowModal] = useState(false);
  const [dataPesanan, setDataPesanan] = useState([null])
  const [isConfirm, setIsConfirm] = useState(false);
  const [dataModal, setDataModal] = useState(
    {
      idPesanan:"",
      namaToko:"", 
      namaProduk:"", 
      imgProduk:"",
      hargaProduk:"", 
      kurir:"", 
      resi:""
  })
  const [isFocus, setIsFocus] = useState(useIsFocused())
  const focus = useIsFocused()
  console.log(isFocus)
  useEffect(() =>{
    console.log(focus)
    if (focus == true) {
       console.log("masuk")
      // realtime
      let produkRef = collection(db,"pesanan")
      let uid = auth().currentUser?.uid
      let q = query(produkRef, where("userPembeli", "==", `${uid}`))
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
    } else{
      console.log("masuk")
      // realtime
      let produkRef = collection(db,"pesanan")
      let uid = auth().currentUser?.uid
      let q = query(produkRef, where("userPembeli", "==", `${uid}`))
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
  },[isFocus])

  const handleUpdate = async(idPesanan) =>{
    console.log("masuk", idPesanan)
    const updateUser = doc(db, "pesanan",`${idPesanan.idPesanan}`)
    await updateDoc(updateUser, {
      isConfirm1 : true
      }).catch((err) => alert(err))
      alert("Pesanan Sudah Selesai")
  }

  const handleBatal = async(idPesanan) =>{
    console.log("masuk", idPesanan)
    const updateUser = doc(db, "pesanan",`${idPesanan.idPesanan}`)
    await updateDoc(updateUser, {
      isCancel : true
      }).catch((err) => alert(err))
      alert("Pesanan diBatalkan")
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
    <SafeAreaView>
      <ScrollView>
      { dataPesanan &&
      <Box>
 {/* Pesanan */}
 {dataPesanan?.map((dataPesanan, index) =>{
        return(
              <Pressable
                onPress={() => {
                  const tglPembelian = dataPesanan?.TglPembelian?.toDate();
                  const formattedDate = tglPembelian?.toLocaleDateString();

                  setDataModal({
                    pesanan: dataPesanan, // Set the entire dataPesanan object to pesanan property
                    idPesanan: dataPesanan?.idPesanan,
                    namaToko: dataPesanan?.detailDataPenjual[0]?.detailPenjual?.detailToko?.namaToko,
                    namaProduk: dataPesanan?.detailDataPenjual[0]?.detailPenjual?.produk[0].namaProduk,
                    tglPembelian: formattedDate,
                    imgProduk: dataPesanan?.detailDataPenjual[0]?.detailPenjual?.produk[0].imgProduk,
                    totalHarga: dataPesanan?.detailDataPenjual[0]?.detailPenjual?.produk[0].hargaProduk,
                    totalOngkir:dataPesanan?.totalOngkir,
                    stokBeli: dataPesanan?.detailDataPenjual[0]?.detailPenjual?.produk[0].stokBeli,
                    miliTerjual: dataPesanan?.detailDataPenjual[0]?.detailPenjual?.produk[0].miliTerjual,
                    noAntar: dataPesanan?.detailDataPenjual[0]?.detailPenjual?.produk[0].noAntar,
                    namaAntar: dataPesanan?.detailDataPenjual[0]?.detailPenjual?.produk[0].namaAntar,
                    kurir: dataPesanan?.detailDataPenjual[0]?.detailPenjual?.produk[0].jasaOngkir,
                    resi: dataPesanan?.detailDataPenjual[0]?.detailPenjual?.produk[0].resi,
                    isCanceled: dataPesanan?.detailDataPenjual[0]?.detailPenjual?.produk[0].isCancel,
                    isCanceled1: dataPesanan?.detailDataPenjual[0]?.detailPenjual?.produk[0].isCancel1,
                    imgValidAdmin: dataPesanan?.detailDataPenjual[0]?.detailPenjual?.produk[0].imgValidAdmin,
                    isConfirm: dataPesanan?.detailDataPenjual[0]?.detailPenjual?.produk[0].isConfirm,
                    isDone: dataPesanan?.detailDataPenjual[0]?.detailPenjual?.produk[0].isDone,
                  });

                  setShowModal(true);
                }}
                key={index}
              >
        <Box bg="white" rounded="xl" p="5" mt="4" mx="5" key={index}>
        <VStack>
        <Box>
        <Text bold fontSize="xs" mb="1">
          {dataPesanan?.detailDataPenjual[0]?.detailPenjual?.detailToko?.namaToko}
        </Text>
        </Box>
        {dataPesanan?.detailDataPenjual[0]?.detailPenjual?.produk.map((produk, index) => (
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
                    RP. {dataPesanan?.produk[index].miliBeli === "1"
    ? dataPesanan?.detailDataPenjual[0]?.detailPenjual?.produk[index].hargaProduk
    : dataPesanan?.detailDataPenjual[0]?.detailPenjual?.produk[index][`hargaProduk${dataPesanan?.produk[index].miliBeli - 1}`]}
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
            <Divider orientation="vertical" bg="black" />
            <Box>
              <Text mt="3">Status :</Text>
              {dataPesanan?.isCancel === true ? (
            <Box>
              {dataPesanan?.isCancel1 ? (
                <Text> Dana sudah ditransfer</Text>
              ) : (
                <Text> Pengembalian DANA 1 x 24 jam</Text>
              )}
            </Box>
          ) : dataPesanan?.isDone === false ? (
            dataPesanan?.isConfirm === false ? (
              <Text>Waiting to Admin</Text>
            ) : dataPesanan?.noAntar ? (
              <Box>
                <Text>
                  Pengirim : {dataPesanan?.namaAntar} 
                  
                </Text>
                <Text>No Pengirim: {dataPesanan?.noAntar}

                </Text>
              </Box>
            ) : (
              <Text>sedang diantar</Text>
            )
          ) : (
            <Text>Selesai</Text>
          )}
            </Box>
          </HStack>
        </Box>
      ))}
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
              {/* Map through produk in dataModal.pesanan */}
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
              {dataModal.pesanan?.produk[index].miliBeli === "1"
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
      <Box my="2">
        <Text fontSize="xs">Status Pesanan:</Text>
        {dataModal.pesanan?.isCancel === true ? (
          <Box>
            {dataModal.pesanan?.isCancel1 ? (
              <Box>
                <Text my={2}>Dana Sudah dikembalikan</Text>
                <Image
                  source={{ uri: dataModal.pesanan?.imgValidAdmin }}
                  size="xl"
                  alt='foto'
                  rounded="sm"
                />
              </Box>
            ) : (
              <Text> Waiting...</Text>
            )}
          </Box>
        ) : (
          <Box>
              {dataModal.pesanan?.jasaDataOngkir[0].jasaOngkir === 'one'
              ?
              <Box>

              <Text style={{color: 'blue'}}
                    onPress={() => Linking.openURL('https://www.jne.co.id/id/tracking/trace')}>
                Cek Resi : {dataModal.pesanan?.resi}
              </Text>
              </Box>
              :
              <Box>
              <Text>Nama Antar : {dataModal.pesanan?.namaAntar}</Text>
              <Text>No Antar : {dataModal.pesanan?.noAntar}</Text>
              </Box>
              
              }
          </Box>
        )}
      </Box>
    </Box>
  </VStack>
))}
<Text bold >Ongkir: {getOngkir()}</Text>
<Text bold >Total: {getTotalOngkirSum()}</Text>
<Text>Detail </Text>
<Text bold fontSize="xl"> Total Belanja: {dataModal?.totalOngkir}</Text>
          {dataModal.pesanan?.isDone === true ? (
              <Button colorScheme="yellow" onPress={() => { setShowModal(false); }}>
                Okay
              </Button>
            ) : (
              <Button onPress={() => { setShowModal(false); setIsConfirm(true); handleUpdate(dataModal?.pesanan); }} colorScheme="yellow">
                Konfirmasi
              </Button>
            )}
            
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button variant="ghost" colorScheme="blueGray" onPress={() => { setShowModal(false); }}>
                  Cancel
                </Button>
                {dataModal.pesanan?.isCanceled !== true && dataModal.pesanan?.isConfirm !== true && dataModal.pesanan?.isDone !== true && (
                  <Button variant="ghost" colorScheme="red" onPress={() => { setShowModal(false); handleBatal(dataModal.pesanan); }}>
                    Batalkan
                  </Button>
                )}
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>

    </NativeBaseProvider>
  )
}

export default ProdukPembeliGoogle