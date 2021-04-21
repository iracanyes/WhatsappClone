import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    //justifyContent:'space-between',
    padding: 10
  },
  leftContainer: {
    flexShrink: 0
    //flexDirection: "row"
  },
  rightContainer: {
    //flex: 4,
    flexGrow: 1,
    justifyContent: 'space-around',
    color: Colors.light.tabIconDefault,

  },
  avatar: {
    //width: 60,
    minWidth: 60,
    minHeight: 60,
    marginRight: 10,
    borderRadius: 50
  },
  rightTopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black'
  },
  date: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: 10
  },
  lastMessage: {
    color: 'grey',
    fontWeight: 'bold'
  }
});

export default styles;
