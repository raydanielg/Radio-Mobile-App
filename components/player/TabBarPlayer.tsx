import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors } from '@/constants/theme';
import { usePlayerContext } from '@/contexts/PlayerContext';
import WaveformVisualizer from './WaveformVisualizer';

export default function TabBarPlayer() {
  const { 
    currentStation, 
    isPlaying, 
    isBuffering,
    togglePlayPause, 
    stopPlayback,
    audioData
  } = usePlayerContext();
  
  const translateY = useRef(new Animated.Value(100)).current;
  
  useEffect(() => {
    if (currentStation) {
      // Slide up animation
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }).start();
    } else {
      // Slide down animation
      Animated.spring(translateY, {
        toValue: 100,
        useNativeDriver: true,
        friction: 8,
      }).start();
    }
  }, [currentStation, translateY]);
  
  if (!currentStation) return null;
  
  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY }] }
      ]}
    >
      <BlurView intensity={30} style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={[colors.gradientPrimary[0], colors.gradientPrimary[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </BlurView>
      
      <WaveformVisualizer audioData={audioData} height={30} />
      
      <View style={styles.playerContent}>
        <View style={styles.stationInfo}>
          <Text numberOfLines={1} style={styles.stationName}>
            {currentStation.name}
          </Text>
          <Text numberOfLines={1} style={styles.stationDetail}>
            {currentStation.tags?.split(',')[0] || 'Radio Station'}
          </Text>
        </View>
        
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton}>
            <SkipBack size={18} color={colors.textPrimary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.playButton}
            onPress={togglePlayPause}
          >
            {isBuffering ? (
              <View style={styles.loadingIndicator} />
            ) : isPlaying ? (
              <Pause size={22} color={colors.textPrimary} />
            ) : (
              <Play size={22} color={colors.textPrimary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton}>
            <SkipForward size={18} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={stopPlayback}
        >
          <X size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 70,
    left: 10,
    right: 10,
    height: 70,
    borderRadius: 16,
    overflow: 'hidden',
    zIndex: 999,
  },
  playerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: '100%',
  },
  stationInfo: {
    flex: 1,
    marginRight: 10,
  },
  stationName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  stationDetail: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  loadingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.textPrimary,
    borderTopColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
});