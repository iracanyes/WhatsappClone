import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  SectionList
} from "react-native";
import {
  ChatRoom, ChatRoomUser,
  ContactSelectionProps, ContactSelectionSection,
  User
} from "../types";
import {
  useNavigation,
  useRoute
} from "@react-navigation/native";
import {
  API,
  Auth,
  graphqlOperation
} from "aws-amplify";
import {listUsers} from "../graphql/queries.js";
import {getUserChatRooms} from "../graphql/customQueries.js";
import ContactListItem from "../components/ContactListItem";
import ChatListItem from "../components/ChatListItem";
import ContactSelectionListItem from "../components/ContactSelectionListItem";

interface IData {
  title: string;
  type: string;
  data: User[]|ChatRoomUser[];
}

const ContactSelectionScreen = (props: ContactSelectionProps) => {
  const route = useRoute();
  const navigation = useNavigation();
  //@ts-ignore
  const sharedObject = route.params.sharedObject;
  // frequent contacts
  const [ frequentContacts, setFrequentContacts ] = useState<User[]>([]);
  // List of contacts
  const [ otherContacts, setOtherContacts ] = useState<User[]>([]);
  // Recent chatrooms
  const [ recentChatRooms, setRecentChatRooms ] = useState<ChatRoom[]>([]);
  // data by section
  const [data , setData] = useState<IData[]>(undefined);

  useEffect(() => {

    const fetchContactsSelection = async () => {
      try {
        // Get authenticated user
        const userInfo = await Auth.currentAuthenticatedUser();
        // Get Contacts
        const getUsers = await API.graphql(graphqlOperation(
          listUsers
        ));
        //@ts-ignore
        //console.log("getUsers", getUsers.data.listUsers.items);
        // @ts-ignore
        const users = getUsers.data.listUsers.items;

        setOtherContacts(users);

        // Get Chatrooms
        const getChatRooms = await API.graphql(graphqlOperation(
          getUserChatRooms,
          { id: userInfo.attributes.sub }
        ));
        // @ts-ignore
        //console.log('getChatRooms', getChatRooms);
        // @ts-ignore
        let chatRooms: ChatRoom[] = []
        // @ts-ignore
        getChatRooms.data.getUser.chatRoomUsers.items.map((el: ChatRoomUser) => {
          chatRooms.push(el.chatRoom);
        });
        setRecentChatRooms(chatRooms);

        setData([
          {
            title: "Récentes discussions",
            type: "chatRoom",
            data: chatRooms
          },
          {
            title: "Autres contacts",
            type: "user",
            data: users
          }
        ]);


      }catch (e) {
        console.warn("Error while retrieving contacts", e);
      }


    };

    // Fetch contacts and chatrooms
    fetchContactsSelection();
    // Set data per section

  }, []);



  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={data}
        style={styles.flatlist}
        renderItem={
          ({ item, index, section }) => (
            ('chatRoom' in item)
            ? <ContactSelectionListItem
                item={ item.chatRoom }
                index={ index }
                section={ section }
                chatRooms={recentChatRooms}
                sharedObject={ sharedObject }
              />
            : <ContactSelectionListItem
                item={ item }
                index={ index }
                section={ section }
                chatRooms={recentChatRooms}
                sharedObject={ sharedObject }
              />

          )
        }
        keyExtractor={(item,index) => item.id }
        renderSectionHeader={({ section: { title }}) => (
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        )}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10
  },
  flatlist: {
    flex: 1,
    width: '100%'
  },
  sectionHeaderContainer: {
    marginLeft: 10
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 10
  }
});

export default ContactSelectionScreen;
