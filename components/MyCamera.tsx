import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { CapturedPicture } from 'expo-camera/build/Camera.types';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { set_localImages } from './slice/ImagesSlice';
import { RootState } from '../store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MediaLibrary from 'expo-media-library';
import { ImageType } from '../types/type';

export default function MyCamera() {
  const { data: images } = useSelector((state: RootState) => state.images);
  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [cameraRef, setCameraRef] = useState<Camera | null>(null);
  const [location, setLocation] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  let uuid = uuidv4();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      let { status: statusLocation } =
        await Location.requestForegroundPermissionsAsync();
      if (statusLocation !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      const { coords } = location;
      setLocation(coords);
    })();
  }, []);
  if (hasPermission === null) {
    return <View />;
  }
  if (!hasPermission) {
    return <Text>No access to camera</Text>;
  }

  /**
   * Take a picture with the camera, and then dispatch an action to add the picture to the localImages array
   * @returns The photo object is being returned.
   */
  const takePicture = async () => {
    if (!cameraRef) return;
    const photo = await cameraRef.takePictureAsync({ quality: 0.5 });
    dispatch(
      set_localImages({
        ...photo,
        latitude: location?.latitude,
        longitude: location?.longitude,
        id: uuid,
      })
    );
  };

  /**
   * If the camera is facing the back, then set the camera to face the front. If the camera is facing the front, then set
   * the camera to face the back
   */
  const setFace = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  /**
   * We're using the MediaLibrary API to save the first image in our images array to the user's photo library
   */
  const savePicture = async (item: ImageType) => {
    MediaLibrary.requestPermissionsAsync().then(({ status }) => {
      if (status === 'granted') {
        MediaLibrary.saveToLibraryAsync(item.uri).then(() => {
          alert('Saved to gallery');
        });
      } else {
        alert('No access to gallery');
      }
    });
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={(ref) => {
          setCameraRef(ref);
        }}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={setFace}>
            <Ionicons
              name="ios-camera-reverse-outline"
              size={40}
              color="#FFF"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.snapButton} onPress={takePicture}>
            <Ionicons name="camera-outline" size={80} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.save} onPress={savePicture}>
            <Ionicons name="save-outline" size={40} color="#FFF" />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
    height: 50,
    marginBottom: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
  },
  snapButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  save: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  image: {
    position: 'absolute',
    borderRadius: 10,
    bottom: 50,
    right: 20,
    width: 100,
    height: 216,
  },
});
