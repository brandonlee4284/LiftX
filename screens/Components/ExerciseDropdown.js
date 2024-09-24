import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Modal, Dimensions, TextInput } from 'react-native';
import { useTheme } from "../ThemeProvider";
import exerciseData from '../../exercise_data.json';

const { width, height } = Dimensions.get('window');

const ExerciseDropdown = ({ value, onChangeText }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [query, setQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState('All');

    useEffect(() => {
        filterExercises(query, selectedGroup);
    }, [query, selectedGroup]);

    const filterExercises = (query, group) => {
        let results = Object.keys(exerciseData);

        // Filter by muscle group if selected
        if (group !== 'All') {
            results = results.filter(exercise => exerciseData[exercise].group === group);
        }

        // Filter by query text
        results = results.filter(exercise => exercise.toLowerCase().includes(query.toLowerCase()));

        // Add custom search term if not already in the list
        if (query && !results.includes(query)) {
            results.push(query); // Add the custom query term at the end
        }

        setFilteredData(results);
    };

    const handleSelect = (item) => {
        onChangeText(item);
        setShowModal(false);
        setQuery('');
        setSelectedGroup('All');
    };

    const handleGroupPress = (group) => {
        setSelectedGroup(group);
    };

    const renderGroupButtons = () => {
        const groups = ['Chest', 'Arms', 'Shoulders', 'Legs', 'Back', 'All'];
        return (
            <View style={styles.buttonContainer}>
                {groups.map((group) => (
                    <TouchableOpacity
                        key={group}
                        style={[
                            styles.groupButton,
                            selectedGroup === group && styles.selectedGroupButton,
                        ]}
                        onPress={() => handleGroupPress(group)}
                    >
                        <Text style={styles.groupButtonText}>{group}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setShowModal(true)} style={styles.touchable}>
                <Text style={styles.selectedText}>{value || 'Select an exercise'}</Text>
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowModal(false)}
                        >
                            <Text style={styles.closeButtonText}>close</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.modalInput}
                            value={query}
                            onChangeText={(text) => setQuery(text)}
                            placeholder="Search exercises"
                            placeholderTextColor={theme.grayTextColor}
                        />
                        {renderGroupButtons()}
                        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                            {filteredData.map((item, index) => (
                                <TouchableOpacity key={index} onPress={() => handleSelect(item)} style={styles.item}>
                                    <Text style={styles.itemText}>{item}</Text>
                                    <Text style={styles.groupText}>
                                        {exerciseData[item]?.group || 'Custom'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const createStyles = (theme) => StyleSheet.create({
    container: {
        width: '100%',
    },
    touchable: {
        padding: getResponsiveFontSize(8),
        backgroundColor: theme.backgroundColor,
        borderRadius: 10,
        width: '90%',
        borderWidth: 2,
        borderColor: theme.textColor
    },
    selectedText: {
        fontSize: getResponsiveFontSize(16),
        color: theme.textColor,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: theme.backdropColor,
        borderRadius: 10,
        padding: 0,
        alignItems: 'center',
    },
    modalInput: {
        fontSize: getResponsiveFontSize(16),
        color: theme.textColor,
        marginBottom: 10,
        borderColor: theme.textColor,
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        width: width * 0.8,
        marginTop: 50
    },
    scrollView: {
        maxHeight: height * 0.55,
        marginBottom: 0,
    },
    item: {
        paddingHorizontal: getResponsiveFontSize(10),
        paddingVertical: getResponsiveFontSize(20),
        borderBottomWidth: 1,
        borderBottomColor: theme.grayTextColor,
        width: width * 0.8
    },
    itemText: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(16),
        fontWeight: '700',
    },
    closeButton: {
        position: 'absolute',
        top: width * 0.04,
        right: width * 0.06,
        zIndex: 1,
    },
    closeButtonText: {
        fontSize: getResponsiveFontSize(16),
        color: theme.grayTextColor,
    },
    groupText: {
        color: theme.grayTextColor,
        fontSize: getResponsiveFontSize(14),
        marginTop: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 10,
    },
    groupButton: {
        backgroundColor: theme.backdropColor,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        margin: 5,
        minWidth: width * 0.25,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.textColor
    },
    selectedGroupButton: {
        backgroundColor: theme.primaryColor,
    },
    groupButtonText: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(14),
    },
});

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425;
    return Math.round(baseFontSize * scale);
};

export default ExerciseDropdown;