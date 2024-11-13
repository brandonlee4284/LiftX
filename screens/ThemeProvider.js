import React, { createContext, useContext, useState } from 'react';
import { useFonts } from 'expo-font';
import { ActivityIndicator } from 'react-native';

// Create a context for the theme
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
    const [fontsLoaded] = useFonts({
        OutfitRegular: require('../assets/fonts/Outfit-Regular.ttf'),
        OutfitBold: require('../assets/fonts/Outfit-Bold.ttf'),
        OutfitExtraBold: require('../assets/fonts/Outfit-ExtraBold.ttf'),
        OutfitMedium: require('../assets/fonts/Outfit-Medium.ttf'),
        OutfitLight: require('../assets/fonts/Outfit-Light.ttf'),
        OutfitExtraLight: require('../assets/fonts/Outfit-ExtraLight.ttf'),
        OutfitSemiBold: require('../assets/fonts/Outfit-SemiBold.ttf'),
        OutfitThin: require('../assets/fonts/Outfit-Thin.ttf'),
        OutfitBlack: require('../assets/fonts/Outfit-Black.ttf'),
    });

    const [theme, setTheme] = useState({
        primaryColor: "#90BEDF",
        backgroundColor: "#04080B",
        textColor: "#E1EDF4",
        grayTextColor: "#87969F",
        inputBackgroundColor: "#1E1E1E",
        placeholderTextColor: "#E1EDF4",
        errorColor: "#E9446A",
        backdropColor: "#09141B",
        navbarColor: "#151616",
        dangerColor: "rgb(114, 47, 55)",
        positiveColor: '#50C878',
        negativeColor: '#D22B2B',
        warningColor: 'rgb(225, 193, 110)',
        fontRegular: "OutfitRegular",
        fontBold: "OutfitBold",
        fontExtraBold: "OutfitExtraBold",
        fontLight: "OutfitLight",
        fontExtraLight: "OutfitExtraLight",
        fontMedium: "OutfitMedium",
        fontSemiBold: "OutfitSemiBold",
        fontBlack: "OutfitBlack",
        fontThin: "OutfitThin",

    });

    if (!fontsLoaded) {
        return <ActivityIndicator size="small" color="#90BEDF" />;
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use the theme
export const useTheme = () => useContext(ThemeContext);