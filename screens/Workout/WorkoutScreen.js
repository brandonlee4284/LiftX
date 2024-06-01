import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Modal, TouchableOpacity, TouchableWithoutFeedback, Button, StyleSheet, Dimensions, TextInput, ScrollView } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';

import { fetchPrivateUserSplits, updatePrivateUserSplits, convert3DArrayToSplits } from '../../api/userData';

const { height, width } = Dimensions.get('window');

const WorkoutScreen = ({ navigation }) => {
    const [workoutData, setWorkoutData] = useState([]);
    const [maxDayCardHeight, setMaxDayCardHeight] = useState(0);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [isAddSplitModalVisible, setIsAddSplitModalVisible] = useState(false);
    const [newSplit, setNewSplit] = useState({ dayName: '', exercises: [] });
    const [isNewSplitModalVisible, setIsNewSplitModalVisible] = useState(false);
    const [newSplitName, setNewSplitName] = useState('');

    useEffect(() => {
        async function fetchData() {
            const data = await fetchPrivateUserSplits();
            console.log("Fetched workout data:", data);
            if (data && Array.isArray(data)) {
                setWorkoutData(data);
            } else {
                console.error("Invalid data structure:", data);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedDay) {
            setSelectedExercises(selectedDay.exercises);
        }
    }, [selectedDay]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => setIsNewSplitModalVisible(true)} style={{ marginRight: 25 }}>
                    <Text style={{ fontSize: 26, color: '#000' }}>+</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const renderExercise = (exercise, index) => {
        const minReps = Math.min(...exercise.reps);
        const maxReps = Math.max(...exercise.reps);
        const repsDisplay = minReps === maxReps ? minReps : `${minReps}-${maxReps}`;

        return (
            <View key={index} style={styles.exerciseCard}>
                <Text style={styles.exerciseText}>
                    {exercise.name} {exercise.sets}x{repsDisplay}
                </Text>
            </View>
        );
    };

    
    const handleSaveNewSplitModal = async () => {
        const updatedWorkoutData = [...workoutData, { splitName: newSplitName, days: [] }];
    
        const updatedWorkoutDataForStorage = {
            splits: convert3DArrayToSplits(updatedWorkoutData),
        };
    
        try {
            await updatePrivateUserSplits(updatedWorkoutDataForStorage, true);
            setWorkoutData(updatedWorkoutData);
            setIsNewSplitModalVisible(false);
        } catch (error) {
            console.error('Error adding new split: ', error);
        }
    };

    const handleSaveNewSplit = async () => {
        
    };

    const renderExerciseInPopupView = ({ item, drag, isActive }) => (
        <ScaleDecorator>
            <TouchableOpacity
                onLongPress={drag}
                disabled={isActive}
                style={[
                    styles.exerciseCardPopup,
                    { backgroundColor: isActive ? "red" : "transparent" },
                ]}
            >
                <View style={styles.exercisePopupContainer}>
                    {item.reps.map((rep, repIndex) => (
                        <View key={repIndex} style={styles.exerciseRow}>
                            <Text style={styles.exerciseTextPopup}>
                                {item.name} {rep} @ {item.weight[repIndex]} lbs
                            </Text>
                            {editMode && (
                                <>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => deleteExerciseRow(item, repIndex)}
                                    >
                                        <Text style={styles.deleteButtonText}>X</Text>
                                    </TouchableOpacity>

                                    <TextInput
                                        style={styles.textInput}
                                        keyboardType="numeric"
                                    />
                                    <TextInput
                                        style={styles.textInput}
                                        keyboardType="numeric"
                                    />
                                </>
                            )}
                        </View>
                    ))}
                </View>
            </TouchableOpacity>
        </ScaleDecorator>
    );

    const deleteExerciseRow = (exercise, repIndex) => {
        const updatedExercises = selectedExercises.map((ex) => {
            if (ex.name === exercise.name) {
                const updatedReps = ex.reps.filter((_, index) => index !== repIndex);
                const updatedWeights = ex.weight.filter((_, index) => index !== repIndex);
                return { ...ex, reps: updatedReps, weight: updatedWeights, sets: updatedReps.length };
            }
            return ex;
        }).filter((ex) => ex.reps.length > 0);
        setSelectedExercises(updatedExercises);
    };

    const renderDay = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                setSelectedDay(item);
                setEditMode(false); // Always set edit mode to false when a day is selected
            }}
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
                data={[...item.days, { isAddButton: true }]} // Add a dummy item for the add button
                renderItem={({ item }) =>
                    item.isAddButton ? (
                        <TouchableOpacity
                            style={[styles.dayCard, styles.addSplitCard, { minHeight: maxDayCardHeight }]}
                            onPress={() => setIsAddSplitModalVisible(true)}
                        >
                            <Text style={styles.addSplitText}>+</Text>
                        </TouchableOpacity>
                    ) : (
                        renderDay({ item })
                    )
                }
                keyExtractor={(day, index) => `day-${index}`}
                contentContainerStyle={styles.horizontalFlatListContent}
                showsHorizontalScrollIndicator={false}
            />
            <View style={styles.line} />
        </View>
    );

    const navigateToStartWorkout = () => {
        if (selectedDay) {
            navigation.navigate('Start Workout', { day: selectedDay });
            setSelectedDay(null);
        }
    };

    const handleEditModeToggle = async () => {
        if (editMode) {
            const updatedWorkoutData = workoutData.map(split => {
                if (split.days.some(day => day.dayName === selectedDay.dayName)) {
                    return {
                        ...split,
                        days: split.days.map(day => {
                            if (day.dayName === selectedDay.dayName) {
                                return { ...day, exercises: selectedExercises };
                            }
                            return day;
                        })
                    };
                }
                return split;
            });

            const updatedWorkoutDataForStorage = {
                splits: convert3DArrayToSplits(updatedWorkoutData),
            };

            try {
                await updatePrivateUserSplits(updatedWorkoutDataForStorage, true);
            } catch (error) {
                console.error('Error updating private user splits: ', error);
            }

            setWorkoutData(updatedWorkoutData);
        }
        setEditMode(!editMode);
    };

    const handleModalClose = () => {
        setSelectedDay(null);
        setEditMode(false); // Toggle edit mode when closing the modal
    };

    const removeDay = async () => {
        const updatedWorkoutData = workoutData.map(split => ({
            ...split,
            days: split.days.filter(day => day.dayName !== selectedDay.dayName)
        }));

        const updatedWorkoutDataForStorage = {
            splits: convert3DArrayToSplits(updatedWorkoutData),
        };

        try {
            await updatePrivateUserSplits(updatedWorkoutDataForStorage, true);
            setWorkoutData(updatedWorkoutData);
            handleModalClose();
        } catch (error) {
            console.error('Error removing day: ', error);
        }
    };

    const handleAddExerciseRow = () => {
        setNewSplit(prevState => ({
            ...prevState,
            exercises: [...prevState.exercises, { name: '', sets: '', reps: '', weight: '' }]
        }));
    };

    const handleNewSplitChange = (value, index, key) => {
        const updatedExercises = newSplit.exercises.map((exercise, idx) => {
            if (index === idx) {
                return { ...exercise, [key]: value };
            }
            return exercise;
        });

        setNewSplit(prevState => ({
            ...prevState,
            exercises: updatedExercises
        }));
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
                visible={selectedDay !== null}
                animationType="fade"
                transparent={true}
                onRequestClose={handleModalClose}
            >
                <TouchableWithoutFeedback onPress={handleModalClose}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContainer}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>{selectedDay?.dayName}</Text>
                                    <Button title={editMode ? "Done" : "Edit"} onPress={handleEditModeToggle} />
                                </View>
                                <View style={styles.modalBody}>
                                    <DraggableFlatList
                                        data={selectedExercises}
                                        onDragEnd={({ data }) => setSelectedExercises(data)}
                                        keyExtractor={(exercise, index) => `${exercise.name}-${index}`}
                                        renderItem={renderExerciseInPopupView}
                                        contentContainerStyle={styles.popupExerciseList}
                                    />
                                    <TouchableOpacity onPress={removeDay}>
                                        <Text style={styles.removeButton}>Remove {selectedDay?.dayName}</Text>
                                    </TouchableOpacity>
                                    <Button
                                        title="Start Workout"
                                        onPress={navigateToStartWorkout}
                                        color="green"
                                    />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <Modal
                visible={isAddSplitModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setIsAddSplitModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setIsAddSplitModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContainer}>
                                <ScrollView contentContainerStyle={styles.modalBodyCentered}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Day Name"
                                        value={newSplit.dayName}
                                        onChangeText={(text) => setNewSplit({ ...newSplit, dayName: text })}
                                    />
                                    {newSplit.exercises.map((exercise, index) => (
                                        <View key={index} style={styles.exerciseInputRowCentered}>
                                            <TextInput
                                                style={[styles.input, styles.smallInput]}
                                                placeholder="Name"
                                                value={exercise.name}
                                                onChangeText={(text) => handleNewSplitChange(text, index, 'name')}
                                            />
                                            <TextInput
                                                style={[styles.input, styles.smallInput]}
                                                placeholder="Sets"
                                                value={exercise.sets}
                                                keyboardType="numeric"
                                                onChangeText={(text) => handleNewSplitChange(text, index, 'sets')}
                                            />
                                            <Text> X </Text>
                                            <TextInput
                                                style={[styles.input, styles.smallInput]}
                                                placeholder="Reps"
                                                value={exercise.reps}
                                                keyboardType="numeric"
                                                onChangeText={(text) => handleNewSplitChange(text, index, 'reps')}
                                            />
                                            <Text> @ </Text>
                                            <TextInput
                                                style={[styles.input, styles.smallInput]}
                                                placeholder="Weight"
                                                value={exercise.weight}
                                                keyboardType="numeric"
                                                onChangeText={(text) => handleNewSplitChange(text, index, 'weight')}
                                            />
                                        </View>
                                    ))}
                                    <TouchableOpacity onPress={handleAddExerciseRow} style={styles.addExerciseButton}>
                                        <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
                                    </TouchableOpacity>
                                    <Button
                                        title="Save"
                                        onPress={handleSaveNewSplit}
                                        color="blue"
                                    />
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <Modal
                visible={isNewSplitModalVisible}
                animationType="fade"
                onRequestClose={() => setIsNewSplitModalVisible(false)}
                transparent={true}
            >
                <View style={styles.addSplitModalContainer}>
                    <TouchableWithoutFeedback onPress={() => setIsNewSplitModalVisible(false)}>
                        <View style={styles.overlay} />
                    </TouchableWithoutFeedback>
                    <View style={styles.addSplitModalContent}>
                        <Text style={styles.modalTitle}>Add New Split</Text>
                        <TextInput
                            style={styles.textInput}
                            value={newSplitName}
                            onChangeText={setNewSplitName}
                        />
                        <Button title="Save" onPress={handleSaveNewSplitModal} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default WorkoutScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    splitContainer: {
        marginBottom: 20,
        alignItems: 'flex-start',
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
        backgroundColor: '#fff',
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
    exerciseCardPopup: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: '100%',
        paddingHorizontal: 5,
        marginBottom: 5,
    },
    exercisePopupContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: '100%',
    },
    exerciseRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    exerciseText: {
        fontSize: 14,
    },
    exerciseTextPopup: {
        fontSize: 16,
        textAlign: 'left',
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxHeight: '80%',
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
        flexGrow: 1,
    },
    modalBodyCentered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButton: {
        fontSize: 16,
        color: 'red',
        marginTop: 10,
        marginBottom: 20,
        textAlign: 'center',
    },
    deleteButton: {
        marginLeft: 10,
    },
    deleteButtonText: {
        color: 'red',
        fontSize: 16,
    },
    addSplitCard: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.30,
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 10,
        marginHorizontal: 5,
        padding: 10,
    },
    addSplitText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        width: '100%',
    },
    exerciseInputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    exerciseInputRowCentered: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginVertical: 5,
    },
    smallInput: {
        width: '20%',
        textAlign: 'center',
    },
    addExerciseButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    addExerciseButtonText: {
        color: 'blue',
        fontSize: 16,
    },
    textInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: 200,
        textAlign: 'center',
        marginVertical: 30
    },
    addSplitModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addSplitModalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});
