import React, { createContext, useContext, useState } from 'react';

// Create a context for the theme
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState({
        primaryColor: "#90BEDF",
        backgroundColor: "#04080B",
        textColor: "#E1EDF4",
        inputBackgroundColor: "#1E1E1E",
        placeholderTextColor: "#E1EDF4",
        errorColor: "#E9446A",
        backdropColor: "#0B171E"
    });

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use the theme
export const useTheme = () => useContext(ThemeContext);