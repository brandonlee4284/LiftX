import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from "../../ThemeProvider";


const { height, width } = Dimensions.get('window');

export function SignInButton(props) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handlePress = () => {
      navigation.navigate(props.whenClicked);
  };

  return (
      <TouchableOpacity style={styles.button} onPress={props.onPress}>
          <Text style={styles.buttonText}>{props.text}</Text>
      </TouchableOpacity>
  );
}


const getResponsiveFontSize = (baseFontSize) => {
  const scale = width / 425; 
  return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({    
  button: {
    height: height * 0.064,
    width: width * 0.51,
    borderRadius: 70,
    backgroundColor: theme.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
      color: theme.backgroundColor,
      fontSize: getResponsiveFontSize(16),
      fontWeight: 'bold',
  },
    
  
});

export default SignInButton;