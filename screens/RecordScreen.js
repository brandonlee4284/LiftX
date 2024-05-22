
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';

export default class RecordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.cameraRef = React.createRef();
    this.state = {
      hasCameraPermission: null,
      hasMediaLibraryPermission: null,
      photo: null,
      video: null,
      isRecording: false,
      mode: 'photo'
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
    this.setState({ photo: newPhoto, video: null });
  };

  startRecording = async () => {
    if (this.cameraRef.current) {
      this.setState({ isRecording: true });
      const video = await this.cameraRef.current.recordAsync();
      this.setState({ video, isRecording: false });
    }
  };

  stopRecording = () => {
    if (this.cameraRef.current && this.state.isRecording) {
      this.cameraRef.current.stopRecording();
      this.setState({ isRecording: false });
    }
  };

  shareMedia = (uri) => {
    shareAsync(uri).then(() => {
      this.setState({ photo: null, video: null });
    });
  };

  saveMedia = (uri) => {
    MediaLibrary.saveToLibraryAsync(uri).then(() => {
      this.setState({ photo: null, video: null });
    });
  };

  discardMedia = () => {
    this.setState({ photo: null, video: null });
  };

  openGallery = async () => {
    const { status } = await MediaLibrary.getPermissionsAsync();
    if (status === 'granted') {
      console.log('Opening gallery...');
    } else {
      console.log('Permission not granted to access the gallery.');
    }
  };

  toggleMode = (mode) => {
    this.setState({ mode });
  };

  handleCaptureButtonPress = () => {
    const { mode, isRecording } = this.state;
    if (mode === 'photo') {
      this.takePic();
    } else if (mode === 'video') {
      if (isRecording) {
        this.stopRecording();
      } else {
        this.startRecording();
      }
    }
  };

  render() {
    const { hasCameraPermission, hasMediaLibraryPermission, photo, video, isRecording, mode } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting permissions...</Text>;
    } else if (!hasCameraPermission) {
      return <Text>Permission for camera not granted. Please change this in settings.</Text>;
    }

    const mediaUri = photo ? photo.uri : video ? video.uri : null;

    if (photo || video) {
      return (
        <SafeAreaView style={styles.container}>
          {photo ? (
            <Image style={styles.preview} source={{ uri: mediaUri }} />
          ) : (
            <Video
              source={{ uri: mediaUri }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              shouldPlay
              isLooping
              style={styles.preview}
            />
          )}
          <Button title="Share" onPress={() => this.shareMedia(mediaUri)} />
          {hasMediaLibraryPermission ? <Button title="Save" onPress={() => this.saveMedia(mediaUri)} /> : null}
          <Button title="Discard" onPress={this.discardMedia} />
          <Button title="Open Gallery" onPress={this.openGallery} />
        </SafeAreaView>
      );
    }

    return (
      <View style={styles.container}>
        <CameraView style={styles.camera} ref={this.cameraRef}>
          <View style={styles.controlContainer}>
            <View style={styles.modeButtonContainer}>
              <TouchableOpacity onPress={() => this.toggleMode('photo')} style={styles.modeButton}>
                <Text style={mode === 'photo' ? styles.activeModeText : styles.inactiveModeText}>Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.toggleMode('video')} style={styles.modeButton}>
                <Text style={mode === 'video' ? styles.activeModeText : styles.inactiveModeText}>Video</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.controlContainer}>
              {mode === 'photo' ? (
                <TouchableOpacity style={styles.takePicButton} onPress={this.takePic}>
                  <Ionicons name="radio-button-on" size={70} color="white" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.takePicButton}
                  onPress={this.handleCaptureButtonPress}
                >
                  <Ionicons name={isRecording ? "stop-circle" : "radio-button-on"} size={70} color="red" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </CameraView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  controlContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  modeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modeButton: {
    marginHorizontal: 20,
  },
  activeModeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  inactiveModeText: {
    fontSize: 18,
    color: 'gray',
  },
  takePicButton: {
    alignSelf: 'center',
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1,
  },
});