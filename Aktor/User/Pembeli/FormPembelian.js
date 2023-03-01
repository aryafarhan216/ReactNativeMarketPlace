
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Box, NativeBaseProvider, ScrollView, Stack, Text, Image, Radio, 
  Divider, Button, Center, FormControl, Input} from 'native-base'
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, setDoc, collection, updateDoc } from "firebase/firestore"; 
import { useIsFocused } from '@react-navigation/native';
import { auth, db, storage} from "../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const FormPembelian = ({route, navigation}) => {
  const [value, setValue] = useState("one");
  const [dataPembeli, setDataPembeli] = useState([null])
  const [stok, setStok] = useState("");
  const {detailPembelian} = route.params
  const listDetail = []
  listDetail.push(detailPembelian)
// varible id
  const [idCityPenjual, setIdCityPenjual] = useState("")
  const [idCityPembeli, setIdCityPembeli] = useState("")
  const [ongkir, setOngkir] = useState(null)
// distance
  const [distance, setDistance] = useState("")
  const [ongkirD, setOngkirD] = useState("")
  const focus = useIsFocused()
// image
  const [fotoProduk, setFotoProduk] = useState(null)
  const [image, setImage] = useState(null)

  useEffect(() =>{
    if (focus === true){
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
        let name = "validaton/" + `${auth.currentUser?.uid}` + "|"+new Date().getTime()
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
              console.log('File available at', downloadURL);
              setFotoProduk(downloadURL)
              blob.close();
            });
          }
        );
        
      }
  
      image && blobImage();

      // take dataPembeli
      const data = async() =>{
        console.log("masuk")
        const docRef = doc(db, "user", `${auth?.currentUser.uid}`);
        const docSnap = await getDoc(docRef);
        let tempData = []
        if (docSnap.exists()) {
          tempData.push(docSnap.data())
        } else {
          console.log("No such document!");
        }
        setDataPembeli(tempData)
      }

      const getIdCityPenjual = async () =>{
        const dataRegion = await fetch('https://api.rajaongkir.com/starter/province/?id=',
        {
          method: 'GET',
          headers:{key: 'da33de125c84a7a569abb5cf558640c4'}
        }).then((req) =>{
          return req.text()
        }).then((data) => {
          let dataBody = JSON.parse(data)
          let dataResult = dataBody.rajaongkir.results
          let filterProv= dataResult.filter(result => result.province === listDetail[0]?.detailToko?.address?.region)
          const idProv = filterProv.map(result => result.province_id);
          // get cityid
          const getCity = async (id) =>{
            const dataRegion = await fetch(`https://api.rajaongkir.com/starter/city?id=&province=${id}`,
            {
              method: 'GET',
              headers:{key: 'da33de125c84a7a569abb5cf558640c4'}
            }).then((req) =>{
              return req.text()
            }).then((data) => {
              let dataBody = JSON.parse(data)
              let dataResult = dataBody.rajaongkir.results
              let city = listDetail[0]?.detailToko?.address?.subregion
              let cityName = city.replace("Kota ","")
              let filterCity = dataResult.filter(result => result.city_name === cityName)
              const cityId = filterCity.map(result => result.city_id);
              setIdCityPenjual(cityId)
            })
            .catch((err) =>{
              console.log(err)
            })
          }
          getCity(idProv)
        })
        .catch((err) =>{
          console.log(err)
        })
      }

      // get id city pembeli
      const getIdCityPembeli= async () =>{
        const dataRegion = await fetch('https://api.rajaongkir.com/starter/province/?id=',
        {
          method: 'GET',
          headers:{key: 'da33de125c84a7a569abb5cf558640c4'}
        }).then((req) =>{
          return req.text()
        }).then((data) => {
          let dataBody = JSON.parse(data)
          let dataResult = dataBody.rajaongkir.results
          let filterProv= dataResult.filter(result => result.province === dataPembeli[0]?.address?.region)
          const idProv = filterProv.map(result => result.province_id);
          // get cityid
          const getCity = async (id) =>{
            const dataRegion = await fetch(`https://api.rajaongkir.com/starter/city?id=&province=${id}`,
            {
              method: 'GET',
              headers:{key: 'da33de125c84a7a569abb5cf558640c4'}
            }).then((req) =>{
              return req.text()
            }).then((data) => {
              let dataBody = JSON.parse(data)
              let dataResult = dataBody.rajaongkir.results
              let city = dataPembeli[0]?.address?.subregion
              let cityName = city.replace("Kota ","")
              let filterCity = dataResult.filter(result => result.city_name === cityName)
              const cityId = filterCity.map(result => result.city_id);
              setIdCityPembeli(cityId)
            })
            .catch((err) =>{
              console.log(err)
            })
          }
          getCity(idProv)
        })
        .catch((err) =>{
          console.log(err)
        })
      }
      
      getIdCityPenjual()
      getIdCityPembeli()
      data()

      if(idCityPembeli[0] != "" && idCityPenjual[0] != ""){
        console.log("masuk hehe")
        const getOngkir = async () =>{
          const dataRegion = await fetch('https://api.rajaongkir.com/starter/cost',
          {
            method: 'POST',
            headers: 
            {
            key: 'da33de125c84a7a569abb5cf558640c4', 
            'content-type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
              origin: '353',
              destination: '353',
              weight: 1700,
              courier: 'jne'
            }).toString()
          }).then((req) =>{
            return req.text()
          }).then((data) =>{
            let dataBody = JSON.parse(data)
            setOngkir(dataBody.rajaongkir.results[0].costs[0])
          }).catch((e) =>{
            console.log(e)
          })
        }
  
        // get distance
        if(listDetail[0].detailToko.isSiantar == true && dataPembeli[0]?.isSiantar == true){
          const getDistanceA = async() =>{
            console.log("function distance")
            // pembeli
            const startLat = dataPembeli[0]?.addressCord?.coords?.latitude
            const startLon = dataPembeli[0]?.addressCord?.coords?.longitude
            // penjual
            const endLat = detailPembelian.detailToko.addressCord.coords.latitude
            const endLon = detailPembelian.detailToko.addressCord.coords.longitude
            const apiKey = '5b3ce3597851110001cf6248bd0768f706814962a1fe5e4b91769469';
            const getDistance = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startLon},${startLat}&end=${endLon},${endLat}`)
            .then(response => response.json())
            .then(data => {
              const distanceInKm = (data.features[0].properties.segments[0].distance / 1000).toFixed(1);
              setDistance(distanceInKm)
              if(distanceInKm <= 5.0) {
                console.log("masuk 1")
                setOngkirD(10000)
              }else if(distanceInKm <= 10.0) {
                console.log("masuk 2")
                setOngkirD(15000)
              }else{
                setOngkirD(20000)
              }

              // if(distanceInKm <= 10.0) setOngkirD(15000)
            })
            .catch(error => console.error(error));
          }
         getDistanceA() 
          
        }
        getOngkir()
       
      }
    }

    
  }, [value, image])

  const sumTotal= () =>{
    if(value === 'one'){
      let total = parseInt(ongkir?.cost[0]?.value) + (parseInt(listDetail[0].produk.hargaProduk) * parseInt(stok))
      return total
    }else{
      let total = parseInt(ongkirD) + (parseInt(listDetail[0].produk.hargaProduk) * parseInt(stok))
      return total
    }
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

  const handleUpload = async() =>{
    if(stok != "" && parseInt(stok) >= 0 && parseInt(stok) <= listDetail[0].produk.stokProduk){
      if(fotoProduk != null && dataPembeli[0]?.address != "" && detailPembelian.detailToko.address != ""){
        const idValid = 'P' + new Date().getTime()
        let stokUpdate =  parseInt(listDetail[0].produk.stokProduk) - stok
        const docRef = collection(db, "pesanan")
        setDoc(doc(docRef, `${idValid}`),{
          idPesanan : idValid,
          userPembeli : auth?.currentUser?.uid,
          stokBeli : stok,
          userToko : listDetail[0].produk.userUid,
          detailPenjual : listDetail[0],
          detailPembeli : dataPembeli[0],
          jasaOngkir : value,
          totalOngkir : sumTotal(),
          isConfirm : false,
          isConfirm1 : false,
          isDone : false,
          resi : "",
          imgValid : fotoProduk
          
        }).then(async ()=>{
          const updateUser = doc(db, "produk",`${listDetail[0].produk.idProduk}`)
          await updateDoc(updateUser, {
            stokProduk : stokUpdate
          }).then(() =>{
            alert("Produk Berhasil DiBeli ;)")
            navigation.navigate('Pesanan')
          })
        }).catch((err) => alert(err));
      }else{
        alert("Stok ada yang salah")
      }
    }

  }
  return (
    <NativeBaseProvider>
    <SafeAreaView>
    <ScrollView>
      <Box p={4}>
        <Box backgroundColor="white" p={4} mt="3" rounded="md">
          <Text bold> Alamat Tujuan:</Text>
          <Text fontSize="xs">{dataPembeli[0]?.address?.city}, { dataPembeli[0]?.address?.district}, { dataPembeli[0]?.address?.street}, { dataPembeli[0]?.address?.region}, 
          kode post: {dataPembeli[0]?.address?.postalCode}</Text>
        </Box>
        <Box backgroundColor="white" p={4} mt="3" rounded="md">
          <Text bold mb="1">{listDetail[0].detailToko.namaToko}</Text>
          <Stack direction="row">
            <Box>
              <Image
                source={{uri : listDetail[0].produk.imgProduk}}
                width="70px"
                height="70px"
                alt='image produk'
                rounded="md"
              />
            </Box>
            <Box alignSelf="center" mx="4">
              <Text>{listDetail[0].produk.namaProduk}</Text>
              <Text bold fontSize="lg">RP {listDetail[0].produk.hargaProduk}</Text>
              <Text>Stok : {listDetail[0].produk.stokProduk} </Text>
            </Box>
          </Stack>
        </Box>

        <Box backgroundColor="white" p={4} mt="3" rounded="md">
        <FormControl >
                <FormControl.Label>Stok</FormControl.Label>
                <Input placeholder="" keyboardType='numeric' 
                    type="text"
                    value={stok}
                    onChangeText= {text => setStok(text)}
                />
              </FormControl>
        </Box>
        <Box alignItems="center">
        {listDetail[0].detailToko.isSiantar == true && dataPembeli[0]?.isSiantar == true
        ? 
        <Box>
        <Radio.Group name="myRadioGroup" accessibilityLabel="favorite number" value={value} onChange={nextValue => {
          setValue(nextValue);
        }}>
            <Radio value="one" my={1} colorScheme="yellow">
            <Box backgroundColor="white" p={4} mt="3" rounded="md" >
              <Text bold> Pengiriman</Text>
              <Text > Ekspedisi : <Text bold> JNE</Text></Text>
              <Text > Estimasi : <Text bold> {ongkir?.cost[0]?.etd} Hari</Text></Text>
              <Text bold fontSize="lg"> Rp. {ongkir?.cost[0]?.value}</Text>
            </Box>
            </Radio>
            <Radio value="two" my={1} colorScheme="yellow">
            <Box backgroundColor="white" p={4} mt="3" rounded="md">
              <Text> Pemantang Siantar</Text>
            <Text > Jarak : <Text bold> {distance} KM</Text></Text>
              <Text bold fontSize="lg"> RP. {ongkirD}</Text>
            </Box>
            </Radio>
        </Radio.Group>
        </Box>
        :
        <Box backgroundColor="white" p={4} mt="3" rounded="md" >
              <Text bold> Pengiriman</Text>
              <Text > Ekspedisi : <Text bold> JNE</Text></Text>
              <Text > Estimasi : <Text bold> {ongkir?.cost[0]?.etd} Hari</Text></Text>
              <Text bold fontSize="lg"> Rp. {ongkir?.cost[0]?.value}</Text>
          </Box>

        }
        
        </Box>
        <Box backgroundColor="white" p={4} mt="3" rounded="md">
          <Text bold> Pembayaran</Text>
          <Text > Total Pembayaran</Text>
          <Text bold fontSize="lg" color="#EFAF00" mb={3}> RP {sumTotal()}</Text>
          <Divider />
          <Text bold mt={3}> Bank BCA</Text>
          <Text> No Rek  : 124123124123</Text>
          <Text> A/N        : Admin</Text>
        </Box>
        <Box backgroundColor="white" p={4} mt="3" rounded="md">
        
        
          {image && 
            <Center my='3'>
          <Text>Foto Bukti Transfer</Text>
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} alt="Fotobukti"/>
          </Center>
          }
          
          <Text bold> Upload Bukti Transfer</Text>
          <Button onPress={pickImage}>
          upload
          </Button>

           
        </Box>

        <Divider />

        <Stack direction="row" alignSelf="flex-end" mt="4">
        <Box>
        <Button size="sm" colorScheme="red" variant="outline"
        onPress={() =>{
            navigation.navigate('Keranjang')}}
        >Cancel</Button>
        </Box>
        <Box px={2}>
        <Button size="sm" colorScheme="green" onPress={handleUpload} >Buy</Button>
        </Box>

        </Stack>
      </Box>



    </ScrollView>
    </SafeAreaView>
    </NativeBaseProvider>
  )
}

export default FormPembelian;