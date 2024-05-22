import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, ActivityIndicator, TouchableOpacity} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from "@expo/vector-icons";


export default class RecordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.cameraRef = React.createRef();
    this.state = {
      hasCameraPermission: null,
      hasMediaLibraryPermission: null,
      photo: null
    };
  }

  componentDidMount() {
    this.requestPermissions();
  }

  requestPermissions = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    this.setState({
      hasCameraPermission: cameraPermission.status === 'granted',
      hasMediaLibraryPermission: mediaLibraryPermission.status === 'granted'
    });
  };

  takePic = async () => {
    const options = {
      quality: 1,
      base64: true,
      exif: false
    };

    const newPhoto = await this.cameraRef.current.takePictureAsync(options);
    this.setState({ photo: newPhoto });
  };

  sharePic = () => {
    shareAsync(this.state.photo.uri).then(() => {
      this.setState({ photo: null });
    });
  };

  savePhoto = () => {
    MediaLibrary.saveToLibraryAsync(this.state.photo.uri).then(() => {
      this.setState({ photo: null });
    });
  };

  openGallery = async () => {
    const { status } = await MediaLibrary.getPermissionsAsync();
    if (status === 'granted') {
      console.log('Opening gallery...');
    } else {
      console.log('Permission not granted to access the gallery.');
    }
  };

  render() {
    const { hasCameraPermission, hasMediaLibraryPermission, photo } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting permissions...</Text>;
    } else if (!hasCameraPermission) {
      return <Text>Permission for camera not granted. Please change this in settings.</Text>;
    }

    if (photo) {
      return (
        <SafeAreaView style={styles.container}>
          <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />
          <Button title="Share" onPress={this.sharePic} />
          {hasMediaLibraryPermission ? <Button title="Save" onPress={this.savePhoto} /> : null}
          <Button title="Discard" onPress={() => this.setState({ photo: null })} />
          <Button title="Open Gallery" onPress={this.openGallery} />
         
        </SafeAreaView>
      );
    }

    return (
        <CameraView style={styles.container} ref={this.cameraRef}>
            <View>
            <TouchableOpacity style={styles.takePicButton} onPress={this.takePic}>
                <Ionicons name="radio-button-on-outline" size={70} color="white" />
            </TouchableOpacity>
            </View>
        </CameraView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  takePicButton: {
    position: 'absolute',
    bottom: -400,
    width: 70,
    height: 70,
    //borderRadius: 35,
    //backgroundColor: 'white',
    alignSelf: 'center',
    zIndex: 1,
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1
  }
});
