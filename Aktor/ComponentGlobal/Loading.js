import { View, Text } from 'react-native'
import React, {useEffect, useState} from 'react'
import { Box, Center, NativeBaseProvider } from 'native-base'
import { SafeAreaView } from 'react-native-safe-area-context'
import { auth, db} from "../../firebase";
import { doc, getDoc} from "firebase/firestore";
import { useIsFocused } from '@react-navigation/native';

const Loading = ({navigation}) => {
    const [dataUser, setDataUser] = useState([null])
    const focus = useIsFocused()

    useEffect(() =>{
      if (focus == true){
        // navigation.navigate("Login")
        const docRef = doc(db, "user", auth.currentUser?.uid);
        const getData = async () =>{
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setDataUser(docSnap.data())
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        }
        dataUser && getData()
      }
      const load = () =>{
            if(dataUser?.seller != true){
                navigation.navigate("User")
            }else{
                navigation.navigate("Penjual")
            }

      }

      dataUser && load()
    },[dataUser])

  return (
    <NativeBaseProvider>
    <SafeAreaView>
    <Center mt="5">
      <Text>Loading...</Text>
    </Center>
    </SafeAreaView>
    </NativeBaseProvider>
  )
}

export default Loading