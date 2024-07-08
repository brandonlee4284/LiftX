import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Text } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { useTheme } from "../ThemeProvider";

const { width } = Dimensions.get('window');

const AnimatedProgressBar = ({ progress, color, maxValue = 1000 }) => {
    const widthAnim = useRef(new Animated.Value(0)).current;
    const { theme } = useTheme();
    const styles = createStyles(theme);

    useEffect(() => {
        Animated.timing(widthAnim, {
            toValue: (progress / maxValue) * width * 0.7,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    return (
        <View style={styles.progressBarWrapper}>
            <View style={styles.progressBarContainer}>
                <Animated.View
                    style={[
                        styles.progressBarFill,
                        {
                            width: widthAnim,
                            backgroundColor: color,
                        },
                    ]}
                />
            </View>
            <Text style={styles.progressText}>{`${(progress).toFixed(2)}/1000`}</Text>
        </View>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425;
    return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({
    progressBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBarContainer: {
        height: width * 0.015,
        width: '75%',
        backgroundColor: theme.textColor,
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 10,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 10,
    },
    progressText: {
        marginLeft: 10,
        fontSize: getResponsiveFontSize(12),
        color: theme.textColor,
        marginTop: 7,
    },
});

export default AnimatedProgressBar;