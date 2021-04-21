/* Queries */
export const listChatRoomsWithChatRoomUsers = /* GraphQL */ `
  query ListChatRooms(
    $filter: ModelChatRoomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChatRooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        chatRoomUsers {
          items {
            id
            userID
          }
          nextToken
        }
        lastMessage
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUserChatRooms = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      chatRoomUsers {
        items {
          chatRoom {
            id
            lastMessageID
            lastMessage {
              content
              updatedAt
              user {
                name
              }
            }
            chatRoomUsers {
              items {
                user {
                  id
                  name
                  imageUri
                }
              }
            }
          }
        }
      }
    }
  }
`;
export const listMessagesCustom = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdAt
        chatRoomID
        user {
          id
          name
          imageUri
          status
        }
        content
      }
      nextToken
    }
  }
`;

/* Mutations */
export const createMessageCustom = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
      id
      createdAt
      chatRoomID
      userID
      chatRoom {
        id
        lastMessage
        updatedAt        
      }
      user {
        name
        imageUri
        status
      }
      content
      updatedAt
    }
  }
`;

/* Subscriptions */
export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage($chatRoomID: ID!) {
    onCreateMessage(chatRoomID: $chatRoomID) {
      id
      createdAt
      chatRoomID
      userID
      chatRoom {
        id
        chatRoomUsers {
          nextToken
        }
        messages {
          items {
            id
            content
            createdAt
          }
          nextToken
        }
        lastMessageID
        lastMessage {
          id
          createdAt
          chatRoomID
          userID
          content
          updatedAt
        }
        createdAt
        updatedAt
      }
      user {
        id
        name
        imageUri
        status
        chatRoomUsers {
          nextToken
        }
        messages {
          nextToken
        }
        createdAt
        updatedAt
      }
      content
      updatedAt
    }
  }
`;
