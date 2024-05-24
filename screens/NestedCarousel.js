import * as React from "react";
import { View, Pressable, StyleSheet, Dimensions, Text, FlatList } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const PAGE_WIDTH = 120;  // Adjusted for card width
const PAGE_HEIGHT = 60;  // Adjusted for card height
const SPLITS = [
  { id: '1', title: 'Upper Lower', days: ['Upper', 'Lower'] },
  { id: '2', title: 'PPL', days: ['Push', 'Pull', 'Legs'] },
  { id: '3', title: 'PPL Arnold', days: ['Chest', 'Back', 'Shoulders'] },
]; // Example splits and days

const CardCarousel = () => {
  const [selectedSplitIndex, setSelectedSplitIndex] = React.useState(0);

  const renderItem = ({ item, index }) => (
    <SplitCard
      item={item}
      index={index}
      isSelected={index === selectedSplitIndex}
      onPress={() => setSelectedSplitIndex(index)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={SPLITS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const SplitCard = ({ item, index, isSelected, onPress }) => {
  const translateY = useSharedValue(0);
  const carouselRef = React.useRef(null);

  const containerStyle = useAnimatedStyle(() => {
    const scale = withTiming(isSelected ? 1 : 0.8, { duration: 250 });
    const opacity = withTiming(isSelected ? 1 : 0.5, { duration: 250 });
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.card, containerStyle]}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {isSelected && (
          <Carousel
            ref={carouselRef}
            loop={false}
            style={styles.carousel}
            width={PAGE_WIDTH}
            height={PAGE_HEIGHT}
            data={item.days}
            renderItem={({ item }) => (
              <View style={styles.carouselItem}>
                <Text style={styles.carouselItemText}>{item}</Text>
              </View>
            )}
          />
        )}
      </Animated.View>
    </Pressable>
  );
};

export default CardCarousel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatListContainer: {
    paddingVertical: 20,
  },
  card: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.2,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  carousel: {
    width: windowWidth * 0.8,
    height: PAGE_HEIGHT,
  },
  carouselItem: {
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  carouselItemText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
