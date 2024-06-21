import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Text, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425;
    return Math.round(baseFontSize * scale);
};

const GradientText = ({ text, gradientColors, style }) => {
    const fontSize = getResponsiveFontSize(24); // base font size of 24
    const svgWidth = width - 90; // make svg width responsive

    return (
        <View style={styles.container}>
            <Svg height={fontSize + 10} width={svgWidth}>
                <Defs>
                    <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        {gradientColors.map((color, index) => (
                            <Stop
                                key={index}
                                offset={`${(index / (gradientColors.length - 1)) * 100}%`}
                                stopColor={color}
                                stopOpacity="1"
                            />
                        ))}
                    </LinearGradient>
                </Defs>
                <Text
                    fill="url(#grad)"
                    fontSize={fontSize}
                    fontWeight="800"
                    x="5%"
                    y="70%"
                >
                    {text}
                </Text>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default GradientText;