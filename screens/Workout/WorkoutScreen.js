import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native';
import { getDoc, doc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';

const { height, width } = Dimensions.get('window');

const data = ['Split 1', 'Split 2', 'Split 3', 'Split 4', 'Split 5'];

const convertSplitsTo3DArray = (splits) => {
    return splits.order.map(splitIndex => {
        const split = splits[splitIndex];
        return {
            splitName: split.splitName,
            days: split.day.order.map(dayIndex => {
                const day = split.day[dayIndex];
                return {
                    dayName: day.dayName,
                    exercises: day.exercises.order.map(exerciseIndex => {
                        return day.exercises[exerciseIndex];
                    })
                };
            })
        };
    });
};

const WorkoutScreen = () => {
    const [privateUserData, setPrivateUserData] = useState({});
    const [workoutData, setWorkoutData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [maxDayCardHeight, setMaxDayCardHeight] = useState(0);

    useEffect(() => {
        async function fetchPrivateUserData() {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
                const privateDataDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'userData', 'data');
                try {
                    const docData = await getDoc(privateDataDocRef);
                    if (docData.exists()) {
                        return docData.data();
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching private data: ', error);
                }
            }
            return null;
        }

        async function fetchData() {
            const data = await fetchPrivateUserData();
            if (data) {
                setPrivateUserData(data);
            }
            setIsLoading(false);
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (privateUserData.splits) {
            const splits = privateUserData.splits;
            const data = convertSplitsTo3DArray(splits);
            setWorkoutData(data);
            console.log(data);
        }
    }, [privateUserData]);



    const renderExercise = (exercise, index) => (
        <View key={index} style={styles.exerciseCard}>
            <Text style={styles.exerciseText}>{exercise.name} @ {exercise.volume}</Text>
        </View>
    );

    const renderDay = ({ item }) => (
        <View onLayout={event => {
            const { height } = event.nativeEvent.layout;
            if (height > maxDayCardHeight) {
                setMaxDayCardHeight(height);
            }
        }} style={[styles.dayCard, { minHeight: maxDayCardHeight }]}>
            <Text style={styles.dayText}>{item.name}</Text>
            <View style={styles.exerciseList}>
                {item.exercises.map(renderExercise)}
            </View>
        </View>
    );

    const renderSplit = ({ item }) => (
        <View style={styles.splitContainer}>
            <Text style={styles.splitTitle}>{item.title}</Text>
            <FlatList
                horizontal
                data={item.days}
                renderItem={renderDay}
                keyExtractor={(day, index) => `${day.name}-${index}`}
                contentContainerStyle={styles.horizontalFlatListContent}
                showsHorizontalScrollIndicator={false}
            />
            <View style={styles.line} />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={SPLITS}
                renderItem={renderSplit}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.verticalFlatListContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    splitContainer: {
        marginBottom: 20,
        alignItems: 'left',
        marginHorizontal: -2

    },
    splitTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 15,
    },
    horizontalFlatList: {
        height: height * 0.35,
    },
    horizontalFlatListContent: {
        paddingHorizontal: 10,
    },
    dayCard: {
        alignItems: 'center',
        width: width * 0.30,
        backgroundColor: '#e0e0e0',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 10,
        marginHorizontal: 5,
        padding: 10,
    },
    dayText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    exerciseCard: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%',
        paddingHorizontal: 5,
        marginBottom: 5,
    },
    exerciseText: {
        fontSize: 10,
    },
    exerciseList: {
        paddingBottom: 20,
    },
    verticalFlatListContent: {
        paddingVertical: 20,
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: 'lightgray',
        marginTop: 40,
    },
});

export default WorkoutScreen;