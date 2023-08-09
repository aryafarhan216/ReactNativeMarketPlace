import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { db} from "../../../firebase";
import { doc, getDoc, updateDoc} from "firebase/firestore";
import { Center, ScrollView, Box, NativeBaseProvider, FormControl, Input, Divider, Select, CheckIcon,
  Button, TextArea, Checkbox, HStack, Text } from 'native-base'
import * as Location from 'expo-location';
import { useIsFocused } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// Icons/Images
import { AntDesign } from '@expo/vector-icons';

const ProfilPembeliGoogle = ({navigation}) => {
  const [dataUser, setDataUser] = useState([null])
  const [nama, setNama] = useState("")
  const [hp, setHp] = useState("")
  const [rek, setRek] = useState("");
  const [atasNama, setAtasNama] = useState("");
  const [service, setService] = useState("");
  // map
  const [location, setLocation] = useState(null);
  const [mapLocation, setMapLocation] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);

  const[isSiantar, setIsSiantar] = useState(false)

  const focus = useIsFocused()

  useEffect(() =>{
    if (focus == true){
      const docRef = doc(db, "user", auth().currentUser?.uid);
      const getData = async () =>{
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDataUser( docSnap.data())
        } else {
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
    
    setMapLocation(dataLocation)
    alert("Map sudah update")
  }


  let mapData = 'Waiting..';
  if (errorMsg) {
      mapData = errorMsg;
    } else if (location) {
      mapData = JSON.stringify(mapLocation);
    }
  
  const handleUpdate = async() =>{
    console.log("masuk")
    let uid = auth().currentUser?.uid
    const updateUser = doc(db, "user",`${uid}`)
    await updateDoc(updateUser, {
        nama:nama,
        noHp:hp,
        isSiantar : isSiantar,
        addressCord: location,
        rekening : service,
        noRekening : rek,
        atasNama: atasNama,
        address: mapLocation[0]
      }).catch((err) => alert(err))
      alert("sudah terupdate")
  }
  GoogleSignin.configure({
    webClientId: '676594783389-1tm54n58tiktprt27m5c234qf0th3hl2.apps.googleusercontent.com',
  });
  const handleLogOut = async () =>{
      await GoogleSignin.revokeAccess();
      await auth().signOut();
      navigation.navigate('Login')
    
  }

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
              <FormControl.Label>Nama</FormControl.Label>
              {dataUser?.nama === ""
              ?<Input placeholder='Nama masih kosong' 
                  value={nama}
                  onChangeText= {text => setNama(text)}
              />
              :<Input placeholder={dataUser?.nama}
                   value={nama}
                  onChangeText= {text => setNama(text)} />
              }
              
            </FormControl>
            <Divider />
            <FormControl>
              <FormControl.Label>No Handphone</FormControl.Label>
              {dataUser?.noHp === ""
              ? <Input keyboardType="numeric"
                placeholder={dataUser?.noHp}
                value={hp}
                onChangeText= {text => setHp(text)}
            />
              : <Input keyboardType="numeric"
                placeholder="081234567890"
                value={hp}
                onChangeText= {text => setHp(text)}
            />
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
                {dataUser?.noRekening === "" 
                ?
                <Input keyboardType="numeric"
                placeholder=""
                value={rek}
                onChangeText= {text => setRek(text)}
                />
                :
                <Input keyboardType="numeric"
                placeholder={dataUser?.noRekening}
                value={rek}
                onChangeText= {text => setRek(text)}/>
                }
        </FormControl>
        <FormControl >
        <FormControl.Label >Atas Nama </FormControl.Label>
        { dataUser?.atasNama === ""
        ?
        <Input 
                placeholder=""
                value={atasNama}
                onChangeText= {text => setAtasNama(text)}
              />
        :
        <Input 
                placeholder={dataUser?.atasNama}
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

export default ProfilPembeliGoogle