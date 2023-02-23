import { View, Text } from 'react-native'
import React, {useState, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Center, ScrollView, Box, NativeBaseProvider, FormControl, Input, Divider, 
  Button, TextArea, Switch, HStack, Select, CheckIcon} from 'native-base'
// firebase
import { auth, db} from "../../../firebase";
import { doc, getDoc, updateDoc} from "firebase/firestore";
// Icons/Images
import { AntDesign } from '@expo/vector-icons';

const ProfilPenjual = ({route, navigation}) => {
  const [dataUser, setDataUser] = useState({})
  const [namaTokos, setNamaTokos] = useState('')
  const [service, setService] = useState("");
  const [rek, setRek] = useState("");
  const [atasNama, setAtasNama] = useState("");

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
  },[])


  const handleUpdate = async() =>{
    console.log(namaTokos)
    const updateUser = doc(db, "user",`${auth.currentUser?.uid}`)
    await updateDoc(updateUser, {
      namaToko: namaTokos,
      bank :{
        rekening : service,
        noRekening : rek,
        atasNama: atasNama
      }
    })
    .catch((err) => alert(err))
    alert("Sudah Update")
  }

  console.log(dataUser.bank)
  return (
    <NativeBaseProvider>
    <SafeAreaView>
      <ScrollView>
      <Box alignItems="flex-end">
        <Button size="sm" colorScheme="green" mt="3" onPress={()=> navigation.navigate('User')}>Pembeli</Button>
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
        <FormControl.Label >Atas Nama</FormControl.Label>
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
            <FormControl isDisabled>
              <FormControl.Label >Nama</FormControl.Label>
              <Input placeholder={dataUser.nama} />
            </FormControl>
            <FormControl isDisabled>
              <FormControl.Label >Nama</FormControl.Label>
              <Input placeholder={dataUser.nama} />
            </FormControl>
            <Divider />
            <FormControl isDisabled>
              <FormControl.Label >No Handphone</FormControl.Label>
              <Input placeholder={dataUser.noHp}/>
            </FormControl>
            <Divider />
            <FormControl isDisabled>
              <FormControl.Label>Email</FormControl.Label>
              <Input placeholder={dataUser.emailId}/>
            </FormControl>
            <Divider />
            {/* <FormControl>
              <FormControl.Label>Alamat</FormControl.Label>
            <TextArea aria-label="t1Disabled" 
            placeholder={`${dataUser.address.city}, ${dataUser.address.district}, ${dataUser.address.street}, ${dataUser.address.subregion}, ${dataUser.address.country}`} 
            isDisabled />
            </FormControl> */}
            <Divider />
          </Box>
          <Button size="sm" colorScheme="yellow" mt="3" onPress={handleUpdate}>Update Profil</Button>
        </Box>
        
      </ScrollView>
    </SafeAreaView>
    </NativeBaseProvider>
  )
}

export default ProfilPenjual