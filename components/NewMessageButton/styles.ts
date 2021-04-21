import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    backgroundColor: Colors.light.tint,
    color: Colors.light.background,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    opacity: 1,
    zIndex: 1,
    position: "absolute",
    bottom: 15,
    right: 15
  },
  icon: {
  }
});

export default styles;
