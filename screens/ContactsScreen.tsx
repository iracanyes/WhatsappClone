import * as React from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import Users from "../data/Users";

import NewMessageButton from "../components/NewMessageButton";
import ContactListItem from "../components/ContactListItem";
import {useEffect, useState} from "react";
import {
  API,
  graphqlOperation
} from "aws-amplify";
import {listUsers} from "../graphql/queries.js";
import {User} from "../types";

export default function ContactsScreen() {
  const [users, setUsers] = useState([]);

  // Run the snippet at mounting if no dependencies
  useEffect(() => {
    const fetchUsers = async () => {
      try{
        const response = await API.graphql(graphqlOperation(listUsers));

        const users = response.data.listUsers.items;

        if(users){
          // Set users in the state of the component
          setUsers(users);
        }
      }catch (e){
        console.warn("Error", e);
      }

    };

    fetchUsers();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={users}
        style={styles.flatlist}
        // Render template for each item
        renderItem={({ item }) => (<ContactListItem user={item} />)}
        // Key extractor for identifying each item
        keyExtractor={ (item: User) => item.id }
      />


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: "relative"
  },
  flatlist: {
    flex: 1,
    width: '100%'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
