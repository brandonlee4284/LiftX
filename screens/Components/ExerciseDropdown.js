import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ScrollView, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useTheme } from "../ThemeProvider";
import exerciseData from '../../exercise_data.json';

const { width } = Dimensions.get('window');

const ExerciseDropdown = ({ value, onChangeText, filter }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [query, setQuery] = useState(value);
    const [filteredData, setFilteredData] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (query) {
            let results = Object.keys(exerciseData);

            if (filter) {
                results = results.filter(exercise => exerciseData[exercise].group === filter);
            }

            results = results.filter(exercise => exercise.toLowerCase().includes(query.toLowerCase()));
            setFilteredData(results);
        } else {
            setFilteredData([]);
            setShowDropdown(false); // Close dropdown if query is empty
        }
    }, [query, filter]);

    const handleSelect = (item) => {
        setQuery(item);
        onChangeText(item);
        setShowDropdown(false);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={query}
                onChangeText={(text) => {
                    setQuery(text);
                    onChangeText(text);
                    setShowDropdown(true);
                }}
                placeholder="exercise name"
                placeholderTextColor={theme.grayTextColor}
            />
            {showDropdown && filteredData.length > 0 && (
                <ScrollView style={styles.dropdown} showsVerticalScrollIndicator={false}>
                    {filteredData.map((item) => (
                        <TouchableOpacity key={item} onPress={() => handleSelect(item)} style={styles.item}>
                            <Text style={styles.itemText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

const createStyles = (theme) => StyleSheet.create({
    container: {
        width: '100%',
    },
    input: {
        fontSize: getResponsiveFontSize(16),
        color: theme.textColor,
        textDecorationLine: 'underline',
    },
    dropdown: {
        backgroundColor: theme.primaryColor,
        position: 'absolute',
        top: getResponsiveFontSize(26),
        width: '100%',
        maxHeight: getResponsiveFontSize(80),
        borderRadius: 10,
        zIndex: 999,
    },
    item: {
        padding: getResponsiveFontSize(10),
        borderBottomWidth: 1,
        borderBottomColor: theme.primaryColor,
    },
    itemText: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(16),
        fontWeight: '700'
    },
});

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425;
    return Math.round(baseFontSize * scale);
};

export default ExerciseDropdown;