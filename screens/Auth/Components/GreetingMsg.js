import {View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { useTheme } from "../../ThemeProvider";
import x_logo from './Images/X_logo.png';


const { height, width } = Dimensions.get('window');

export function GreetingMsg(props) {
  const words = props.msg ? props.msg.split(' ') : [];
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.lift}>
        Lift<Image source={x_logo} style={styles.x} />
      </Text>

      <View>
        {words.map((word, index) => (
          <Text key={index} style={styles.msg}>
            {word}
          </Text>
        ))}
      </View>
    </View>
  );
}

const getResponsiveFontSize = (baseFontSize) => {
  const scale = width / 425; 
  return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({    
  container: {
    flex: 1,
    marginTop: 75,
    marginLeft: 17
  },
  lift: {
    color: theme.textColor,
    fontFamily: 'Outfit',
    fontSize: getResponsiveFontSize(38),
    fontStyle: 'normal',
    fontWeight: '700',
  },
  x: {
    height: getResponsiveFontSize(38),
    width: getResponsiveFontSize(38)
  },
  msg: {
    color: theme.textColor,
    fontFamily: 'Outfit',
    fontSize: getResponsiveFontSize(48),
    fontStyle: 'normal',
    fontWeight: '900',
    textAlign: 'left',
  }
});

export default GreetingMsg;