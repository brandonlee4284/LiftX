import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { getDoc, doc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';


const { height, width } = Dimensions.get('window');

const data = ['Split 1', 'Split 2', 'Split 3', 'Split 4', 'Split 5'];

const WorkoutScreen = () => {
    const [privateUserData, setPrivateUserData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchPrivateUserData() {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
                const privateDataDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'userData', 'data');
                try {
                    const docData = await getDoc(privateDataDocRef);
                    if (docData.exists()) {
                        setPrivateUserData(docData.data());
                        console.log('Private data fetched: ', docData.data());

                        setIsLoading(false)
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching private data: ', error);
                }
            }
        };

        fetchPrivateUserData().then(
            () => console.log(privateUserData),
        );  
    
    
    }, []);

    
    
    return (
        <View style={styles.container}>
            <Carousel
                style={styles.carousel}
                vertical
                loop={false}
                width={width * 1.15}
                height={height * 0.40}
                data={data}
                mode="parallax"
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.text}>{item}</Text>
                        <Carousel
                            style={styles.horizontalCarousel}
                            horizontal
                            loop={false}
                            width={width}
                            height={height * .3}
                            data={[{}, {}, {}]} // 3 empty cards
                            mode="parallax"
                            renderItem={() => (
                                <View style={styles.innerCard}></View>
                            )}
                        />
                    </View>
                )}
                customConfig={() => ({ parallaxScrollingScale: 1, parallaxScrollingOffset: 0 })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        justifyContent: 'center',
        alignItems: 'center',
        height: height * 0.35,
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
    },
    text: {
        fontSize: 24,
        marginBottom: 10,
    },
    carousel: {
        justifyContent: 'center',
        width: width * 1.15,
        height: height,
    },
    horizontalCarousel: {
        marginTop: 10,
    },
    innerCard: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        height: height * 0.3,
        backgroundColor: '#e0e0e0',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 10,
        marginHorizontal: 5,
    },
});

export default WorkoutScreen;