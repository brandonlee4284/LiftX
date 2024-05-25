import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native';
import { getDoc, doc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';

const { height, width } = Dimensions.get('window');

const SPLITS = [
    {
        id: '1', title: 'Split 1', days: [
            { name: 'Day 1', exercises: [{ name: 'Bench', volume: '4x10' }, { name: 'Incline Bench', volume: '4x10' }, { name: 'Incline Bench', volume: '4x10' }, { name: 'Incline Bench', volume: '4x10' }] },
            { name: 'Day 2', exercises: [{ name: 'Squat', volume: '4x10' }, { name: 'Leg Press', volume: '4x10' }] },
            { name: 'Day 3', exercises: [{ name: 'Bench', volume: '4x10' }, { name: 'Incline Bench', volume: '4x10' }] },
            { name: 'Day 4', exercises: [{ name: 'Squat', volume: '4x10' }, { name: 'Leg Press', volume: '4x10' }] }
        ]
    },
    {
        id: '2', title: 'Split 2', days: [
            { name: 'Day 1', exercises: [{ name: 'Bench', volume: '4x10' }, { name: 'Incline Bench', volume: '4x10' }] },
            { name: 'Day 2', exercises: [{ name: 'Squat', volume: '4x10' }, { name: 'Leg Press', volume: '4x10' }] },
            { name: 'Day 3', exercises: [{ name: 'Bench', volume: '4x10' }, { name: 'Incline Bench', volume: '4x10' }] },
            { name: 'Day 4', exercises: [{ name: 'Squat', volume: '4x10' }, { name: 'Leg Press', volume: '4x10' }] }
        ]
    },
    {
        id: '3', title: 'Split 3', days: [
            { name: 'Day 1', exercises: [{ name: 'Bench', volume: '4x10' }, { name: 'Incline Bench', volume: '4x10' }] },
            { name: 'Day 2', exercises: [{ name: 'Squat', volume: '4x10' }, { name: 'Leg Press', volume: '4x10' }] },
            { name: 'Day 3', exercises: [{ name: 'Bench', volume: '4x10' }, { name: 'Incline Bench', volume: '4x10' }] },
            { name: 'Day 4', exercises: [{ name: 'Squat', volume: '4x10' }, { name: 'Leg Press', volume: '4x10' }] }
        ]
    },
    {
        id: '4', title: 'Split 4', days: [
            { name: 'Day 1', exercises: [{ name: 'Bench', volume: '4x10' }, { name: 'Incline Bench', volume: '4x10' }] },
            { name: 'Day 2', exercises: [{ name: 'Squat', volume: '4x10' }, { name: 'Leg Press', volume: '4x10' }] },
            { name: 'Day 3', exercises: [{ name: 'Bench', volume: '4x10' }, { name: 'Incline Bench', volume: '4x10' }] },
            { name: 'Day 4', exercises: [{ name: 'Squat', volume: '4x10' }, { name: 'Leg Press', volume: '4x10' }] }
        ]
    },
    // Add more splits as needed
];

const WorkoutScreen = () => {
    const [privateUserData, setPrivateUserData] = useState({});
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
                        setPrivateUserData(docData.data());
                        console.log('Private data fetched: ', docData.data());
                        setIsLoading(false);
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching private data: ', error);
                }
            }
        }

        fetchPrivateUserData();
    }, []);

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