/**
 * Description: Message Component
 */
import React from "react";
import {
  Text,
  View
} from "react-native";
import { ChatMessageProps } from "../../types";
import { DateTime } from "luxon";
import styles from "./styles";
import Colors from "../../constants/Colors";
import * as Localization from "expo-localization";



const ChatMessage = (props: ChatMessageProps) => {
  const { userId , message } = props;
  const isMyMessage = () => userId === message.user.id;

  const dateFormat = (date: string) => {
    const newDate = DateTime.fromISO(date);

    return newDate
        .setLocale(Localization.locale.split('-')[0])
        .toRelativeCalendar();
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.messageBox,
        // Conditional styling
        {
          backgroundColor: isMyMessage() ? "#DCF8C5" : Colors.light.background,
          marginRight: isMyMessage() ? 0 : 50,
          marginLeft: isMyMessage() ? 50 : 0,

        }
      ]}>
        { !isMyMessage() && <Text style={styles.messageTitle}>{message.user.name}</Text>}
        <Text style={styles.messageContent}>{message.content}</Text>
        <Text style={styles.messageDate}>{dateFormat(message.createdAt)}</Text>
      </View>
    </View>
  )
}



export default ChatMessage;
