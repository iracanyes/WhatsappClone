import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ChatsScreen from '../screens/ChatsScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import ChatRoomScreen from "../screens/ChatRoomScreen";
import { MainTabParamList, TabOneParamList, TabTwoParamList } from '../types';
import { Fontisto } from "@expo/vector-icons";
import {View, Text, StyleSheet} from "react-native";
import ContactsScreen from "../screens/ContactsScreen";
import CameraScreen from "../screens/CameraScreen";

// Bar de navigation principale
const MainTab = createMaterialTopTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <MainTab.Navigator
      initialRouteName="Chats"
      tabBarOptions={{
        activeTintColor: Colors[colorScheme].background,
        style:{
          backgroundColor: Colors[colorScheme].tint
        },
        // tab at bottom of a tab
        indicatorStyle:{
          backgroundColor: Colors[colorScheme].background,
          height: 4,
        },
        labelStyle: {
          fontWeight: 'bold',
          flexGrow: 1,

        },
        iconStyle:{
          flexShrink: 0,
          marginHorizontal: 50
        },
        // Afficher des icones
        showIcon: true
      }}
    >
      <MainTab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          //title: "Camera",
          tabBarIcon: ({ color }) => <Fontisto name="camera" color={color} size={22}/>,
          // Ne pas afficher le label en retournant null
          tabBarLabel: () => null,
          /*
          tabBarLabel: ({color}) => (
            <View style={styles.iconLabel}>
              <Fontisto name="camera" color={color} size={18}/>
            </View>
          ),
           */
        }}

      />
      <MainTab.Screen
        name="Chats"
        component={ChatsScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <View style={styles.textLabel}>
              <Text  style={styles.labelContent}>{'Chats'.toUpperCase()}</Text>
            </View>
          ),
        }}
      />
      <MainTab.Screen
        name="Status"
        component={ContactsScreen}
        options={{
          title: 'Statut',
          tabBarLabel: ({color}) => (
            <View style={styles.textLabel}>
              <Text style={styles.labelContent}>Status</Text>
            </View>
          ),
        }}
      />
      <MainTab.Screen
        name="Calls"
        component={TabTwoNavigator}
        options={{
          tabBarLabel: ({color}) => (
            <View style={styles.textLabel}>
              <Text style={styles.labelContent}>Calls</Text>
            </View>
          ),

        }}
      />
    </MainTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="TabOneScreen"
        component={ChatsScreen}
        options={{ headerTitle: 'Tab One Title' }}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={{ headerTitle: 'Tab Two Title' }}
      />
    </TabTwoStack.Navigator>
  );
}

const styles = StyleSheet.create({
  iconLabel: {
    flexShrink: 0,
  },
  textLabel: {
    flexGrow: 1,

  },
  labelContent: {
    fontWeight: 'bold',
  }
});
