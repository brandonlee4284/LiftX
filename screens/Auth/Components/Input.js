import {View, Text, StyleSheet, Dimensions, TextInput } from 'react-native';
import { useTheme } from "../../ThemeProvider";

const { height, width } = Dimensions.get('window');

export function Input(props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const getPropsByMode = (mode) => {
    switch (mode) {
      case 'email':
        return {
          placeholder: 'Email',
          onChangeText: props.onChangeText,
          value: props.value,
          secureTextEntry: false,
          autoCapitalize: 'none'
        };
      case 'password':
        return {
          placeholder: 'Password',
          onChangeText: props.onChangeText,
          value: props.value,
          secureTextEntry: true,
          autoCapitalize: 'none'
        };
      case 'username':
        return {
          placeholder: 'Username',
          onChangeText: props.onChangeText,
          value: props.value,
          secureTextEntry: false,
          autoCapitalize: 'none'
        };
      default:
        return {};
    }
  };

  const inputProps = getPropsByMode(props.mode);
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { backgroundColor: props.backgroundColor }]}
        placeholderTextColor={theme.textColor}
        {...inputProps}
      />
    </View>
  );
}

const getResponsiveFontSize = (baseFontSize) => {
  const scale = width / 425; 
  return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({    
  container: {
    marginBottom: 25,
  },
  input: {
    height: height* 0.064, 
    width: width * 0.7, 
    borderRadius: 15, 
    paddingHorizontal: 30, 
    fontSize: getResponsiveFontSize(16), 
    color: theme.textColor, 
    elevation: 2, 
  }
  
  
});

export default Input;