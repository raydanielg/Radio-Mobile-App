import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Heart, Radio, Users, Music, Wifi } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RadioStation } from '@/api/radioApi';
import { colors, shadows } from '@/constants/theme';
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import { usePlayerContext } from '@/contexts/PlayerContext';
import { useEffect, useRef } from 'react';

interface FeaturedStationProps {
  station: RadioStation;
  onPress: () => void;
}

export default function FeaturedStation({ station, onPress }: FeaturedStationProps) {
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const { currentStation, isPlaying } = usePlayerContext();
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.1,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      })
    ]);

    Animated.loop(pulse).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true
    }).start();
  };
  
  const isActive = currentStation?.stationuuid === station.stationuuid && isPlaying;
  const isStationFavorite = isFavorite(station.stationuuid);
  
  const tag = station.tags?.split(',')[0] || '';
  const logoUrl = station.favicon && station.favicon !== '' 
    ? station.favicon 
    : 'https://placehold.co/800x400/8A2BE2/FFFFFF?text=Featured';
  
  const handleFavorite = (e: any) => {
    e.stopPropagation();
    toggleFavorite(station);
  };
  
  return (
    <Animated.View style={[
      styles.animationContainer,
      { transform: [{ scale: scaleAnim }] }
    ]}>
      <TouchableOpacity 
        style={[styles.container, isActive && styles.activeContainer]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <ImageBackground 
          source={{ uri: logoUrl }} 
          style={styles.background}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['transparent', 'rgba(12, 6, 32, 0.9)']}
            style={StyleSheet.absoluteFill}
          />
          
          <View style={styles.contentContainer}>
            <View style={styles.stationInfo}>
              <Text style={styles.name}>{station.name}</Text>
              
              <View style={styles.detailsRow}>
                {tag && (
                  <View style={styles.tagContainer}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                )}
                <Text style={styles.country}>{station.country}</Text>
              </View>
            </View>
            
            <View style={styles.statsContainer}>
              <Animated.View style={[
                styles.statItem,
                { transform: [{ scale: isActive ? pulseAnim : 1 }] }
              ]}>
                <Users size={14} color={colors.accent} />
                <Text style={styles.statText}>{station.clickcount} listeners</Text>
              </Animated.View>
              
              <View style={styles.statItem}>
                <Music size={14} color={colors.accent} />
                <Text style={styles.statText}>{station.codec}</Text>
              </View>
              
              <View style={styles.statItem}>
                <Wifi size={14} color={colors.accent} />
                <Text style={styles.statText}>{station.bitrate} kbps</Text>
              </View>
            </View>

            {station.has_extended_info && (
              <View style={styles.extendedInfo}>
                <Text style={styles.extendedInfoText}>
                  Extended information available
                </Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            style={[
              styles.favoriteButton,
              isStationFavorite && styles.activeFavoriteButton
            ]}
            onPress={handleFavorite}
          >
            <Heart 
              size={18} 
              color={isStationFavorite ? colors.favorite : colors.textPrimary}
              fill={isStationFavorite ? colors.favorite : 'transparent'}
            />
          </TouchableOpacity>
          
          {isActive && (
            <Animated.View style={[
              styles.playingIndicator,
              { transform: [{ scale: pulseAnim }] }
            ]}>
              <Radio size={14} color={colors.textPrimary} />
              <Text style={styles.playingText}>NOW PLAYING</Text>
            </Animated.View>
          )}
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    width: '100%',
  },
  container: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
    ...shadows.medium,
  },
  activeContainer: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  background: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    padding: 15,
  },
  stationInfo: {
    flex: 1,
  },
  name: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  country: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  tagContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(138, 43, 226, 0.3)',
    borderRadius: 12,
  },
  tagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.accent,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  extendedInfo: {
    marginTop: 8,
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    padding: 8,
    borderRadius: 8,
  },
  extendedInfoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.accent,
    textAlign: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFavoriteButton: {
    backgroundColor: 'rgba(255, 64, 129, 0.3)',
  },
  playingIndicator: {
    position: 'absolute',
    top: 15,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  playingText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    color: colors.textPrimary,
    marginLeft: 4,
  },
});