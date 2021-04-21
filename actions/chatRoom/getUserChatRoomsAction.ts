import {API, graphqlOperation} from "aws-amplify";
import {getUserChatRooms} from "../../graphql/customQueries.js";


const getUserChatRoomsAction = async (userInfo: any) => {
  const getMyChatRooms = await API.graphql(graphqlOperation(
    getUserChatRooms,
    {
      id: userInfo.attributes.sub
    }
  ));

  // @ts-ignore
  console.log("getMyChatRooms response", getMyChatRooms.data.getUser);

  // @ts-ignore
  return getMyChatRooms.data.getUser.chatRoomUsers.items;
};

export default getUserChatRoomsAction;
