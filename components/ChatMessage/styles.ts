import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  messageBox: {
    backgroundColor: Colors.light.background,
    marginRight: 50,
    borderRadius: 5,
    padding: 10
  },
  messageTitle: {
    fontWeight: "bold",
    color: Colors.light.tint,
    marginBottom: 5,
  },
  messageContent: {},
  messageDate: {
    textAlign: "right",
    color: "grey"
  }
});

export default styles;
