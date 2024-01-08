
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Box, NativeBaseProvider, ScrollView, Stack, Text, Image, Radio, 
  Divider, Button, Center, FormControl, Input} from 'native-base'
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, setDoc, collection, updateDoc, Timestamp } from "firebase/firestore"; 
import { useIsFocused } from '@react-navigation/native';
import { db, storage} from "../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import auth from '@react-native-firebase/auth';

const FormPembelianGoogle = ({route, navigation}) => {
  const uid = auth().currentUser?.uid
  const [dataPembeli, setDataPembeli] = useState([null])
  const [detailAlamat, setDetailAlamat] = useState("");
  const {detailPembelian} = route.params
  const listDetail = [detailPembelian]
  const [stok, setStok] = useState(listDetail[0]?.map(() => "") || [])
  const [miliProduk, setMiliProduk] = useState(listDetail[0]?.map(() => "1") || []);

  
  const focus = useIsFocused()
// image
  const [fotoProduk, setFotoProduk] = useState(null)
  const [image, setImage] = useState(null)

  useEffect(() =>{
    if (focus === true){
    


      // upload image
      const blobImage = async() =>{
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", image, true);
          xhr.send(null);
          
        });
  
  
        return uploadImage(blob)
      }
      const uploadImage = (blob) =>{
        let name = "validaton/" + `${uid}` + "|"+new Date().getTime()
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

      }
    }, [value, image])

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

  // New Cart
  const [idCityPenjual, setIdCityPenjual] = useState([]);
  const [idCityPembeli, setIdCityPembeli] = useState("");
  const [ongkir, setOngkir] = useState([])
  const [ongkirD, setOngkirD] = useState([])
  const [distance, setDistance] = useState([]);
  const initialRadioValues = new Array(listDetail[0].length).fill('one'); // Initialize with 'one'
  const [value, setValue] = useState(initialRadioValues);


  
  useEffect(() => {
    if (focus) {
      setMiliProduk(
        listDetail[0]?.map((item) => {
          return item?.produk?.map(() => "1") || [];
        }) || []
      );
  
      // Initialize the stok state with empty values for each produk item
      setStok(
        listDetail[0]?.map((item) => {
          return item?.produk?.map(() => "") || [];
        }) || []
      );
      fetchData();
    }
  }, [focus]);

  const fetchData = async () => {
    await data();
    const cityPembeli = await getIdCityPembeli();
    const cityPenjual = await getIdCityPenjual();

    if (cityPembeli && cityPenjual) {
      if (cityPenjual.length === listDetail[0].length){
        setIdCityPembeli(cityPembeli);
        setIdCityPenjual(cityPenjual);
        calculateDistances();
        fetchOngkir();
      }else{
      }
    }
  };

  const fetchOngkir = async () => {
    try {
      // Use Promise.all to wait for both idCityPembeli and idCityPenjual to resolve
      const [pembeli, penjual] = await Promise.all([idCityPembeli, idCityPenjual]);
      // Now you can call getOngkir and pass idCityPembeli and idCityPenjual as arguments
      await getOngkir(idCityPembeli, idCityPenjual);
      
    } catch (error) {
      alert(error);
    }
  };
  
  const data = async() =>{
        const docRef = doc(db, "user", `${uid}`);
        const docSnap = await getDoc(docRef);
        let tempData = []
        if (docSnap.exists()) {
          tempData.push(docSnap.data())
        } else {
          console.log("No such document!");
        }
        setDataPembeli(tempData)
      }
const getIdCityPembeli = async () => {
  try {
    const dataRegion = await fetch('https://api.rajaongkir.com/starter/province/?id=', {
      method: 'GET',
      headers: { key: 'c2c121c370d4e8d81c15514667ed23da' }
    });
    const data = await dataRegion.json();
    const dataResult = data.rajaongkir.results;
    const filterProv = dataResult.filter(result => result.province === dataPembeli[0]?.address?.region);

    if (filterProv.length === 0) {
      console.log("Province not found in API response");
      return null;
    }

    const idProv = filterProv[0].province_id;

    const dataRegionCity = await fetch(`https://api.rajaongkir.com/starter/city?id=&province=${idProv}`, {
      method: 'GET',
      headers: { key: 'c2c121c370d4e8d81c15514667ed23da' }
    });
    const dataCity = await dataRegionCity.json();
    
    const dataResultCity = dataCity.rajaongkir.results;

    const cityName = dataPembeli[0]?.address?.subregion?.replace("Kota ", "");
    const filterCity = dataResultCity.filter((result) => result.city_name === cityName);

    if (filterCity.length > 0) {
      const cityId = filterCity[0].city_id;
      return cityId;
    } else {
      alert("City not found in API response");
      return null;
    }
  } catch (err) {
    alert(e);
    return null;
  }
};

