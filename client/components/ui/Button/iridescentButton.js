import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const IridescentButton = ({ 
  onPress, 
  title, 
  colors = [
    '#0B0F3B', // Deep Space Blue
    '#152056', // Dark Indigo
    '#2541B2', // Vivid Blue
    '#3A6BFF', // Electric Blue
    '#6D3ACD', // Royal Purple
    '#B196EF', // Soft Purple
    '#D69E2E', // Golden Glow
    '#E0CFB1', // Soft Gold
],
  width: buttonWidth = 220,
  height: buttonHeight = 50
}) => {

    // Animated value for spark movement
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2500, // Controls the speed of the traveling spark
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Interpolate the spark effect
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-buttonWidth, buttonWidth], // Moves spark across the border
  });

  return (
    <View style={styles.container}>
      {/* Glowing Animated Border */}
      <View 
        style={[
          styles.glowingBorder, 
          { width: buttonWidth + 10, height: buttonHeight + 10, borderRadius: (buttonHeight + 10) / 2 }
        ]}
      >
        {/* Animated Spark Effect */}
        <Animated.View 
          style={[
            styles.sparkEffect, 
            { transform: [{ translateX }] }
          ]}
        >
          <LinearGradient
            colors={['transparent', 'white', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sparkGradient}
          />
        </Animated.View>
      </View>

      {/* Button */}
      <TouchableOpacity 
        onPress={onPress} 
        style={[styles.button, { height: buttonHeight, width: buttonWidth, borderRadius: buttonHeight / 2 }]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.buttonGradient}
        />

        {/* Glossy Overlay */}
        <View style={[styles.glossOverlay, { borderTopLeftRadius: buttonHeight / 2, borderTopRightRadius: buttonHeight / 2 }]} />
        
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowingBorder: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  sparkEffect: {
    position: 'absolute',
    width: 60, // Size of the traveling spark
    height: '100%',
    borderRadius: 30,
  },
  sparkGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    overflow: 'hidden',
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
    zIndex: 3,
  },
  glossOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    opacity: 0.7,
  },
});

export default IridescentButton;