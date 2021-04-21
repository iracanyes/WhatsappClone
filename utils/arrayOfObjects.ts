
export const groupByChatRoomUsersChatRoomID = (list: any[]) => {
  const map = new Map();
  list.forEach((item) => {
    const key = item.chatRoomID;
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });


  return map;
}

export const getAssociatedChatRoomID  = (map: Map<string, Array<object>>) =>{
  let retour: string[] = [];
  map.forEach((value, key: string,) => {
    if(value.length == 2){
      retour.push(key);
    }
  });

  return retour;
}

/*
export const groupByChatRoomUsersChatRoomID = (list: any[], keyGetter) => {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}
*/
