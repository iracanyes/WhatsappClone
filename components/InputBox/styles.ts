import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    //justifyContent: "space-between",
    padding: 10
  },
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    backgroundColor: Colors.light.background,
    padding: 10,
    borderRadius: 25,
    marginRight: 10
  },
  textInput: {
    flex: 1,
  },
  icons: {
    marginRight: 10
  },
  buttonContainer: {
    borderRadius: 25,
    backgroundColor: Colors.light.tint,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
    //padding: 12.5
  },
  imageContainer: {},
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain"
  }
});
export default styles;
