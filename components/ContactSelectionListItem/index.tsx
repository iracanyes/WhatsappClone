import * as React from "react";
import {Text, View, Image, TouchableWithoutFeedback} from "react-native";
import { DateTime } from "luxon";
import { useNavigation } from "@react-navigation/native";
import {ContactSelectionListItemProps, ChatRoom, User, ChatRoomUser} from "../../types";
import styles from "./styles";
import {API, Auth, graphqlOperation} from "aws-amplify";
import {useEffect, useState} from "react";
import {createChatRoom, createChatRoomUser} from "../../graphql/mutations.js";
import {getUserChatRooms} from "../../graphql/customQueries.js";

const ContactSelectionListItem = (props: ContactSelectionListItemProps) => {
  // Chatroom received from FlatList renderItem
  const { item, chatRooms, sharedObject }: ContactSelectionListItemProps = props;
  //console.log('item', item);
  // Identify the first participant of the chatroom
  const [ otherUser, setOtherUser ] = useState<User>({
    id: "",
    name: "???",
    imageUri: "https://www.fillmurray.com/500/500",
    status: "Nobody found!"
  });
  const navigation = useNavigation();

  // On mounting, identify the second user of the chatroom
  useEffect(() => {
    const getOtherUser = async () => {
      const authenticatedUser = await Auth.currentAuthenticatedUser();

      const getMyChatRooms = await API.graphql(graphqlOperation(
        getUserChatRooms,
        {
          id: authenticatedUser.attributes.sub
        }
      ));

      // @ts-ignore
      //console.log("getMyChatRooms response", getMyChatRooms.data.getUser);

      // @ts-ignore
      const myChatRooms =  getMyChatRooms.data.getUser.chatRoomUsers.items;


      if(item && ('chatRoomUsers' in item) && item.chatRoomUsers && ('items' in item.chatRoomUsers) && item.chatRoomUsers.items){
        if((item.chatRoomUsers.items[0].user.id === authenticatedUser.attributes.sub)){
          ('user' in item.chatRoomUsers.items[1]) && setOtherUser(item.chatRoomUsers.items[1].user);
        }else{
          setOtherUser(item.chatRoomUsers.items[0].user);
        }
      }

    };
    getOtherUser();
  }, []);

  // Readable date
  const dateFormat = (dateString : string): string => {
    if( dateString ){
      const dateObject = DateTime.fromISO(dateString);
      return dateObject.toRelativeCalendar() as string ;
    }

    return DateTime.now().toRelativeCalendar() as string ;

  };

  const onChatRoomClick = () => {
    //console.log("OtherUser", otherUser);
    //console.log("chatRoom", item);
    navigation.navigate(
      'ChatRoom',
      {
        id: item.id,
        name: otherUser.name,
        sharedObject: sharedObject
      }
    );
  };

  const onContactClick = async () => {
    //console.log('ContactSelectionListItem onContactClick chatRooms', chatRooms);
    try{
      let chatRoom: ChatRoom;
      // Get authenticated user
      const authenticatedUser = await Auth.currentAuthenticatedUser();

      if(chatRooms){
        // Search for an existing chatroom
        const chatRoomExist= chatRooms.filter(
          (element) => {
            if( element ) {
              if(element.chatRoomUsers.items.length === 2){
                return element.chatRoomUsers.items.filter((el: ChatRoomUser) => el.user.id === item.id).length > 0
              }
            }else{
              return;
            }
          }
        );

        //console.log('ContactSelectionListItem onContactClick chatRoomExist', chatRoomExist);
        chatRoom = chatRoomExist[0];
        // If ChatRoom doesn't exist
        if(chatRoomExist.length === 0){
          const response = await API.graphql(graphqlOperation(
            createChatRoom,
            {
              input: {}
            }
          ));

          // @ts-ignore
          chatRoom =  response.data.createChatRoom;

          // Create ChatroomUser
          const resultCreateChatRoom2 = await API.graphql(graphqlOperation(createChatRoomUser, {
            input: {
              userID: item.id,
              chatRoomID: chatRoom.id
            }
          }));

          if(!resultCreateChatRoom2){
            console.warn("Error while creating ChatroomUser");
            return;
          }
          // @ts-ignore
          //console.log("CreateChatRoomUser", resultCreateChatRoom2.data.createChatRoomUser);
          // @ts-ignore

          // Create ChatroomUser
          const resultCreateChatRoom1 = await API.graphql(graphqlOperation(createChatRoomUser, {
            input: {
              userID: authenticatedUser.attributes.sub,
              chatRoomID: chatRoom.id
            }
          }));

          if(!resultCreateChatRoom1){
            console.warn("Error while creating ChatroomUser");
            return;
          }
          // @ts-ignore
          //console.log("CreateChatRoomUser", response.data.createChatRoomUser);

        }

        if("name" in item){
          navigation.navigate(
            'ChatRoom',
            {
              id: chatRoom.id,
              name: item.name,
              sharedObject: sharedObject
            }

          );
        }

      }
    } catch (e) {
      console.warn('Error onContackClick pressed', e);
    }

  }

  return (
    <TouchableWithoutFeedback
      onPress={
        ('lastMessage' in item)
          ? onChatRoomClick
          : onContactClick
      }
    >
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          { 'imageUri' in item
              ? (<Image
                  source={{
                    uri: item.imageUri
                  }}
                  style={styles.avatar}
                />)
            : (<Image
                source={{
                  uri: otherUser.imageUri
                }}
                style={styles.avatar}
              />)

          }

        </View>

        <View  style={styles.rightContainer}>
          <View style={styles.rightTopContainer}>
            <Text style={styles.username}>
              { 'name' in item ? item.name : otherUser.name }
            </Text>
            {('lastMessage' in item) && item.lastMessage && ('createdAt' in item.lastMessage )
              &&  <Text style={styles.date}>
                    { dateFormat(item.lastMessage.createdAt) }
                  </Text>
            }
          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={styles.lastMessage}
          >
            {(item && 'lastMessage' in item)  && item.lastMessage
              ? item.lastMessage.content
              : "Hello from Whatsapp"
            }
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ContactSelectionListItem;
