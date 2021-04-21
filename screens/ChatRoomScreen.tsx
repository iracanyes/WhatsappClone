/**
 * Description: Chat Room Screen
 */
import * as React from "react";
import {
    FlatList,
    ImageBackground ,
    StyleSheet,
} from "react-native";
import { Text, View, } from "../components/Themed";
import { useRoute } from "@react-navigation/native";
import BG from "../assets/images/BG.png";
import ChatMessage from "../components/ChatMessage";
import InputBox from "../components/InputBox";
import {useEffect, useState} from "react";
import {API, Auth, graphqlOperation} from "aws-amplify";
import {Message} from "../types";
import {listMessagesCustom} from "../graphql/customQueries.js";
import {messagesByChatRoom} from "../graphql/queries.js";
import { onCreateMessage } from "../graphql/customQueries.js";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    backgroundImage: {
        width: "100%",
        height: "100%",
        justifyContent: 'flex-end',

        //alignItems: 'flex-end',
        //position: 'relative'
    },
    flatlist: {
        flex: 1
    },
    inputBox: {
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});

interface RouteParams {
    id: string,
    name: string
}

const ChatRoomScreen = () => {

    const [messages, setMessages] = useState<Message[]>([]);
    // Get Route parameters
    const route = useRoute();
    const { params }  = route;
    const [ userId, setUserId ] = useState("");

    const fetchChatRoomMessages = async () => {
        if(params) {
            // messagesByChatRoom is the query field defined in our graphql schema
            // for messages indexed by chatRoomId and createdAt property
            // the query is created automatically
            const response = await API.graphql(graphqlOperation(
              messagesByChatRoom,
              {
                  chatRoomID: params.id,
                  sortDirection: 'DESC'
              }
            ));

            if(response.data.messagesByChatRoom.items){
                setMessages(response.data.messagesByChatRoom.items);
            }
        }



    };
    // Fetch ChatRoom and messages
    useEffect(() => {

        // Appel de la fonction
        fetchChatRoomMessages();
    }, []);

    // Fetch connected user
    useEffect(() => {
        const fetchUserInfo = async () => {
            const userInfo = await Auth.currentAuthenticatedUser();
            if(userInfo){
                setUserId(userInfo.attributes.sub);
            }
        };

        fetchUserInfo();
    }, []);

    // Subscribe to createMessageEvent at the first opening of the chatRoom and unsubscribe at route change
    useEffect(() => {
        const subscription = API
          .graphql(graphqlOperation(onCreateMessage, {chatRoomID: params.id }))
          .subscribe({
              next: (data) => {
                  console.log(data.value.data);
                  const newMessage= data.value.data.onCreateMessage;
                  // Si le message n'appartient pas à cette chatRoom alors il n'est pas traité
                  if(newMessage.chatRoomID !== route.params.id) return;

                  fetchChatRoomMessages();
                  //setMessages([...messages, newMessage]);
              }
          });
        // Returning a function in a useEffect, will cause this function to be triggered at the unmount of the component
        // Here, unsubscribe to onCreateMessage
        return () => subscription.unsubscribe();
    }, [])

    return (
        <View
          style={styles.container}
        >
            <ImageBackground source={BG} style={styles.backgroundImage}>
                {messages.length !== 0 && (
                  <FlatList
                    style={styles.flatlist}
                    // inverted list
                    inverted={true}
                    data={messages}
                    renderItem={ ({ item }) => <ChatMessage message={ item } userId={userId} />}
                  />
                )}

                {params && ('id' in params) && (
                  <InputBox
                    style={styles.inputBox}
                    chatRoomID={params.id}
                  />
                )}

            </ImageBackground>

        </View>
    );
}

export default ChatRoomScreen;
