import React, {useState, useEffect, createRef, RefObject} from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity, GestureResponderEvent, SafeAreaView
} from "react-native";
import { Camera } from "expo-camera";
import {MaterialIcons} from "@expo/vector-icons";
import Colors from "../constants/Colors";
import {useNavigation} from "@react-navigation/native";

const CameraScreen = () => {
  const camera = createRef<Camera>();
  const navigation = useNavigation();
  // Set Camera permissions
  const [ hasPermission, setHasPermission ] = useState<Boolean|null>(null);
  // Set Camera facing type ['frontal(back)', 'faciale(top)']
  const [ type, setType ] = useState(Camera.Constants.Type.back);
  // Set the Flash mode
  const [ flashMode, setFlashMode ] = useState(Camera.Constants.FlashMode.auto);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if(hasPermission === null){
    return (
      <View>
        <Text>{"You don't have the requested permission!"}</Text>
      </View>
    );
  }

  if(!hasPermission){
    return (
      <View>
        <Text>{"You don't have the requested permission!"}</Text>
      </View>
    );
  }

  const takeAPhoto = async (event: GestureResponderEvent, camera: RefObject<Camera>) =>{

    if(camera.current){
      const takePhoto = await camera.current.takePictureAsync({
        quality: 1,
        skipProcessing: false
      });
      //console.log("takePhoto", takePhoto);

      navigation.navigate(
        'ContactSelection',
        {
          sharedObject : {
            photo: takePhoto
          }
        }
      );


    }
  }

  const record = async (event: GestureResponderEvent, camera: RefObject<Camera>) => {
    const ready = await Camera.isAvailableAsync();
    if(ready){
      console.log("Ready to record a video!");
    }

  };

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        // ref to camera component for using methods exposed by this component
        ref={ camera }
        // type camera (frontal ou facial)
        type={type}
        flashMode={flashMode}
        style={styles.camera}
      >
        <View style={styles.buttonContainer}>
          {/* Top button container */}
          <View style={ styles.topButtonContainer}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.6}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                )
              }}
            >
              <MaterialIcons
                name={"flip-camera-ios"}
                size={32}
                color={Colors.light.background}
              />
            </TouchableOpacity>
          </View>
          {/* Bottom button container */}
          <View style={ styles.bottomButtonContainer}>
            {/* Button Flash mode */}
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.6}
              onPress={() => {
                setFlashMode(
                  flashMode === Camera.Constants.FlashMode.off
                    ? Camera.Constants.FlashMode.on
                    : Camera.Constants.FlashMode.off
                )
              }}
            >
              <MaterialIcons
                name={flashMode === Camera.Constants.FlashMode.off ? "flash-off" : "flash-on"}
                size={32}
                color={Colors.light.background}
              />
            </TouchableOpacity>
            {/* Button Picture / Camera */}
            <TouchableOpacity
              style={styles.buttonPicture}
              activeOpacity={0.6}
              onPress={ e => takeAPhoto(e, camera)}
              onLongPress={ e => record(e, camera)}
            >
            </TouchableOpacity>
            {/* Button Flip mode */}
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.6}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                )
              }}
            >
              <MaterialIcons
                name={"flip-camera-ios"}
                size={32}
                color={Colors.light.background}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  camera: {
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    //margin: 20,
    padding: 10
  },
  topButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start'
  },
  bottomButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 10
    //alignSelf: 'baseline'
  },
  button: {
    //flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    //alignSelf: 'flex-start',
    //backgroundColor: 'transparent',
    color: 'white',
    width: 75,
    height: 75,
    margin: 10,
    borderRadius: 50
  },
  buttonPicture: {
    width: 75,
    height: 75,
    borderRadius: 50,
    margin: 10,
    borderWidth: 5,
    borderColor: 'white'

  }
});


export default CameraScreen;
