
import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { auth, db} from "../../../firebase";
import { collection,  where,doc,getDoc, deleteDoc, onSnapshot, query, addDoc, orderBy, limit  } from "firebase/firestore";
import { useIsFocused } from '@react-navigation/native';

const ChatPenjual = ({route, navigation}) => {
    const [messages, setMessages] = useState([]);
    const [dataUser, setDataUser] = useState([null])
    const {listDetail} = route.params
    const focus = useIsFocused()
    console.log(listDetail)
    useEffect(() =>{
        if (focus == true){
            const chatRef = collection(db, `chat/${listDetail.userPenjual}_${listDetail.userToko}/chats`);
            const queryRef = query(chatRef, orderBy('createdAt', 'desc'));
            const unsubscribe = onSnapshot(queryRef, (snapshot) => {
            const newMessages = snapshot.docs.map((doc) => {
                const message = doc.data();
                return {
                _id: doc.id,
                text: message.text,
                createdAt: message.createdAt.toDate(),
                user: {
                    _id: message.user._id,
                    name: message.user.name,
                },
                };
            });
            setMessages(newMessages);
            });

            return () => {
            unsubscribe();
            };
        }
    },[listDetail.userPenjual, listDetail.userToko])

      console.log("id saatini",auth.currentUser.uid)

      const onSend = async (newMessages) => {
        const text = newMessages[0].text;
        const chatRef = collection(db, `chat/${listDetail.userPenjual}_${listDetail.userToko}/chats`);
        const message = addDoc(chatRef,{
          text,
          createdAt: new Date(),
          user: {
            _id: listDetail.userToko,
            name: listDetail.namaToko,
          },
        })
    
        
        message;
      };
    
    console.log("isinya", messages)
    

  return (
    <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
            _id: auth?.currentUser?.uid,
        }}
    />
  )
}

export default ChatPenjual