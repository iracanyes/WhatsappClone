import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Localization from "expo-localization";
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import Amplify from "aws-amplify";
import config from "./aws-exports.js";
// AWS Amplify Authentication
import {
  Auth,
  API,
  graphqlOperation
} from 'aws-amplify';
import { withAuthenticator } from "aws-amplify-react-native";
import { getUser } from "./graphql/queries.js";
import { createUser }  from "./graphql/mutations.js";
import { randomImage } from "./data/Images";
// Configuration de l'internationalisation
import i18n from "./config/i18n";

Amplify.configure({
  ...config,
  Analytics: {
    disabled: true
  }
});



function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const getRandomImage = () => randomImage[Math.floor(Math.random() * randomImage.length)];

  // Run this snippet at first loading of the application if no dependencies given,
  // else it run each time dependencies changed
  // to connect a user from AWS Cognito UserPool and a user from our database
  // useEffect MUST receive an anonymous function
  useEffect(() => {
    const fetchUser = async () => {
      try{
        // get Authenticated user from Auth  (AWS Cognito)
        // bypassCache to not get a user from cache but from server
        const userInfo = await Auth.currentAuthenticatedUser({ bypassCache: true });


        // request the user with same id in the backend
        if(userInfo){
          const response = await API.graphql(graphqlOperation(
            getUser,
            {
              // ID on AWS Cognito will be used as ID of user in database
              id: userInfo.attributes.sub
            }
          ));


          const user = response.data.getUser;
          if(user){
            return;
          }

          const newUserData = {
            id: userInfo.attributes.sub,
            name: userInfo.username,
            imageUri: getRandomImage(),
            status: i18n.t('hello_from_whatsapp')
          };

          // if no user exist with this ID, create one
          const newUser = await API.graphql(graphqlOperation(createUser, {
            input: newUserData
          }));

        }

      }catch (e){
        console.error("Error : ",e);
      }
    }

    fetchUser();
  },
  // If no depedencies, useEffect run only at first start else it run each time a dependency is updated
    []
  );

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

export default withAuthenticator(App);
