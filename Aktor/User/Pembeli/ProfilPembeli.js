import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { auth, db} from "../../../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc} from "firebase/firestore";
import { Center, ScrollView, Box, NativeBaseProvider, FormControl, Input, Divider, 
  Button, TextArea, Checkbox, HStack, Text } from 'native-base'
import * as Location from 'expo-location';
import { useIsFocused } from '@react-navigation/native';

// Icons/Images
import { AntDesign } from '@expo/vector-icons';

const ProfilPembeli = ({navigation}) => {
  const [dataUser, setDataUser] = useState([null])
  const [nama, setNama] = useState("")
  // map
  const [location, setLocation] = useState(null);
  const [mapLocation, setMapLocation] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);

  const[isSiantar, setIsSiantar] = useState(false)

  const focus = useIsFocused()

  useEffect(() =>{
    if (focus == true){
      const docRef = doc(db, "user", auth.currentUser?.uid);
      const getData = async () =>{
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDataUser( docSnap.data())
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }
      dataUser && getData()
    }
  },[dataUser])

  const handleMap = async() =>{
    console.log("masuk handle map")
    let { status } = await Location.requestForegroundPermissionsAsync();
    console.log("isi status", status)
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log("isi status", location)
    setLocation(location);

    let dataLocation = await Location.reverseGeocodeAsync({
      longitude: location.coords.longitude,
      latitude: location.coords.latitude
    })

    console.log("isi status", dataLocation)
    
    setMapLocation(dataLocation)
  }


  let mapData = 'Waiting..';
  if (errorMsg) {
      mapData = errorMsg;
    } else if (location) {
      mapData = JSON.stringify(mapLocation);
    }
  
  const handleUpdate = async() =>{
    console.log("masuk")
    const updateUser = doc(db, "user",`${auth.currentUser?.uid}`)
    await updateDoc(updateUser, {
        nama:nama,
        isSiantar : isSiantar,
        addressCord: location,
        address: mapLocation[0]
      }).catch((err) => alert(err))
      alert("sudah terupdate")
  }

  const handlePenjual = async () =>{
    const updateUser = doc(db, "user",`${auth.currentUser?.uid}`)
    await updateDoc(updateUser, {
      seller: true
    })
    .then(() =>{navigation.navigate('Penjual')})
    .catch((err) => alert(err))
    
  }

  const handleLogOut = () =>{
    signOut(auth).then(() => {
      navigation.navigate('Login')
    }).catch((error) => {
      alert(err)
    })
  }

  return (
    <NativeBaseProvider>
    <SafeAreaView>
      <ScrollView>
      <Box alignItems="flex-end">
        <Button size="sm" colorScheme="green" mt="3" onPress={handlePenjual}>Penjual</Button>
        </Box>
      <Box backgroundColor="white" mt="4" mx="3" p="4" rounded="md">
          <Box>
          <Center mt="4">
          <AntDesign name="user" size={50} color="black" />
          </Center>
          </Box>
          {/* Data Diri */}
          <Box>
            <FormControl>
              <FormControl.Label>Nama</FormControl.Label>
              {dataUser.nama === ""
              ?<Input placeholder='Nama masih kosong' 
                  value={nama}
                  onChangeText= {text => setNama(text)}
              />
              :<Input placeholder={dataUser.nama}
                   value={nama}
                  onChangeText= {text => setNama(text)} />
              }
              
            </FormControl>
            <Divider />
            <FormControl>
              <FormControl.Label>No Handphone</FormControl.Label>
              <Input placeholder={dataUser.noHp} />
            </FormControl>
            <Divider />
            <FormControl isDisabled>
              <FormControl.Label>Email</FormControl.Label>
              <Input placeholder={dataUser.emailId}/>
            </FormControl>
            <Divider />
            <FormControl>
              <FormControl.Label>Alamat</FormControl.Label>
              <Button size="sm" variant="subtle" colorScheme="yellow" mb="2" onPress={handleMap}>
                Open Map
              </Button>
              {dataUser.address === ""
              ?
              <TextArea aria-label="t1Disabled" 
               placeholder={`${mapLocation[0]?.district}, ${mapLocation[0]?.street}, ${mapLocation[0]?.city},${mapLocation[0]?.subregion}, ${mapLocation[0]?.country}`} 

              isDisabled />
              :<TextArea aria-label="t1Disabled" isDisabled
              placeholder={`${dataUser?.address?.city}, ${dataUser?.address?.district}, ${dataUser?.address?.street}, ${dataUser?.address?.subregion}, ${dataUser?.address?.country}`} 
              />
              }
            
            </FormControl>
            <HStack mt="3">
              <Text >Pemantan Siantar?</Text>
              <Box py="1" mx="2">
              <Checkbox value="true" accessibilityLabel="isPemantangSiantar" onChange={(e) => {
              if(isSiantar) {setIsSiantar(false)}
              else{setIsSiantar(true)}
              }}/>
              </Box>
            </HStack>
            
          </Box>
          <Button size="sm" colorScheme="yellow" mt="3" onPress={handleUpdate}>Update Profil</Button>
        </Box>
        <Box alignItems="center">
        <Button size="sm" colorScheme="red" my="3" onPress={handleLogOut}>Log Out</Button>
        </Box>
        

      </ScrollView>
    </SafeAreaView>
    </NativeBaseProvider>
  )
}

export default ProfilPembeli