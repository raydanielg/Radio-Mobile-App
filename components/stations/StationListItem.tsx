import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Heart, Radio, Trash2 } from 'lucide-react-native';
import { RadioStation } from '@/api/radioApi';
import { colors } from '@/constants/theme';
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import { usePlayerContext } from '@/contexts/PlayerContext';

interface StationListItemProps {
  station: RadioStation;
  onPress: () => void;
  showFavorite?: boolean;
  isEditing?: boolean;
}

export default function StationListItem({ 
  station, 
  onPress, 
  showFavorite = true,
  isEditing = false
}: StationListItemProps) {
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
          
          <Text style={styles.country}>{station.country}</Text>
        </View>
      </View>
      
      {isActive && (
        <View style={styles.playingIndicator}>
          <Radio size={14} color={colors.playing} />
        </View>
      )}
      
      {showFavorite && (
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
      )}
      
      {isEditing && (
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={onPress}
        >
          <Trash2 size={20} color={colors.error} />
        </TouchableOpacity>
      )}
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
  country: {
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
  deleteButton: {
    padding: 5,
  },
});