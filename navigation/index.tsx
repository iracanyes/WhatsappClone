import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {ColorSchemeName, StyleSheet, View} from 'react-native';
import Colors from "../constants/Colors";
import NotFoundScreen from '../screens/NotFoundScreen';
import {RootStackParamList} from '../types';
import MainTabNavigator from './MainTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import {FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons} from '@expo/vector-icons';
import ChatRoomScreen from "../screens/ChatRoomScreen";
import ContactsScreen from "../screens/ContactsScreen";
import ContactSelectionScreen from "../screens/ContactSelectionScreen";

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        // Ne pas afficher d'en tête
        //headerShown: false,
        // Style de l'en-tête
        headerStyle: {
          backgroundColor: Colors.light.tint,
          // IOS permet de supprimer l'effet shadow du header en bas
          shadowOpacity: 0,
          // Androïd permet de supprimer l'effet shadow du header en bas
          elevation: 0,
          borderWidth: 0,
          borderRadius: 0,
          shadowOffset: { width: 0, height: 0 }
        },
        // Couleur du texte
        headerTintColor: Colors.light.background,
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      }}
    >
      {/* Affiche le composant MainTabNavigator */}
      <Stack.Screen
        name="Root"
        component={MainTabNavigator}
        options={{
          title: 'Whatsapp',
          headerRight: () => (
            <View style={styles.headerRight}>
              <Octicons name="search" size={22} color={Colors.light.background} />
              <MaterialCommunityIcons name="dots-vertical" size={22} color={Colors.light.background} />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        // options doit retourner un objet contenant toutes les options
        // Dans ce cas, il accepte un fonction qui reçoit en paramètre une objet contenant les informations sur la route
        // et retourne un objet contenant les options du Screen
        // route props are passed automaticaly to screen
        // route.params is an object contain
        options={({ route }) => {
          const { name } = route.params;
          return ({
            title: name ,
            headerRight: () => (
              <View style={styles.chatRoomHeaderRight}>
                <FontAwesome5 name={'video'} size={20} color={Colors.light.background}/>
                <MaterialIcons name={'call'} size={20} color={Colors.light.background}/>
                <MaterialCommunityIcons name={'dots-vertical'} size={20} color={Colors.light.background}/>
              </View>
            )
          });
        }}
      />
      <Stack.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{ title: 'Contacts' }}
      />
      <Stack.Screen
        name="ContactSelection"
        component={ContactSelectionScreen}
        options={{
          title: 'Sélection de contacts',
          headerRight: () => (
            <View style={styles.contactSelectionHeaderRight}>
              <Ionicons name={'ios-search'} size={24} color={'white'} />
            </View>
          )
        }}
      />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: "row",
    width: 60,
    justifyContent: "space-between",
    marginRight: 10
  },
  chatRoomHeaderRight: {
    flexDirection: 'row',
    width: 100,
    justifyContent: 'space-between',
    marginRight: 10
  },
  contactSelectionHeaderRight: {
    marginRight: 15,
    alignItems: 'flex-start'
  }
});
