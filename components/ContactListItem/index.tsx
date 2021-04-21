import React from "react";
import {
  Text,
  View,
  Image,
  TouchableWithoutFeedback
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {User, ContactListItemProps, ChatRoom, ChatRoomUser} from "../../types";
import styles from "./styles";
import {
  API,
  Auth,
  graphqlOperation,
} from "aws-amplify";
import {
  createChatRoom,
  createChatRoomUser,
} from "../../graphql/mutations.js";
import {
  getUserChatRooms,
} from "../../graphql/customQueries.js";
import createChatRoomUserAction from "../../actions/chatRoomUser/createChatRoomUserAction";
import createChatRoomAction from "../../actions/chatRoom/createChatRoomAction";
import getUserChatRoomsAction from "../../actions/chatRoom/getUserChatRoomsAction";

const ContactListItem = (props: ContactListItemProps) => {
  const { user } = props;
  const navigation = useNavigation();

  const registerNewChatRoomUser = async (chatRoomID: string, userID: string) => {
    try{
      // Create ChatroomUser
      const response = await API.graphql(graphqlOperation(createChatRoomUser, {
        input: {
          userID: userID,
          chatRoomID: chatRoomID
        }
      }));

      if(!response){
        console.warn("Error while creating ChatroomUser");
        return;
      }

      //console.log("CreateChatRoomUser", response.data.createChatRoomUser);
      // @ts-ignore
      return response.data.createChatRoomUser;
    }catch (e) {
      console.warn("CreateChatroomUser response error", e);
    }


  };

  const onClick = async () => {
    try{
      // Exercise
      // Verify that no chatroom between the 2 users exists before creating one
      // Get authenticated user
      let chatRoom: ChatRoom|undefined = undefined;
      const userInfo = await Auth.currentAuthenticatedUser({ bypassCache: true });

      const getMyChatRooms = await API.graphql(graphqlOperation(
        getUserChatRooms,
        {
          id: userInfo.attributes.sub
        }
      ));

      // @ts-ignore
      //console.log("getMyChatRooms response", getMyChatRooms.data.getUser);

      // @ts-ignore
      const myChatRooms = getMyChatRooms.data.getUser.chatRoomUsers.items;

      const chatRoomExist = myChatRooms.filter(
        (element: ChatRoomUser) => {
          return element.chatRoom.chatRoomUsers.items.length === 2 && element.chatRoom.chatRoomUsers.items.filter((el: ChatRoomUser) => el.user.id === user.id).length > 0
        }
      );

      if(chatRoomExist.length > 0){
        chatRoom = chatRoomExist[0].chatRoom;
      }

      //console.log("my private ChatRoom ", chatRoom);

      if(!chatRoom){
        // Create a new Chatroom
        // Chatroom has only an auto-generated ID so no variables needed to create it
        // lastMessageID is required for creating a chatroom so give a dummy ID
        const response = await API.graphql(graphqlOperation(
          createChatRoom,
          {
            input: {
              lastMessageID: "f123dedf-61b1-412b-94d0-cdf186b76009"
            }
          }
        ));

        // @ts-ignore
        chatRoom = response.data.createChatRoom;

        if(chatRoom){
          // Add the user to the chatroom
          // Chatroom is directely associated to the chatroomUser
          const response = await API.graphql(graphqlOperation(createChatRoomUser, {
            input: {
              userID: user.id,
              chatRoomID: chatRoom.id
            }
          }));

          if(!response){
            console.warn("Error while creating ChatroomUser");
            return;
          }
          // @ts-ignore
          //console.log("CreateChatRoomUser", response.data.createChatRoomUser);
          // @ts-ignore
          const chatRoomUser1 = response.data.createChatRoomUser;

          // Add authenticated user to the chatroom
          // Chatroom is directely associated to the chatroomUser
          if(userInfo){
            const response = await API.graphql(graphqlOperation(createChatRoomUser, {
              input: {
                userID: userInfo.attributes.sub,
                chatRoomID: chatRoom.id
              }
            }));

            if(!response){
              console.warn("Error while creating ChatroomUser");
              return;
            }
            // @ts-ignore
            //console.log("CreateChatRoomUser", response.data.createChatRoomUser);
            // @ts-ignore
            const chatRoomUser2 = response.data.createChatRoomUser;

          }

        }



      }

      if(chatRoom){
        navigation.navigate(
          'ChatRoom',
          {
            id: chatRoom.id,
            name: user.name
          }
        );
      }













    }catch (e){
      console.warn("Error while creating new chatroom with users", e);
    }

  };

  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Image source={{ uri: user.imageUri }} style={styles.avatar} />
        </View>

        <View  style={styles.rightContainer}>
          <View>
            <Text style={styles.username}>{ user.name }</Text>
            <Text style={styles.status}>{ user.status }</Text>
          </View>
        </View>

      </View>
    </TouchableWithoutFeedback>
  );
};

export default ContactListItem;
