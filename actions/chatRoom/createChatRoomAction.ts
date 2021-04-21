import {API, graphqlOperation} from "aws-amplify";
import {createChatRoom} from "../../graphql/mutations.js";


const createChatRoomAction = async () => {
  const response = await API.graphql(graphqlOperation(
    createChatRoom,
    {
      input: {}
    }
  ));

  // @ts-ignore
  return response.data.createChatRoom;
};

export default createChatRoomAction;
