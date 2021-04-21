import * as React from 'react';
import {Dimensions, FlatList, SafeAreaView, StyleSheet} from 'react-native';
import ChatListItem from "../components/ChatListItem";
import ChatRooms from "../data/ChatRooms";
import { Text, View } from '../components/Themed';
import NewMessageButton from "../components/NewMessageButton";
import {useEffect, useState} from "react";
import {API, Auth, graphqlOperation} from "aws-amplify";
import {getUserChatRooms} from "../graphql/customQueries.js";
import {ChatRoom} from "../types";

export default function ChatsScreen() {

  const [ chatRooms, setChatRooms ] = useState([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try{
        // Get authenticated user on AWS Cognito
        const authenticatedUser = await Auth.currentAuthenticatedUser({
          bypassCache: true
        });
        // Get his chatrooms from API
        const fetchChatRooms = await API.graphql(graphqlOperation(
          getUserChatRooms,
          { id: authenticatedUser.attributes.sub }
        ));

        const chatRooms = fetchChatRooms.data.getUser.chatRoomUsers.items;
        //console.log('chatRooms', chatRooms);
        setChatRooms(chatRooms);

      } catch (e){
        console.warn("Error while retrieving the chatrooms", e);
      }

    };

    fetchChatRooms();
  }, [chatRooms]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={chatRooms}
        style={styles.flatlist}
        // Render template for each item
        renderItem={({ item }) => (<ChatListItem chatRoom={item.chatRoom } />)}
        // Key extractor for identifying each item
        keyExtractor={ ( item ) => item.chatRoom.id ? item.chatRoom.id : "null" }
      />
      <NewMessageButton />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: "relative"
  },
  flatlist: {
    flex: 1,
    width: '100%'
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
