import {API, graphqlOperation} from "aws-amplify";
import {createChatRoomUser} from "../../graphql/mutations.js";

const createChatRoomUserAction = async (chatRoomID: string, userID: string) => {
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
    // @ts-ignore
    console.log("CreateChatRoomUser", response.data.createChatRoomUser);
    // @ts-ignore
    return response.data.createChatRoomUser;
  }catch (e) {
    console.warn("CreateChatroomUser response error", e);
  }


};

export default createChatRoomUserAction;
