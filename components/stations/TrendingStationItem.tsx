import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Heart, Radio } from 'lucide-react-native';
import { RadioStation } from '@/api/radioApi';
import { colors } from '@/constants/theme';
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import { usePlayerContext } from '@/contexts/PlayerContext';

interface TrendingStationItemProps {
  station: RadioStation;
  rank: number;
  onPress: () => void;
}

export default function TrendingStationItem({ 
  station, 
  rank,
  onPress
}: TrendingStationItemProps) {
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const { currentStation, isPlaying } = usePlayerContext();
  
  const isActive = currentStation?.stationuuid === station.stationuuid && isPlaying;
  const isStationFavorite = isFavorite(station.stationuuid);
  
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
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>{rank}</Text>
      </View>
      
      <Image 
        source={{ uri: logoUrl }} 
        style={styles.logo}
        resizeMode="cover"
      />
      
      <View style={styles.contentContainer}>
        <Text numberOfLines={1} style={styles.name}>
          {station.name}
        </Text>
        
        <View style={styles.detailsContainer}>
          {station.tags && (
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>
                {station.tags.split(',')[0]}
              </Text>
            </View>
          )}
          
          <Text style={styles.statsText}>
            {station.clickcount} plays
          </Text>
        </View>
      </View>
      
      {isActive && (
        <View style={styles.playingIndicator}>
          <Radio size={14} color={colors.playing} />
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={handleFavorite}
      >
        <Heart 
          size={20} 
          color={isStationFavorite ? colors.favorite : colors.textSecondary}
          fill={isStationFavorite ? colors.favorite : 'transparent'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  activeContainer: {
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  rankContainer: {
    width: 28,
    alignItems: 'center',
    marginRight: 8,
  },
  rankText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: colors.textSecondary,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    borderRadius: 10,
    marginRight: 8,
  },
  tagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: colors.accent,
  },
  statsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
  playingIndicator: {
    marginRight: 10,
  },
  favoriteButton: {
    padding: 5,
  },
});