import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';

const RecordScreen = ({ navigation }) => {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [video, setVideo] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [mode, setMode] = useState('photo');
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
            setHasCameraPermission(cameraPermission.status === 'granted');
            setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted');
        })();
    }, []);

    const takePic = async () => {
        const options = {
            quality: 1,
            base64: true,
            exif: false
        };

        const newPhoto = await cameraRef.current.takePictureAsync(options);
        setPhoto(newPhoto);
        setVideo(null);
    };

    const startRecording = async () => {
        if (cameraRef.current) {
            setIsRecording(true);
            const newVideo = await cameraRef.current.recordAsync();
            setVideo(newVideo);
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (cameraRef.current && isRecording) {
            cameraRef.current.stopRecording();
            setIsRecording(false);
        }
    };

    const shareMedia = (uri) => {
        shareAsync(uri).then(() => {
            setPhoto(null);
            setVideo(null);
        });
    };

    const saveMedia = (uri) => {
        MediaLibrary.saveToLibraryAsync(uri).then(() => {
            setPhoto(null);
            setVideo(null);
        });
    };

    const discardMedia = () => {
        setPhoto(null);
        setVideo(null);
    };

    const openGallery = async () => {
        const { status } = await MediaLibrary.getPermissionsAsync();
        if (status === 'granted') {
            console.log('Opening gallery...');
        } else {
            console.log('Permission not granted to access the gallery.');
        }
    };

    const handleCaptureButtonPress = () => {
        if (mode === 'photo') {
            takePic();
        } else if (mode === 'video') {
            if (isRecording) {
                stopRecording();
            } else {
                startRecording();
            }
        }
    };

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
                <Button title="Share" onPress={() => shareMedia(mediaUri)} />
                {hasMediaLibraryPermission ? <Button title="Save" onPress={() => saveMedia(mediaUri)} /> : null}
                <Button title="Discard" onPress={discardMedia} />
                <Button title="Open Gallery" onPress={openGallery} />
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} ref={cameraRef}>
                <View style={styles.controlContainer}>
                    <View style={styles.modeButtonContainer}>
                        <TouchableOpacity onPress={() => setMode('photo')} style={styles.modeButton}>
                            <Text style={mode === 'photo' ? styles.activeModeText : styles.inactiveModeText}>Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setMode('video')} style={styles.modeButton}>
                            <Text style={mode === 'video' ? styles.activeModeText : styles.inactiveModeText}>Video</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.controlContainer}>
                        {mode === 'photo' ? (
                            <TouchableOpacity style={styles.takePicButton} onPress={takePic}>
                                <Ionicons name="radio-button-on" size={70} color="white" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.takePicButton} onPress={handleCaptureButtonPress}>
                                <Ionicons name={isRecording ? "stop-circle" : "radio-button-on"} size={70} color="red" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </CameraView>
        </View>
    );
};

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

export default RecordScreen;
