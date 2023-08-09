import React, { useState, useEffect} from 'react'
import { NativeBaseProvider, ScrollView, Box, FormControl, Text, Input,Image, Progress, TextArea, CheckIcon, Stack, Button,  Radio, Select, Center, VStack, HStack} from 'native-base'
import { SafeAreaView } from 'react-native-safe-area-context'
import { auth, db, storage} from "../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc } from "firebase/firestore"; 
import * as ImagePicker from "expo-image-picker/src/ImagePicker";

const AddProduk = ({route, navigation}) => {
  const [namaProduk, setNamaProduk] = useState("");
  const [descProduk, setDescProduk] = useState("");
  const [fotoProduk, setFotoProduk] = useState(null)
  const [image, setImage] = useState(null)

  const [perc, setPerc] = useState(null)
  // kategori
  const [umurProduk, setUmurProduk] = useState("");
  const [hargaProduk, setHargaProduk] = useState("");
  const [mili, setMili] = useState("");
  const [stokProduk, setStokProduk] = useState("");
  const [hargaProduk1, setHargaProduk1] = useState("");
  const [mili1, setMili1] = useState("");
  const [stokProduk1, setStokProduk1] = useState("");
  const [hargaProduk2, setHargaProduk2] = useState("");
  const [mili2, setMili2] = useState("");
  const [stokProduk2, setStokProduk2] = useState("");

  const [value, setValue] = useState("UNISEX");
  const [service, setService] = useState("Semua Zodiak");
  
  useEffect(() => {
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
      let name = "Foto_Produk/" + `${auth.currentUser?.uid}` + "|"+new Date().getTime()
      const storageRef = ref(storage, 'images/' + name);
      const uploadTask = uploadBytesResumable(storageRef, blob);
    // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        'state_changed',  
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          setPerc(progress)
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
  }, [image])
  
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);
    setImage(result.assets[0].uri)
  };
  const handleUpload = async() =>{
    if(fotoProduk != null && namaProduk != "" && stokProduk !=""){
      const idProduk = new Date().getTime()
      const docRef = collection(db, "produk")
      setDoc(doc(docRef, `${idProduk}`),{
        userUid : auth.currentUser?.uid,
        idProduk : idProduk,
        namaProduk : namaProduk,
        hargaProduk : hargaProduk,
        miliProduk : mili,
        stokProduk : stokProduk,
        hargaProduk1 : hargaProduk1,
        miliProduk1 : mili1,
        stokProduk1: stokProduk1,
        hargaProduk2 : hargaProduk2,
        miliProduk2 : mili2,
        stokProduk2 : stokProduk2,
        descProduk : descProduk,
        zodiak : service,
        jenisKelamin : value,
        umurProduk : umurProduk,
        imgProduk : fotoProduk
      }).then(() =>{
        alert("Produk Berhasil diUploud")
        setNamaProduk("")
        setHargaProduk("")
        setStokProduk("")
        setDescProduk("")
        setService("Semua Zodiak")
        setValue("UNISEX")
        setHargaProduk("")
        setUmurProduk("")
        setHargaProduk("")
        setStokProduk("")
        setMili("")
        setHargaProduk1("")
        setStokProduk1("")
        setMili1("")
        setHargaProduk2("")
        setStokProduk2("")
        setMili2("")
        setFotoProduk(null)
        setImage(null)
      }).catch((err) => alert(err));
    }else{
      alert("Form ada yang kosong")
    }
  }
  console.log(image)
  return (
    <NativeBaseProvider>
      <SafeAreaView>
        <ScrollView>
          <Box p="4">
              {/* Form add produk */}
              <Box backgroundColor="white" p={3}>
              <FormControl>
                <FormControl.Label>Nama Produk</FormControl.Label>
                <Input placeholder='Parfum Wangi'
                    type="text"
                    value={namaProduk}
                    onChangeText= {text => setNamaProduk(text)}
                 />
              </FormControl>
              <Box>
                <FormControl>
                  <FormControl.Label>Deskripsi Produk :</FormControl.Label>
                  <TextArea h={20} placeholder="Text Area Placeholder"  
                    type="text"
                    value={descProduk}
                    onChangeText= {text => setDescProduk(text)}
                  />
                </FormControl>
              </Box>
              <FormControl mt="4">
                <FormControl.Label>Kategori Produk :</FormControl.Label>
              </FormControl>
              <Box>

              {/* mili */}
              <HStack space={5}>
              <Box width="20%">
              <FormControl >
                <FormControl.Label>Harga</FormControl.Label>
                <Input  keyboardType='numeric' 
                    type="text"
                    value={hargaProduk}
                    onChangeText= {text => setHargaProduk(text)}
                />
              </FormControl>
              </Box>
              <Box width="20%">
              <FormControl >
                <FormControl.Label>Ukuran</FormControl.Label>
                <Input placeholder='\ml' keyboardType='numeric' 
                    type="text"
                    value={mili}
                    onChangeText= {text => setMili(text)}
                />
              </FormControl>
              </Box>
              <Box width="20%">
              <FormControl >
                <FormControl.Label>Stok</FormControl.Label>
                <Input  keyboardType='numeric' 
                    type="text"
                    value={stokProduk}
                    onChangeText= {text => setStokProduk(text)}
                />
              </FormControl>
              </Box>
              </HStack>

              <HStack space={5}>
              <Box width="20%">
              <FormControl >
                <FormControl.Label>Harga</FormControl.Label>
                <Input  keyboardType='numeric' 
                    type="text"
                    value={hargaProduk1}
                    onChangeText= {text => setHargaProduk1(text)}
                />
              </FormControl>
              </Box>
              <Box width="20%">
              <FormControl >
                <FormControl.Label>Ukuran</FormControl.Label>
                <Input placeholder='\ml' keyboardType='numeric' 
                    type="text"
                    value={mili1}
                    onChangeText= {text => setMili1(text)}
                />
              </FormControl>
              </Box>
              <Box width="20%">
              <FormControl >
                <FormControl.Label>Stok</FormControl.Label>
                <Input keyboardType='numeric' 
                    type="text"
                    value={stokProduk1}
                    onChangeText= {text => setStokProduk1(text)}
                />
              </FormControl>
              </Box>
              </HStack>
              <HStack space={5}>
              <Box width="20%">
              <FormControl >
                <FormControl.Label>Harga</FormControl.Label>
                <Input  keyboardType='numeric' 
                    type="text"
                    value={hargaProduk2}
                    onChangeText= {text => setHargaProduk2(text)}
                />
              </FormControl>
              </Box>
              <Box width="20%">
              <FormControl >
                <FormControl.Label>Ukuran</FormControl.Label>
                <Input placeholder='\ml' keyboardType='numeric' 
                    type="text"
                    value={mili2}
                    onChangeText= {text => setMili2(text)}
                />
              </FormControl>
              </Box>
              <Box width="20%">
              <FormControl >
                <FormControl.Label>Stok</FormControl.Label>
                <Input  keyboardType='numeric' 
                    type="text"
                    value={stokProduk2}
                    onChangeText= {text => setStokProduk2(text)}
                />
              </FormControl>
              </Box>
              </HStack>
              {/* End of mili */}
              
              <Box>
              <FormControl>
                <FormControl.Label>Zodiak </FormControl.Label>
                <Select selectedValue={service} minWidth="200" accessibilityLabel="Choose Your Zodiak" placeholder="Choose Service" _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />
              }} mt={1} onValueChange={itemValue => setService(itemValue)}>
                  <Select.Item label="All" value="All" />
                  <Select.Item label="Aquarius" value="Aquarius" />
                  <Select.Item label="Pisces" value="Pisces" />
                  <Select.Item label="Aries" value="Aries" />
                  <Select.Item label="Taurus" value="Taurus" />
                  <Select.Item label="Gemini" value="Gemini" />
                  <Select.Item label="Cancer" value="Cancer" />
                  <Select.Item label="Leo" value="Leo" />
                  <Select.Item label="Virgo" value="Virgo" />
                  <Select.Item label="Libra" value="Libra" />
                  <Select.Item label="Scorpio" value="Scorpio" />
                  <Select.Item label="Sagitarius" value="Sagitarius" />
                  <Select.Item label="Capricorn" value="Capricorn" />
                </Select>
                </FormControl>
              </Box>
              
              </Box>
              <Box width="20%">
              <FormControl >
                <FormControl.Label>Umur</FormControl.Label>
                <Input placeholder='20' keyboardType='numeric' 
                    type="text"
                    value={umurProduk}
                    onChangeText= {text => setUmurProduk(text)}
                />
              </FormControl>
              </Box>
              
              <Box> 
              <FormControl>
                <FormControl.Label>Jenis Kelamin</FormControl.Label>
                <Radio.Group name="myRadioGroup" accessibilityLabel="favorite number" value={value} onChange={nextValue => {
                  setValue(nextValue);
                }}>
              <Stack direction={{
                  base: "row",
                  md: "row"
                }} alignItems={{
                  base: "center",
                  md: "center"
                }} space={4} w="75%" maxW="300px">
                    <Radio value="UNISEX" colorScheme="yellow" size="sm" my={1}>
                      UNISEX
                    </Radio>
                    <Radio value="Male" colorScheme="yellow" size="sm" my={1}>
                      Male
                    </Radio>
                    <Radio value="Female" colorScheme="yellow" size="sm" my={1}>
                      Female
                    </Radio>
                  </Stack>
                </Radio.Group>
              </FormControl>
              </Box>
              {image && 
              
              <Center mt="3">
              <Progress colorScheme="emerald" value={perc} />
              <Text>Foto Produk</Text>
              <Image source={{ uri: image }} style={{ width: 200, height: 200 }} 
                alt="Foto produk"
              />
              </Center>
              }
              <FormControl mt="4">
                <FormControl.Label>Upload Produk</FormControl.Label>
                <Button size="sm" variant="subtle" colorScheme="yellow" onPress={pickImage}>
                  Upload Foto
                </Button>
              </FormControl>
              </Box>
              <Button mt="5" size="sm" colorScheme="green"
              disabled={ perc != null && perc < 100}
              onPress={handleUpload}
              >Add</Button>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </NativeBaseProvider>
  )
}

export default AddProduk