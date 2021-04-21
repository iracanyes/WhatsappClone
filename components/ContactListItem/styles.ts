import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    marginVertical: 10
  },
  leftContainer: {
    marginHorizontal: 10
  },
  rightContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  avatar: {
    //width: 60,
    minWidth: 60,
    minHeight: 60,
    marginRight: 10,
    borderRadius: 50
  },
  username: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10
  },
  status: {
    color: 'grey',
    fontWeight: 'bold'
  }
});

export default styles;
