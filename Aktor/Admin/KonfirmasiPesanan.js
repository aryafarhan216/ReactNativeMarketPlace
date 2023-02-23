
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
      let q = query(userRef, where("isConfirm", "==", false))
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

      // Upload image
      console.log("masuk focus")
      // upload image
      const blobImage = async() =>{
        console.log("masukBlob")
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", image, true);
          xhr.send(null);
          
        });
  
  
        return uploadImage(blob)
      }
      const uploadImage = (blob) =>{
        let name = "validatonAdmin/" + "|"+new Date().getTime()
        const storageRef = ref(storage, 'images/' + name);
        const uploadTask = uploadBytesResumable(storageRef, blob);
      // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          'state_changed',  
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          }, 
          (error) => {
            switch (error.code) {
              case 'storage/unauthorized':
                alert(error)
                break;
              case 'storage/canceled':
                alert(error)
                break;
              case 'storage/unknown':
                alert(error)
                break;
            }
          }, 
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setFotoProduk(downloadURL)
              blob.close();
            });
          }
        );
        
      }
      image && blobImage();
      return () =>{
        realData()
      }
    }
  }, [image])

  const handleStatus = async(idPesanan) =>{
    console.log(idPesanan)
    const updateUser = doc(db, "pesanan",`${idPesanan}`)
    await updateDoc(updateUser, {
      isConfirm:true,
      imgValidAdmin: fotoProduk
    }).then(()=>{
      
      alert("Terkonfirmasi")
    })
    .catch((err) => alert(err))
    setImage(null)
  }

  const pickImage = async () =>{
    console.log("masuk foto")
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if(!result.canceled){
      setImage(result.assets[0].uri)
    }
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
            <Divider my="2"/>
            {image && 
              <Center>
              <Text my="3">Foto Bukti Transfer Admin</Text>
              <Image source={{ uri: image }} style={{ width: 200, height: 200 }} alt="Fotobukti"/>
              </Center>
            }
          <Text bold mt="2"> Upload Bukti Transfer</Text>
          <Button onPress={pickImage} colorScheme="yellow">
          upload
          </Button>
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
              if(image){
                setShowModal(false);
              handleStatus(dataModal.idPesanan);
              }else{
                alert("bukti tranfer belom diupload")
              }
              
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

export default KonfirmasiPesanan