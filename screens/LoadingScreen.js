import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const LoadingScreen = () => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    return (
        <View style={styles.container}>
            <ActivityIndicator />
        </View>
    );
};

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.backgroundColor
    }
});

export default LoadingScreen;
