/**
 * Description: Message input component
 */
import React, {useEffect, useState} from "react";
import {
  Text,
  View,
  Touchable,
  TextInput,
  TouchableHighlight,
  Image,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import styles from "./styles";
import {
  Entypo,
  FontAwesome5,
  Fontisto,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import * as ImagePicker from "expo-image-picker";
import {
  API,
  Auth,
  graphqlOperation,
} from "aws-amplify";
import {
  createMessage, updateChatRoom

} from "../../graphql/mutations.js";
import i18n from "i18n-js";

const InputBox = (props) => {
  // receive chatRoomID from props ()
  const { chatRoomID } = props;

  const [selectedImages, setSelectedImages] = React.useState(null);
  const [message, setMessage] = React.useState("");
  // User ID
  const [myUserID, setMyUserID ] = useState("");

  useEffect(() => {
    // Get the user ID
    const fetchUser = async () => {
      const userInfo = await Auth.currentAuthenticatedUser();
      setMyUserID(userInfo.attributes.sub);
    }
    fetchUser();
  }, []);

  const onCameraPress = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if(!permissionResult.granted){
      alert(i18n.t('permission_needed_for_camera'));
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if(pickerResult.cancelled){ return; }

    setSelectedImages({ localUri: pickerResult.uri })

    if(selectedImages !== null){
      return (
        <View style={styles.imageContainer}>
          <Image
            style={styles.thumbnail}
            source={{uri: selectedImages.localUri }}
          />
        </View>
      );
    }

  };

  const onMicrophonePress = () => {
    console.warn("Microphone button pressed");
  };

  const onSendPress = async () => {
    // send the message to the backend
    try{
      const response = await API.graphql(
        graphqlOperation(
          createMessage,
          {
            input: {
              content: message,
              userID: myUserID,
              chatRoomID: chatRoomID
            }
          }
        )
      );


      const messageData = response.data.createMessage;


      await updateChatRoomLastMessage(messageData.id);
      setMessage("");
    } catch (e) {
      console.warn('CreateMessage Error', e);
    }
  };

  const updateChatRoomLastMessage = async (messageId: String) =>{
    try{
      const response = await API.graphql(graphqlOperation(
        updateChatRoom,
        {
          input: {
            id: chatRoomID,
            lastMessageID: messageId
          }
        }
      ));
      //console.log('updateChatRoomLastMessage', response);
    }catch (e){
      console.warn("Error while update ChatRoom lastMessage", e);
    }
  };


  const onPress = () => {
    if(!message){
      // active microphone
      onMicrophonePress();
    }else {
      // send message to api
      onSendPress();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
      style={styles.container}
    >
      <View style={styles.mainContainer}>
        <FontAwesome5 name={"laugh-beam"} size={22} color={"grey"}  style={styles.icons}/>
        <TextInput
          style={styles.textInput}
          value={message}
          placeholder={i18n.t('type_message')}
          onChangeText={text => setMessage(text)}
          autoFocus
          multiline
        />

        <Entypo name={"attachment"}  size={22} color={"grey"} style={styles.icons}/>
        {!message &&
            <TouchableHighlight
                activeOpacity={0.6}
                underlayColor={"grey"}
                onPress={onCameraPress}
            >
              <Fontisto name={"camera"}  size={22} color={"grey"} style={styles.icons}/>
            </TouchableHighlight>
        }

      </View>
      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor={"grey"}
        onPress={onPress}
        style={styles.buttonContainer}
      >
        <View>
          {
            !message
              ? <MaterialCommunityIcons name={"microphone"} size={24} color={Colors.light.background}/>
              : <MaterialCommunityIcons name={"send"} size={24} color={Colors.light.background}/>
          }
        </View>
      </TouchableHighlight>


    </KeyboardAvoidingView>
  );
}

export default InputBox;
