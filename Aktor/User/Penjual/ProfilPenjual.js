import React, {useState, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Center, ScrollView, Box, NativeBaseProvider, FormControl, Input, Divider, 
  Button, Select, CheckIcon, TextArea, HStack, Text, Checkbox} from 'native-base'
import * as Location from 'expo-location';
// firebase
import { auth, db} from "../../../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc} from "firebase/firestore";
// Icons/Images
import { AntDesign } from '@expo/vector-icons';

const ProfilPenjual = ({route, navigation}) => {
  const[isSiantar, setIsSiantar] = useState(false)
  const [dataUser, setDataUser] = useState({})
  const [namaTokos, setNamaTokos] = useState('')
  const [nama, setNama] = useState('')
  const [service, setService] = useState("");
  const [rek, setRek] = useState("");
  const [atasNama, setAtasNama] = useState("");
    // map
  const [location, setLocation] = useState(null);
  const [mapLocation, setMapLocation] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() =>{
    const docRef = doc(db, "user", auth.currentUser?.uid);
    const getData = async () =>{
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDataUser( docSnap.data())
      } else {
        console.log("No such document!");
      }
    }
    getData()
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
    alert(`map sudah update`)
  }


  let mapData = 'Waiting..';
  if (errorMsg) {
      mapData = errorMsg;
    } else if (location) {
      mapData = JSON.stringify(mapLocation);
    }

  const handleLogOut = () =>{
    signOut(auth).then(() => {
      navigation.navigate('Login')
    }).catch((error) => {
      alert(err)
    })
  }

  const handleUpdate = async() =>{
    console.log(auth.currentUser?.uid)
    const updateUser = doc(db, "user",`${auth.currentUser?.uid}`)
    await updateDoc(updateUser, {
      nama : nama,
      namaToko: namaTokos,
      bank :{
        rekening : service,
        noRekening : rek,
        atasNama: atasNama
      },
      isSiantar : isSiantar,
      addressCord: location,
      address: mapLocation[0]
    })
    .catch((err) => alert(err))
    alert("Sudah Update")
  }
  console.log(isSiantar)
  return (
    <NativeBaseProvider>
    <SafeAreaView>
      <ScrollView>
      <Box backgroundColor="white" mt="4" mx="3" p="4" rounded="md">
          <Box>
          <Center mt="4">
          <AntDesign name="user" size={50} color="black" />
          </Center>
          </Box>
          {/* Data Diri */}
          <Box>            
          <FormControl>
              <FormControl.Label >Nama</FormControl.Label>
              {dataUser.namaToko === ""
              ?<Input placeholder='Nama masih kosong' 
                  value={nama}
                  onChangeText= {text => setNamaT(text)}
              />
              :<Input placeholder={dataUser.namaToko}
                  value={nama}
                  onChangeText= {text => setNama(text)} />
              }
            </FormControl>
            <FormControl>
              <FormControl.Label>Nama Toko</FormControl.Label>
              {dataUser.namaToko === ""
              ?<Input placeholder='Nama Toko masih kosong' 
                  value={namaTokos}
                  onChangeText= {text => setNamaTokos(text)}
              />
              :<Input placeholder={dataUser.namaToko}
                  value={namaTokos}
                  onChangeText= {text => setNamaTokos(text)} />
              }
            </FormControl>
            <FormControl>
                <FormControl.Label>Bank Digunakan </FormControl.Label>
                <Select selectedValue={service} minWidth="200" accessibilityLabel="Choose Your Zodiak" placeholder="Choose Service" _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />
              }} mt={1} onValueChange={itemValue => setService(itemValue)}>
                  <Select.Item label="BCA" value="BCA" />
                  <Select.Item label="Mandiri" value="Mandiri" />
                </Select>
                </FormControl>

                <FormControl>
                <FormControl.Label>No Rekening</FormControl.Label>
                {dataUser?.bank?.noRekening === "" 
                ?
                <Input keyboardType="numeric"
                placeholder=""
                value={rek}
                onChangeText= {text => setRek(text)}
                />
                :
                <Input keyboardType="numeric"
                placeholder={dataUser?.bank?.noRekening}
                value={rek}
                onChangeText= {text => setRek(text)}/>
                }
        </FormControl>
        <FormControl >
        <FormControl.Label >Atas Nama </FormControl.Label>
        { dataUser?.bank?.atasNama === ""
        ?
        <Input 
                placeholder=""
                value={atasNama}
                onChangeText= {text => setAtasNama(text)}
              />
        :
        <Input 
                placeholder={dataUser?.bank?.atasNama}
                value={atasNama}
                onChangeText= {text => setAtasNama(text)}
              />
        }
              
            
            </FormControl>
            <Divider mt="3"/>

            <FormControl isDisabled>
              <FormControl.Label >No Handphone</FormControl.Label>
              <Input placeholder={dataUser.noHp}/>
            </FormControl>
            <FormControl isDisabled>
              <FormControl.Label>Email</FormControl.Label>
              <Input placeholder={dataUser.emailId}/>
            </FormControl>
            <Divider mt="4"/>
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
            
            <Divider mt="2"/>
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

export default ProfilPenjual