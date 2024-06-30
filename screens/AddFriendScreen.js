import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from "./ThemeProvider";
import { Ionicons } from "@expo/vector-icons";


const { height, width } = Dimensions.get('window');

const AddFriendScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Ionicons name="arrow-back" onPress={() => navigation.goBack()} size={getResponsiveFontSize(25)} color={theme.textColor} style={styles.backIcon}/>
                <Text style={styles.header}>Add Friends</Text>
            </View>
        </View>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};


const createStyles = (theme) => StyleSheet.create({    
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
    },
    headerContainer: {
        marginTop: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        right: width*0.25
    },
    header: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(26),
        fontWeight: '800',
        left: -0.03*width
    },
  
    
});

export default AddFriendScreen;