const getIdCityPenjual = async () => {
  try {
    const dataRegion = await fetch('https://api.rajaongkir.com/starter/province/?id=', {
      method: 'GET',
      headers: { key: 'c2c121c370d4e8d81c15514667ed23da' }
    });
    const data = await dataRegion.json();
    const dataResult = data.rajaongkir.results;
    const newIdCityPenjual = [];

    if (listDetail[0].length > 0) {
      const sellers = listDetail[0];
      for (let i = 0; i < sellers.length; i++) {
        const sellerRegion = sellers[i]?.detailToko?.address?.region;
        const filterProv = dataResult.filter((result) => result.province === sellerRegion);

        if (filterProv.length > 0) {
          const idProv = filterProv[0].province_id;

          const dataRegionCity = await fetch(`https://api.rajaongkir.com/starter/city?id=&province=${idProv}`, {
            method: 'GET',
            headers: { key: 'c2c121c370d4e8d81c15514667ed23da' }
          });
          const dataCity = await dataRegionCity.json();
          
          const dataResultCity = dataCity.rajaongkir.results;

          const sellerCity = sellers[i]?.detailToko?.address?.subregion.replace("Kota ", "");
          const filterCity = dataResultCity.filter((result) => result.city_name === sellerCity);

          if (filterCity.length > 0) {
            const cityId = filterCity[0].city_id;
            newIdCityPenjual.push(cityId);
          }
        }
      }
    }

    return newIdCityPenjual;
  } catch (err) {
    alert(e);
    return [];
  }
};

    
  const getOngkir = async (idCityPembeli, idCityPenjual) => {
    alert(idCityPembeli, idCityPenjual)
    const ongkirResults = [];
    if(idCityPembeli[0] != "" && getIdCityPenjual[0] != ""){
    for (const idPenjual of idCityPenjual) {
      try {
        const dataRegion = await fetch('https://api.rajaongkir.com/starter/cost', {
          method: 'POST',
          headers: {
            key: 'c2c121c370d4e8d81c15514667ed23da',
            'content-type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            origin: idPenjual,
            destination: idCityPembeli,
            weight: 1700,
            courier: 'jne',
          }).toString(),
        });
  
        const data = await dataRegion.json();
        
        
        // Assuming you want to save all ongkir results in the ongkirResults array
        if (data.rajaongkir.results.length > 0) {
          const ongkirResult = data.rajaongkir.results[0].costs[0];
          ongkirResults.push(ongkirResult);
        }
      } catch (e) {
        alert(e);
      }
    }
    setOngkir(ongkirResults)
  }
  };

  // get Distance
  const getDistanceA = async (index) => {
    // pembeli
    const startLat = dataPembeli[0]?.addressCord?.coords?.latitude;
    const startLon = dataPembeli[0]?.addressCord?.coords?.longitude;
  
    // penjual
    const endLat = listDetail[0][index]?.detailToko?.addressCord?.coords?.latitude;
    const endLon = listDetail[0][index]?.detailToko?.addressCord?.coords?.longitude;
  
    const apiKey = '5b3ce3597851110001cf6248bd0768f706814962a1fe5e4b91769469';
    const getDistance = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startLon},${startLat}&end=${endLon},${endLat}`)
      .then(response => response.json())
      .then(data => {
        const distanceInKm = (data.features[0].properties.segments[0].distance / 1000).toFixed(1);
        return parseFloat(distanceInKm); // Return the distance value as a number
      })
      .catch(error => {
        console.error(error);
        return null; // Return null in case of an error
      });
  
    return getDistance; // Return the promise for use in Promise.all
  };
  
  // Loop through the filter array and call getDistanceA for each item
  const calculateDistances = async () => {
    const ongkirArray = await Promise.all(listDetail[0]?.map((item, index) => getDistanceA(index)));
    setDistance(ongkirArray.filter(value => value !== null)); // Set the entire array of distances
    setOngkirD(ongkirArray.map(distance => {
      if (distance <= 5.0) {
        return "10000";
      } else if (distance <= 10.0) {
        return "15000";
      } else if (distance <= 15.0) {
        return "20000";
      } else {
        return "jauh";
      }
    })); // Set the ongkirD array based on distance values
  };

  const calculateTotalOngkir = () => {
    let totalOngkir = 0;
  
    ongkir.forEach((item, index) => {
      if (value[index] === 'one') {
        totalOngkir += item.cost[0].value;
      } else if (value[index] === 'two') {
        totalOngkir += ongkirD[index] === 'jauh' ? 0 : parseInt(ongkirD[index]);
      }
    });
  
    return totalOngkir;
  };
  
  const sumTotal = () => {
    const totalJne = calculateTotalOngkir()
    let total = 0;
    listDetail[0]?.forEach((item, outerIndex) => {
      item?.produk?.forEach((produkItem, innerIndex) => {
        const miliValue = miliProduk[outerIndex][innerIndex] || "1";
        const hargaProduk = miliValue === "1" ? produkItem.hargaProduk : produkItem[`hargaProduk${(miliValue-1)}`];
        const stokProduk = Number(stok[outerIndex][innerIndex]) || 0;
  
        total += hargaProduk * stokProduk;
      });
    });
    let totalK = total + totalJne
    return totalK;
  };

  const currentDate = new Date();
  const date = Timestamp.fromDate(currentDate);

  const flattenArray = (arr) => {
    return Array.isArray(arr) ? arr.flat() : arr;
  };
  
  const handleUpload = async () => {
    const stokValue = parseInt(stok);
    const flattenedMiliProduk = flattenArray(miliProduk);
    const flattenedStok = flattenArray(stok);
  
    if (stokValue >= 0) {
      const docRef = collection(db, 'pesanan');
      const totalOngkirList = [];
  

  
      for (let index = 0; index < listDetail[0].length; index++) {
        const miliArray = Array.isArray(miliProduk) ? miliProduk[index] : miliProduk; // Get the nested array for miliProduk
        const stokArray = Array.isArray(stok) ? stok[index] : stok; 
        
        const pivot = parseInt(flattenedMiliProduk[index]) - 1;
        const item = listDetail[0][index];
        const stokProduk  = pivot === 0 ? item.produk[0].stokProduk : pivot === 1 ? item.produk.stokProduk1 : item.produk.stokProduk2
        const selectedStokField = pivot === 0 ? 'stokProduk' : pivot === 1 ? 'stokProduk1' : 'stokProduk2';

        

        const pesananData = {
          idPesanan: 'P' + new Date().getTime(),
          userPembeli: uid,
          userToko:item.produk[0].userUid,
          produk: [], // Initialize an empty array to store the selected products
          detailDataPenjual:[],
          detailPembeli: dataPembeli[0],
          jasaDataOngkir: [],
          totalDataOngkir: [], 
          totalOngkir: sumTotal(),
          isCancel: false,
          isCancel1: false,
          isConfirm: false,
          isConfirm1: false,
          isDone: false,
          resi: '',
          namaAntar: '',
          noAntar: '',
          imgValid: fotoProduk,
          detailAlamat: detailAlamat,
          TglPembelian: date,
        };

        const detailDataPenjual = {
          detailPenjual : {...item}
        }
        const jasaDataOngkir = {
          jasaOngkir : value[index]
        }
       


        for (let i = 0; i < item.produk.length; i++) {
          const selectedStokField = pivot === 0 ? 'stokProduk' : pivot === 1 ? 'stokProduk1' : 'stokProduk2';
          const stokProduk = item.produk[i][selectedStokField];
          if (flattenedStok[index] >= 0 && flattenedStok[index] <= stokProduk ) {
            const stokUpdate = selectedStok - flattenedStok[index];
            const hargaProduk = item?.produk[`hargaProduk${pivot === 0 ? '' : pivot + 1}`];
            
        
            let selectedStok; // Declare selectedStok outside the loop
            const hargaPerProduk = []
        
            for (let i = 0; i < miliArray.length; i++) {
              const pivotInner = parseInt(miliArray[i]) - 1;
              const selectedHarga = pivotInner === 0 ? 'hargaProduk' : pivotInner === 1 ? 'hargaProduk1' : 'hargaProduk2';
              const hargaProdukInner = item.produk[i][selectedHarga];
              hargaPerProduk.push((parseInt(hargaProdukInner) * flattenedStok[index]) + (value[i] === 'one' ? parseInt(ongkir[index]?.cost[0]?.value) : parseInt(ongkirD[index])))
              const jasaTotalOngkir = {
                hargaOngkir : hargaPerProduk[i]
            }
              if (hargaPerProduk[i] !== undefined) {
                pesananData.totalDataOngkir.push(jasaTotalOngkir);
              }
            }
            
            const produkData = {
              stokBeli: stokArray[i],
              miliBeli: miliArray[i],
            };

            pesananData.produk.push(produkData);

            if (item?.produk[i]?.idProduk) { // Check if the idProduk property is defined
                  const updateUser = doc(db, 'produk', `${item?.produk[i]?.idProduk}`);
                  await updateDoc(updateUser, { [selectedStokField]: stokUpdate });
                }
                
        
          } else {
            alert(`Stok pada item ke-${index + 1} tidak mencukupi`);
            return; // Exit the function if any stok is insufficient
          }
        }
        const detailDataPenjualCopy = { ...detailDataPenjual };
        pesananData.jasaDataOngkir.push(jasaDataOngkir)
        pesananData.detailDataPenjual.push(detailDataPenjualCopy);
        const pesananDataCopy = { ...pesananData };
        pesananDataCopy.detailDataPenjual = [ ...pesananData.detailDataPenjual ];
        if (
          pesananData.detailDataPenjual &&
          pesananData.detailDataPenjual.length > 0 &&
          pesananData.detailDataPenjual[0] &&
          typeof pesananData.detailDataPenjual[0].detailPenjual.idWishlist === 'undefined'
        ) {
          pesananData.detailDataPenjual[0].detailPenjual.idWishlist = null;
        }
        
        await setDoc(doc(docRef, `${pesananDataCopy.idPesanan}`), pesananData)
        .then(() => {alert(`loading upload file ke-${index + 1}`)
        
  
      })
      .then(() => { alert(`loading upload file ke-${index + 1}`);
      ;})
        .catch((e) => {alert(e)})
        pesananData.produk = [];
        pesananData.detailDataPenjual = [];
        pesananData.jasaDataOngkir = []; 
      }
      
  
     // Calculate totalOngkir for all products
  
      // Rest of the code after the loop
      alert('Produk Berhasil DiBeli ;)');
      navigation.navigate('PesananGoogle');
    } else {
      alert('Stok ada yang salah');
    }
  };
  
 
  
  const handleReloadOngkir = () => {
    // Fetch the ongkir values again
    alert(`${JSON.stringify(idCityPenjual)}`)
    fetchData();
  };

  const handleMiliChange = (outerIndex, miliValue, innerIndex) => {
    setMiliProduk((prevMiliProduk) => {
      const newMiliProduk = [...prevMiliProduk];
      if (Array.isArray(newMiliProduk[outerIndex])) {
        newMiliProduk[outerIndex][innerIndex] = miliValue;
      } else {
        newMiliProduk[outerIndex] = miliValue;
      }
      return newMiliProduk;
    });
  };

  const handleStokChange = (outerIndex, stokValue, innerIndex) => {
    setStok((prevStok) => {
      const newStok = [...prevStok];
      if (Array.isArray(newStok[outerIndex])) {
        newStok[outerIndex][innerIndex] = stokValue;
      } else {
        newStok[outerIndex] = stokValue;
      }
      return newStok;
    });
  };
  return (
    <NativeBaseProvider>
    <SafeAreaView>
    <ScrollView>
      <Box p={4}>
        <Box backgroundColor="white" p={4} mt="3" rounded="md">
          <Text bold>Alamat Tujuan:</Text>
          <Text fontSize="xs">{dataPembeli[0]?.address?.city}, { dataPembeli[0]?.address?.district}, { dataPembeli[0]?.address?.street}, { dataPembeli[0]?.address?.region}, 
          kode post: {dataPembeli[0]?.address?.postalCode}</Text>
        </Box>
        <Box backgroundColor="white" p={4} mt="3" rounded="md">
          <Text bold>Detail Alamat:</Text>
          <Input 
          placeholder="No 8 Perum Sentosa"
          size="sm"
          value={detailAlamat}
          onChangeText= {text => setDetailAlamat(text)} />
        </Box>

        {listDetail[0]?.map((item, outerIndex) => (
        <Box key={outerIndex} backgroundColor="white" p={4} mt="3" rounded="md">
          <Text fontWeight="bold" mb="1">
            {item?.detailToko?.namaToko}
          </Text>
          {item?.produk?.map((produkItem, innerIndex) => (
            <Box key={innerIndex}>
              <Stack direction="row">
                <Box>
                  <Image
                    src={produkItem?.imgProduk}
                    width="70px"
                    height="70px"
                    alt="image produk"
                    rounded="md"
                  />
                </Box>
                <Box alignSelf="center" mx="4">
                  <Text>{produkItem?.namaProduk}</Text>
                  <Text fontWeight="bold" fontSize="lg">
                    RP{" "}
                    {miliProduk[outerIndex][innerIndex] - 1 > 0
                      ? produkItem[`hargaProduk${(miliProduk[outerIndex][innerIndex] - 1)}`]
                      : produkItem?.hargaProduk}
                  </Text>
                  <Text>
                    Stok:{" "}
                    {miliProduk[outerIndex][innerIndex] - 1 > 0
                      ? produkItem[`stokProduk${(miliProduk[outerIndex][innerIndex] - 1)}`]
                      : produkItem?.stokProduk}
                  </Text>
                </Box>
              </Stack>

              <Box backgroundColor="white" p={4} mt="3" rounded="md">
                <FormControl>
                  <FormControl.Label>Pilih Mili</FormControl.Label>
                  <Radio.Group
                    name={`exampleGroup-${outerIndex}-${innerIndex}`}
                    accessibilityLabel="pick a size"
                    value={Array.isArray(miliProduk[outerIndex]) ? miliProduk[outerIndex][innerIndex] || "1" : miliProduk[outerIndex] || "1"}
                    onChange={(nextValue) => handleMiliChange(outerIndex, nextValue, innerIndex)}
                  >
                    <Stack
                      direction={{
                        base: "column",
                        md: "row"
                      }}
                      alignItems={{
                        base: "flex-start",
                      }}
                      space={4}
                      w="75%"
                      maxW="300px"
                    >
                      <Radio value="1" colorScheme="yellow" size="sm" my={1}>
                        {produkItem?.miliProduk}|mili
                      </Radio>
                      <Radio value="2" colorScheme="yellow" size="sm" my={1}>
                        {produkItem?.miliProduk1}|mili
                      </Radio>
                      <Radio value="3" colorScheme="yellow" size="sm" my={1}>
                        {produkItem?.miliProduk2}|mili
                      </Radio>
                    </Stack>
                  </Radio.Group>
                </FormControl>
              </Box>

              <Box backgroundColor="white" p={4} mt="3" rounded="md">
                <Center>
                  Produk terpilih:{" "}
                  {miliProduk[outerIndex][innerIndex] - 1 > 0
                    ? produkItem[`miliProduk${(miliProduk[outerIndex][innerIndex] - 1)}`]
                    : produkItem?.miliProduk}{" "}
                  mil
                </Center>
                <FormControl>
                  <FormControl.Label>Stok</FormControl.Label>
                  <Input
                    placeholder=""
                    keyboardType="numeric"
                    type="text"
                    value={Array.isArray(stok[outerIndex]) ? stok[outerIndex][innerIndex] || "" : stok[outerIndex] || ""}
                    onChangeText={(text) => handleStokChange(outerIndex, text, innerIndex)}
                  />
                </FormControl>
              </Box>
            </Box>
          ))}
        </Box>
      ))}

        
      {ongkir.map((ongkirData, index) => (
  <React.Fragment key={index}>
    {distance[index] <= 15 ? (
      <Box key={index}>
      <Radio.Group
          name="myRadioGroup"
          accessibilityLabel="favorite number"
          value={value[index]}
          onChange={(nextValue) => {
            const updatedValue = [...value];
            updatedValue[index] = nextValue;
            setValue(updatedValue);
          }}
        >
          <Radio value="one" my={1} colorScheme="yellow">
            <Box backgroundColor="white" p={4} mt="3" rounded="md">
            <Text bold> Jarak Toko dan Pembeli</Text>
            {distance.map((data, index) => (
                  <Text key={index}>Toko{index+1} :{data} KM</Text>
              ))}
              <Text bold> Pengiriman</Text>
              <Text> Ekspedisi : <Text bold> JNE</Text></Text>
              <Text> Estimasi : <Text bold> {ongkirData.cost[0].etd} Hari</Text></Text>
              <Text bold fontSize="lg"> Rp. {ongkirData.cost[0].value}</Text>
            </Box>
          </Radio>
          <Radio value="two" my={1} colorScheme="yellow">
            <Box backgroundColor="white" p={4} mt="3" rounded="md">
              <Text> Dibawah 10 KM</Text>
              <Text> Jarak : <Text bold> {distance[index]} KM</Text></Text>
              <Text bold fontSize="lg"> RP. {ongkirD[index]}</Text>
            </Box>
          </Radio>
        </Radio.Group>
      </Box>
    ) : (
      <Box key={index} backgroundColor="white" p={4} mt="3" rounded="md">
        <Text bold> Pengiriman</Text>
        <Text> Ekspedisi : <Text bold> JNE</Text></Text>
        <Text> Estimasi : <Text bold> {ongkirData.cost[0].etd} Hari</Text></Text>
        <Text bold fontSize="lg"> Rp. {ongkirData.cost[0].value}</Text>
      </Box>
    )}
  </React.Fragment>
))}


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
        <Button size="sm" colorScheme="yellow" onPress={handleReloadOngkir}>Reload Ongkir</Button>
        </Box>
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

export default FormPembelianGoogle;