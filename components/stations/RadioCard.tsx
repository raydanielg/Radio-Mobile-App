import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Radio } from 'lucide-react-native';
import { RadioStation } from '@/api/radioApi';
import { colors, shadows } from '@/constants/theme';
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import { usePlayerContext } from '@/contexts/PlayerContext';

interface RadioCardProps {
  station: RadioStation;
  onPress: () => void;
}

export default function RadioCard({ station, onPress }: RadioCardProps) {
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const { currentStation, isPlaying } = usePlayerContext();
  
  const isActive = currentStation?.stationuuid === station.stationuuid && isPlaying;
  const isStationFavorite = isFavorite(station.stationuuid);
  
  // Determine tag to display (if any)
  const tag = station.tags?.split(',')[0] || '';
  
  // Default image if no favicon
  const logoUrl = station.favicon && station.favicon !== '' 
    ? station.favicon 
    : 'https://placehold.co/400x400/8A2BE2/FFFFFF?text=Radio';
  
  // Handle favorite toggle
  const handleFavorite = (e: any) => {
    e.stopPropagation();
    toggleFavorite(station);
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isActive && styles.activeContainer
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={isActive ? colors.gradientPrimary : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          StyleSheet.absoluteFill,
          styles.gradient
        ]}
      />
      
      <Image 
        source={{ uri: logoUrl }} 
        style={styles.logo}
        resizeMode="cover"
      />
      
      <View style={styles.contentContainer}>
        <Text numberOfLines={1} style={styles.name}>
          {station.name}
        </Text>
        
        {tag ? (
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ) : (
          <Text style={styles.country}>{station.country}</Text>
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
          size={16} 
          color={isStationFavorite ? colors.favorite : colors.textSecondary}
          fill={isStationFavorite ? colors.favorite : 'transparent'}
        />
      </TouchableOpacity>
      
      {isActive && (
        <View style={styles.playingIndicator}>
          <Radio size={14} color={colors.textPrimary} />
          <Text style={styles.playingText}>LIVE</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 170,
    height: 200,
    borderRadius: 16,
    marginRight: 15,
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
    ...shadows.medium,
  },
  activeContainer: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  gradient: {
    borderRadius: 16,
  },
  logo: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  contentContainer: {
    padding: 12,
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  country: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
  tagContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: colors.accent,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFavoriteButton: {
    backgroundColor: 'rgba(255, 64, 129, 0.3)',
  },
  playingIndicator: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  playingText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    color: colors.textPrimary,
    marginLeft: 4,
  },
});