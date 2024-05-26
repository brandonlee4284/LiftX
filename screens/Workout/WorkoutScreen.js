import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Modal, TouchableOpacity, Button } from 'react-native';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';

const { height, width } = Dimensions.get('window');

// OPTIMIZE THESE FUNCTIONS TO BE MORE EFFICIENT, CURRENTLY RE-WRITES THE ENTIRE DOC EVERY TIME
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

const convert3DArrayToSplits = (array) => {
    const splits = {};
    const splitOrder = [];

    array.forEach((split, splitIndex) => {
        splitOrder.push(splitIndex);
        splits[splitIndex] = {
            splitName: split.splitName,
            day: {
                order: []
            }
        };

        split.days.forEach((day, dayIndex) => {
            splits[splitIndex].day.order.push(dayIndex);
            splits[splitIndex].day[dayIndex] = {
                dayName: day.dayName,
                exercises: {
                    order: []
                }
            };

            day.exercises.forEach((exercise, exerciseIndex) => {
                splits[splitIndex].day[dayIndex].exercises.order.push(exerciseIndex);
                splits[splitIndex].day[dayIndex].exercises[exerciseIndex] = exercise;
            });
        });
    });

    splits.order = splitOrder;
    return splits;
};

const WorkoutScreen = ({ navigation }) => {
    const [privateUserData, setPrivateUserData] = useState({});
    const [workoutData, setWorkoutData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [maxDayCardHeight, setMaxDayCardHeight] = useState(0);
    const [selectedDay, setSelectedDay] = useState(null);

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
        }
    }, [privateUserData]);

    const updateWorkoutData = async (data) => {
        const splits = convert3DArrayToSplits(data);
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
            const privateDataDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'userData', 'data');
            try {
                await setDoc(privateDataDocRef, { splits }, { merge: true });
            } catch (error) {
                console.error('Error updating private data: ', error);
            }
        }
    }

    const renderExercise = (exercise, index) => (
        <View key={index} style={styles.exerciseCard}>
            <Text style={styles.exerciseText}>{exercise.name} @ {exercise.volume}</Text>
        </View>
    );

    const renderDay = ({ item }) => (
        <TouchableOpacity
            onPress={() => setSelectedDay(item)}
            onLayout={event => {
                const { height } = event.nativeEvent.layout;
                if (height > maxDayCardHeight) {
                    setMaxDayCardHeight(height);
                }
            }}
            style={[styles.dayCard, { minHeight: maxDayCardHeight }]}
        >
            <Text style={styles.dayText}>{item.dayName}</Text>
            <View style={styles.exerciseList}>
                {item.exercises.map(renderExercise)}
            </View>
        </TouchableOpacity>
    );

    const renderSplit = ({ item }) => (
        <View style={styles.splitContainer}>
            <Text style={styles.splitTitle}>{item.splitName}</Text>
            <FlatList
                horizontal
                data={item.days}
                renderItem={renderDay}
                keyExtractor={(day, index) => `${day.dayName}-${index}`}
                contentContainerStyle={styles.horizontalFlatListContent}
                showsHorizontalScrollIndicator={false}
            />
            <View style={styles.line} />
        </View>
    );

    const navigateToWorkoutDetail = () => {
        if (selectedDay) {
            let day = selectedDay
            navigation.navigate('WorkoutDetail', { day: day });
            setSelectedDay(null);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={workoutData}
                renderItem={renderSplit}
                keyExtractor={(item, index) => `split-${index}`}
                contentContainerStyle={styles.verticalFlatListContent}
                showsVerticalScrollIndicator={false}
            />

            <Modal
                visible={!!selectedDay}
                animationType="slide"
                onRequestClose={() => setSelectedDay(null)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{selectedDay?.dayName}</Text>
                        <Button title="Close" onPress={() => setSelectedDay(null)} />
                    </View>
                    <View style={styles.modalBody}>
                        {selectedDay?.exercises.map(renderExercise)}
                        <Button
                            title="Start Workout"
                            onPress={navigateToWorkoutDetail}
                            color="green"
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    splitContainer: {
        marginBottom: 20,
        alignItems: 'flex-start',
        marginHorizontal: 10,
    },
    splitTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 15,
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
        fontSize: 14,
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
    modalContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    modalBody: {
        flex: 1,
    },
});

export default WorkoutScreen;
