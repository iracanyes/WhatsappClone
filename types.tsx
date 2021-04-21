export type RootStackParamList = {
  Root: undefined;
  ChatRoom: undefined;
  Contacts: undefined;
  ContactSelection: undefined;
  NotFound: undefined;
};

export type MainTabParamList = {
  Camera: undefined;
  Chats: undefined;
  Status: undefined;
  Calls: undefined;
};

export type RouteParamsProps = {
  id: string;
  name: string;
};


export type ChatListItemProps = {
  chatRoom: ChatRoom;
};

export type ContactListItemProps = {
  user: User;
};

export type ContactSelectionProps = {
  photo: undefined;
}
/*
export type ContactSelectionListItemProps = {
  title: undefined;
  data: undefined;
};
*/

export type ContactSelectionSection = {
  title: string;
  type: string;
  data: User[]|ChatRoomUser[];
}

export type ContactSelectionListItemProps = {
  item: User|ChatRoom;
  index: number;
  section: ContactSelectionSection;
  chatRooms: ChatRoom[];
  sharedObject: undefined;
};

export type ChatMessageProps = {
  userId: String;
  message: Message;

};


export type ChatRoom = {
  id: String;
  users: User[];
  lastMessage: Message;
  chatRoomUsers: { items: ChatRoomUser[] };
};



export type User = {
  id: string;
  name: string;
  imageUri: string;
  status: string;
};

export type Message = {
  id: String;
  user: User;
  content: String;
  createdAt: string;
  updatedAt: String;
};

export type ChatRoomUser = {
  id: String;
  userID: String;
  chatRoomID: String;
  chatRoom: ChatRoom;
  user: User;

};


export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};
