import React, { useEffect, useState } from "react";
import {Text, View, Image, TouchableWithoutFeedback} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {ChatListItemProps, ChatRoom, User} from "../../types";
import styles from "./styles";
import { Auth } from "aws-amplify";
import { DateTime } from "luxon";
import i18n from "i18n-js";
import * as Localization from "expo-localization";

const ChatListItem = (props: ChatListItemProps) => {
  // Chatroom received from FlatList renderItem
  const { chatRoom } = props;
  // Identify the first participant of the chatroom
  const [ otherUser, setOtherUser ] = useState<User>({
    id: "",
    name: "???",
    imageUri: "https://www.fillmurray.com/500/500",
    status: i18n.t('nobody.found')
  });
  const navigation = useNavigation();

  // On mounting, identify the second user of the chatroom
  useEffect(() => {
    const getOtherUser = async () => {
      const authenticatedUser = await Auth.currentAuthenticatedUser();
      if(chatRoom.chatRoomUsers.items[0].user.id === authenticatedUser.attributes.sub){
        setOtherUser(chatRoom.chatRoomUsers.items[1].user);
      }else{
        setOtherUser(chatRoom.chatRoomUsers.items[0].user);
      }
    };
    getOtherUser();
  }, []);

  // Readable date
  const dateFormat = (dateIso: string|undefined = undefined) => {
    const locale = Localization.locale.split('-')[0];
    //console.log('dateFormat locale', locale);
    const dateObject = dateIso
      ? DateTime.fromISO(dateIso)
      : DateTime.now();

    return dateObject.toRelativeCalendar({
      locale: 'fr'
    });
  };

  const onClick = () => {
    navigation.navigate(
      'ChatRoom',
      {
        id: chatRoom.id,
        name: otherUser.name
      }
    );
  };

  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Image source={{ uri: otherUser.imageUri }} style={styles.avatar} />
        </View>

        <View  style={styles.rightContainer}>
          <View style={styles.rightTopContainer}>
            <Text style={styles.username}>{ otherUser.name }</Text>

            { chatRoom.lastMessage
              ? <Text style={styles.date}>
                  { dateFormat(chatRoom.lastMessage.updatedAt) }
                </Text>
              : <Text style={styles.date}>
                  { dateFormat() }
                </Text>
            }

          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={styles.lastMessage}
          >
            {chatRoom.lastMessage
              ? `${chatRoom.lastMessage.user.name}: ${chatRoom.lastMessage.content}`
              : i18n.t('hello_from_whatsapp')
            }
          </Text>
        </View>

      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChatListItem;
