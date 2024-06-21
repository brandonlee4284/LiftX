import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from "../../ThemeProvider";


const { height, width } = Dimensions.get('window');

export function Footer(props) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handlePress = () => {
      navigation.navigate(props.whenClicked);
  };

  return (
    <View style={styles.container}>
        <Text style={styles.msg}>
            {props.msg}
        </Text>
        <TouchableOpacity onPress={handlePress}>
            <Text style={styles.buttonText}>{props.button}</Text>
        </TouchableOpacity>
    </View>
  );
}


const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({    
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    msg: {
        color: theme.textColor,
        fontFamily: 'Outfit',
        fontSize: getResponsiveFontSize(12),
        fontStyle: 'normal',
    },
    buttonText: {
        color: theme.primaryColor,
        fontFamily: 'Outfit',
        fontSize: getResponsiveFontSize(12),
        fontStyle: 'normal',
        marginLeft: 4,
    }
    
  
});

export default Footer;