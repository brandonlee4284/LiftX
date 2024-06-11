import React, { useState, useEffect, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { View, Text, FlatList, Modal, TouchableOpacity, TouchableWithoutFeedback, Button, StyleSheet, Dimensions, TextInput, ScrollView } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Carousel from 'react-native-reanimated-carousel';
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
    const [selectedSplit, setSelectedSplit] = useState(null);
    const [currentOffset, setCurrentOffset] = useState(0);
    const isFocused = useIsFocused();
    const flatListRef = useRef(null);

    useEffect(() => {
        if (isFocused) {
            // Hide the header and tab bar when the screen is focused
            navigation.setOptions({ headerShown: false });
            navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
        } else {
            // Get the navigation state to determine the previous screen
            const state = navigation.getState();
            const routes = state.routes;
            const previousRoute = routes[routes.length - 2]?.name;

            if (previousRoute === 'Home') {
                // Show the tab bar if navigating back to the Home screen
                navigation.getParent()?.setOptions({
                    tabBarStyle: {
                        display: 'flex',
                        backgroundColor: '#121212',
                        borderTopWidth: 0,
                    },
                    tabBarActiveTintColor: 'white',
                    tabBarInactiveTintColor: 'gray',
                    tabBarShowLabel: false,
                });
            } else if (previousRoute === 'StartWorkout') {
                // Keep the tab bar hidden if navigating to the StartWorkout screen
                navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
            }
        }
    }, [isFocused, navigation]);
    
    useEffect(() => {
        async function fetchData() {
            const data = await fetchPrivateUserSplits();
            console.log("Fetched workout data:", data);
            if (data && Array.isArray(data)) {
                const initializedData = data.map(split => ({
                    ...split,
                    days: split.days || [],
                }));
                setWorkoutData(initializedData);
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


    const scrollDown = () => {
        const newOffset = currentOffset + 500;
        flatListRef.current?.scrollToOffset({
            offset: newOffset, // Adjust this value to scroll by a certain amount
            animated: true,
        });
        setCurrentOffset(newOffset);
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
        if (!selectedSplit) return;
    
        const updatedWorkoutData = workoutData.map(split => {
            if (split.splitName === selectedSplit) {
                return {
                    ...split,
                    days: [...split.days, {
                        dayName: newSplit.dayName,
                        exercises: newSplit.exercises.map(exercise => ({
                            ...exercise,
                            reps: exercise.reps || [],
                            weight: exercise.weight || [],
                        })),
                    }]
                };
            }
            return split;
        });
    
        const updatedWorkoutDataForStorage = {
            splits: convert3DArrayToSplits(updatedWorkoutData),
        };
    
        try {
            await updatePrivateUserSplits(updatedWorkoutDataForStorage, true);
            setWorkoutData(updatedWorkoutData);
            setIsAddSplitModalVisible(false);
            setNewSplit({ dayName: '', exercises: [] });
            setSelectedSplit(null); // Reset selectedSplit after adding the day
        } catch (error) {
            console.error('Error adding new split: ', error);
        }
    };
    

    const handleEditExerciseChange = (exercise, repIndex, key, value) => {
        const updatedExercises = selectedExercises.map((ex) => {
            if (ex.name === exercise.name && repIndex === null) {
                return { ...ex, [key]: value };
            }
            if (ex.name === exercise.name) {
                const updatedReps = key === 'reps' ? [...ex.reps] : ex.reps;
                const updatedWeights = key === 'weight' ? [...ex.weight] : ex.weight;
    
                if (key === 'reps') {
                    if (value === '') {
                        updatedReps[repIndex] = '';
                    } else {
                        updatedReps[repIndex] = parseInt(value, 10);
                    }
                }
    
                if (key === 'weight') {
                    if (value === '') {
                        updatedWeights[repIndex] = '';
                    } else {
                        updatedWeights[repIndex] = parseInt(value, 10);
                    }
                }
    
                return { ...ex, reps: updatedReps, weight: updatedWeights, sets: updatedReps.length };
            }
            return ex;
        });
        setSelectedExercises(updatedExercises);
    };

    const addSet = (exercise) => {
        const updatedExercises = selectedExercises.map((ex) => {
            if (ex.name === exercise.name) {
                return {
                    ...ex,
                    reps: [...ex.reps, ''],
                    weight: [...ex.weight, ''],
                };
            }
            return ex;
        });
        setSelectedExercises(updatedExercises);
    };

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

    const deleteSplit = async (splitName) => {
        const updatedWorkoutData = workoutData.filter(split => split.splitName !== splitName);
        const updatedWorkoutDataForStorage = {
            splits: convert3DArrayToSplits(updatedWorkoutData),
        };
    
        try {
            await updatePrivateUserSplits(updatedWorkoutDataForStorage, true);
            setWorkoutData(updatedWorkoutData);
        } catch (error) {
            console.error('Error deleting split: ', error);
        }
    };

    const navigateToStartWorkout = () => {
        if (selectedDay) {
            navigation.navigate('Start Workout', { day: selectedDay });
            setSelectedDay(null);
        }
    };

    const navigateToHome = () => {
        navigation.navigate('Home');
    };

    const handleEditModeToggle = async () => {
        if (editMode) {
            const updatedWorkoutData = workoutData.map(split => {
                if (split.days.some(day => day.dayName === selectedDay.dayName)) {
                    return {
                        ...split,
                        days: split.days.map(day => {
                            if (day.dayName === selectedDay.dayName) {
                                const updatedDay = { ...day, exercises: selectedExercises };
                                setSelectedDay(updatedDay)
                                return updatedDay;
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
            exercises: [...prevState.exercises, { name: '', sets: '', reps: [], weight: [] }],
        }));
    };

    const handleNewSplitChange = (value, index, key) => {
        setNewSplit(prevState => {
            const updatedExercises = prevState.exercises.map((exercise, idx) => {
                if (index === idx) {
                    let updatedExercise = { ...exercise };
    
                    switch (key) {
                        case 'sets':
                            updatedExercise.sets = parseInt(value, 10) || 0;
                            break;
                        case 'reps':
                            updatedExercise.repsDisplay = value;
                            updatedExercise.reps = Array(updatedExercise.sets).fill(value);
                            break;
                        case 'weight':
                            updatedExercise.weightDisplay = value;
                            updatedExercise.weight = Array(updatedExercise.sets).fill(value);
                            break;
                        default:
                            updatedExercise[key] = value;
                            break;
                    }
    
                    return updatedExercise;
                }
                return exercise;
            });
    
            return {
                ...prevState,
                exercises: updatedExercises,
            };
        });
    };

    
    const handleAddExerciseInEdit = () => {
        const newExercise = { name: '', sets: 1, reps: [], weight: [] };
        setSelectedExercises([...selectedExercises, newExercise]);
    };

        
    const renderExercise = (exercise, index) => {
        const minReps = Math.min(...exercise.reps);
        const maxReps = Math.max(...exercise.reps);
        const repsDisplay = minReps === maxReps ? minReps : `${minReps}-${maxReps}`;

        return (
            <View key={index} style={styles.exerciseCard}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseVolume}>{exercise.sets}x{repsDisplay}</Text>
            </View>
        );
    };




    const renderAddExerciseButton = () => (
        editMode && (
            <TouchableOpacity onPress={handleAddExerciseInEdit} style={styles.addExerciseButton}>
                <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
            </TouchableOpacity>
        )
    );

    const renderExerciseInPopupView = ({ item, drag, isActive }) => (
        <ScaleDecorator>
            <TouchableOpacity
                onLongPress={drag}
                disabled={isActive}
                style={[
                    styles.exerciseCardPopup,
                    { backgroundColor: isActive ? "white" : "transparent" },
                ]}
            >
                <View style={styles.exercisePopupContainer}>
                    {editMode && (
                        <TextInput
                            key={`name-${item.name}-${item.sets}`}
                            style={styles.textInputEditSplit}
                            value={item.name}
                            onChangeText={(text) => handleEditExerciseChange(item, null, 'name', text)}
                            placeholder="Exercise Name"
                        />
                    )}
                    {(item.reps.length > 0 ? item.reps : ['']).map((rep, repIndex) => (
                        <View key={`rep-${repIndex}`} style={styles.exerciseRow}>
                            {editMode && (
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => deleteExerciseRow(item, repIndex)}
                                >
                                    <Text style={styles.deleteButtonText}>X</Text>
                                </TouchableOpacity>
                            )}
                            {/*<FontAwesome6 name="square-caret-right" size={getResponsiveFontSize(24)} color="black" style={styles.icon} />*/}
                            <Text style={styles.exerciseTextPopup}>        
                                {rep} x {item.name}  
                            </Text>
                            {editMode && (
                                <>
                                    <TextInput
                                        key={`rep-${item.name}-${repIndex}`}
                                        style={styles.textInputEditSplit}
                                        keyboardType="numeric"
                                        value={rep.toString()}
                                        onChangeText={(text) => handleEditExerciseChange(item, repIndex, 'reps', text)}
                                    />
                                    <TextInput
                                        key={`weight-${item.name}-${repIndex}`}
                                        style={styles.textInputEditSplit}
                                        keyboardType="numeric"
                                        value={(item.weight[repIndex] || '').toString()}
                                        onChangeText={(text) => handleEditExerciseChange(item, repIndex, 'weight', text)}
                                    />
                                </>
                            )}
                        </View>
                    ))}
                    {editMode && (
                        <TouchableOpacity onPress={() => addSet(item)} style={styles.addSetButton}>
                            <Text style={styles.addSetButtonText}>+ Add Set</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        </ScaleDecorator>
    );


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

    const [activeIndex, setActiveIndex] = useState({});

    const handleCarouselChange = (index, splitName) => {
        setActiveIndex((prevState) => ({
            ...prevState,
            [splitName]: index,
        }));
    };

    const renderDots = (splitName, item) => {
        const dotsCount = item.days.length + 1;
        const activeDotIndex = activeIndex[splitName] || 0;

        return (
            <View style={styles.dotsContainer}>
                {Array.from({ length: dotsCount }).map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            { backgroundColor: activeDotIndex === index ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.3)' },
                        ]}
                    />
                ))}
            </View>
        );
    };

    const renderSplit = ({ item }) => (
        <View style={styles.splitContainer}>
            <View style={styles.splitHeader}>
                <Text style={styles.splitTitle}>{item.splitName}</Text>
                <TouchableOpacity onPress={() => deleteSplit(item.splitName)} style={{marginRight:10, marginBottom: 30}}>
                    <Icon name="trash-outline" size={getResponsiveFontSize(24)} color="white" />
                </TouchableOpacity>
            </View>
            <Carousel
                loop={false}
                width={width}
                height={maxDayCardHeight}
                data={[...item.days, { isAddButton: true, splitName: item.splitName }]}
                renderItem={({ item }) => 
                    item.isAddButton ? (
                        <TouchableOpacity
                            style={[styles.dayCard, styles.addSplitCard, { minHeight: maxDayCardHeight }]}
                            onPress={() => {
                                setNewSplit({ dayName: '', exercises: [] });
                                setSelectedDay(null);
                                setSelectedSplit(item.splitName);
                                setIsAddSplitModalVisible(true);
                            }}
                        >
                            <Text style={styles.addSplitText}>+</Text>
                        </TouchableOpacity>
                    ) : (
                        renderDay({ item })
                    )
                }
                keyExtractor={(day, index) => `day-${index}`}
                onSnapToItem={(index) => handleCarouselChange(index, item.splitName)}
                style={styles.carousel}
            />
            {renderDots(item.splitName, item)}
            <View style={styles.line} />
        </View>
    );
   

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={workoutData}
                renderItem={renderSplit}
                keyExtractor={(item, index) => `split-${index}`}
                contentContainerStyle={styles.verticalFlatListContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                    <View style={styles.topBar}>
                        <TouchableOpacity onPress={navigateToHome}>
                            <Icon name="arrow-back-circle-outline" style={{ fontSize: getResponsiveFontSize(24), color: 'white', marginRight: 10 }} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Select a workout</Text>
                        <TouchableOpacity onPress={() => setIsNewSplitModalVisible(true)}>
                            <Icon name="add-circle-outline" style={{ fontSize: getResponsiveFontSize(24), color: 'white', marginRight: 10 }} />
                        </TouchableOpacity>
                    </View>
                )}
                onScroll={(event) => {
                    setCurrentOffset(event.nativeEvent.contentOffset.y);
                }}
            />
            <TouchableOpacity onPress={scrollDown} style={styles.scrollDownButton}>
                <Icon name="arrow-down-circle-outline" size={getResponsiveFontSize(36)} color="white" style={styles.scrollDownButton}/>
            </TouchableOpacity>

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
                                    <Text style={styles.modalTitle}>{selectedDay?.dayName?.toUpperCase()}</Text>
                                    <Button title={editMode ? "Save" : "Edit"} onPress={handleEditModeToggle} />
                                </View>
                                <View style={styles.modalBody}>
                                    <DraggableFlatList
                                        data={selectedExercises}
                                        onDragEnd={({ data }) => setSelectedExercises(data)}
                                        keyExtractor={(exercise, index) => `${exercise.name}-${index}`}
                                        renderItem={renderExerciseInPopupView}
                                        ListFooterComponent={renderAddExerciseButton}
                                        contentContainerStyle={styles.flatListContentContainer}
                                    />
                                </View>
                                <View style={styles.modalFooter}>
                                    {!!editMode && (
                                    <TouchableOpacity onPress={removeDay} style={styles.removeButton}>
                                        <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}>Remove {selectedDay?.dayName}</Text>
                                    </TouchableOpacity>
                                    )}
                                    {!editMode && (
                                        <TouchableOpacity onPress={navigateToStartWorkout} style={styles.startButton}>
                                            <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}>Start Workout</Text>
                                        </TouchableOpacity>
                                    )}
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
                                                keyboardType="numeric"
                                                value={exercise.repsDisplay || ''}
                                                onChangeText={value => handleNewSplitChange(value, index, 'reps')}
                                            />
                                            <Text> @ </Text>
                                            <TextInput
                                                style={[styles.input, styles.smallInput]}
                                                placeholder="Weight"
                                                keyboardType="numeric"
                                                value={exercise.weightDisplay || ''}
                                                onChangeText={value => handleNewSplitChange(value, index, 'weight')}
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
                            style={styles.textInputAddSplit}
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

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingTop: 70,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 15,
        marginBottom: 40,
    },
    title: {
        fontSize: getResponsiveFontSize(24),
        fontWeight: 'bold',
        color: 'white', // Light text color
    },
    splitContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    splitTitle: {
        fontSize: getResponsiveFontSize(24),
        fontWeight: 'bold',
        margin: 5,
        marginBottom: 30,
        color: 'white'
    },
    splitHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 15,
    },
    horizontalFlatListContent: {
        paddingHorizontal: 10,
    },
    dayCard: {
        alignItems: 'center',
        width: width * 0.9,  // Reduced width to 70% of the screen width
        backgroundColor: '#000',
        borderWidth: 0,
        borderRadius: 40,
        marginHorizontal: 20,  // Reduced margin
        padding: 5,  // Reduced padding to make the card more compact
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 }, // Shadow on all sides
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    
    dayText: {
        fontSize: getResponsiveFontSize(18),
        fontWeight: 'bold',
        marginVertical: 30,
        color: 'white'
    },
    exerciseCard: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%',
        paddingHorizontal: 40,
        paddingVertical: 5,
        marginBottom: 5,
    },
    exerciseName: {
        flex: 1,
        textAlign: 'left',
        fontSize: getResponsiveFontSize(16),
        color: '#fff',
        fontWeight: 'bold'
    },
    exerciseVolume: {
        flex: 1,
        textAlign: 'right',
        fontSize: getResponsiveFontSize(16),
        color: '#fff',
        fontWeight: 'bold'
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
    exerciseRowNotEdit: {
        flexDirection: 'row',
        justifyContent: 'left',
        alignItems: 'center',
        width: '100%',
    },
    exerciseTextPopup: {
        fontSize: getResponsiveFontSize(16),
        textAlign: 'left',
        fontWeight: 'bold'
    },
    exerciseList: {
        paddingBottom: 40,
    },
    verticalFlatListContent: {
        paddingVertical: 20,
    },
    line: {
        width: '100%',
        height: 1,
        marginTop: 40,
    },
    flatListContentContainer: {
        alignItems: 'center', // Center items horizontally
        justifyContent: 'center', // Center items vertically
        flexGrow: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 40,
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
        fontSize: getResponsiveFontSize(24),
        fontWeight: 'bold',
        marginTop: 10
    },
    modalBody: {
        flexGrow: 1,
        flexShrink: 1,
        paddingVertical: 10,
        
    },
    modalBodyCentered: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalFooter: {
        marginTop: 20,
    },
    removeButton: {
        fontSize: getResponsiveFontSize(16),
        color: 'white',
        marginTop: 10,
        marginBottom: 20,
        textAlign: 'center',
        backgroundColor: 'black',
        borderRadius: 20,
        padding: 20

    },
    deleteButton: {
        marginRight: 10,
    },
    startButton: {
        fontSize: getResponsiveFontSize(16),
        textAlign: 'center',
        backgroundColor: 'black',
        borderRadius: 20,
        padding: 20

    },
    deleteButtonText: {
        color: 'red',
        fontSize: getResponsiveFontSize(16),
    },
    addSplitCard: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.9,  // Reduced width to 70% of the screen width
        backgroundColor: '#000',
        borderWidth: 0,
        borderRadius: 40,
        marginHorizontal: 20,  // Reduced margin
        padding: 5,  // Reduced padding to make the card more compact
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 }, // Shadow on all sides
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    addSplitText: {
        fontSize: getResponsiveFontSize(30),
        fontWeight: 'bold',
        color: 'white',
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
        fontSize: getResponsiveFontSize(16),
    },
    textInputAddSplit: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: 200,
        textAlign: 'center',
        marginVertical: 30
    },
    textInputEditSplit: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: 50,
        textAlign: 'center',
        marginHorizontal: 10,
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
    addExerciseButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    addExerciseButtonText: {
        color: 'blue',
        fontSize: getResponsiveFontSize(16),
    },
    textInputEditSplit: {
        borderColor: 'gray',
        borderWidth: 1,
        margin: 5,
        padding: 5,
        borderRadius: 5,
    },
    exerciseListContainer: {
        padding: 10,
    },
    exerciseText: {
        fontSize: getResponsiveFontSize(16),
        color: 'white',
    },
    addExerciseButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    addExerciseButtonText: {
        color: 'blue',
        fontSize: getResponsiveFontSize(16),
    },
    addSetButton: {
        marginVertical: 5,
        alignSelf: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        padding: 5,
    },
    addSetButtonText: {
        color: '#007bff',
        fontSize: getResponsiveFontSize(16),
    },
    carousel: {
        paddingVertical: 10,
        justifyContent: 'center'
    },
    scrollDownButton: {
        position: 'absolute',
        bottom: 10,
        right: 9,
        padding: 10,
        borderRadius: 30,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    dot: {
        width: getResponsiveFontSize(8),
        height: getResponsiveFontSize(8),
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.3)', // Default inactive dot color
    },
    icon: {
        margin: 10
    },
});
