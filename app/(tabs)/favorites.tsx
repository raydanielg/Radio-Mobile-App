import { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, Plus, Share2, Circle as XCircle } from 'lucide-react-native';
import { RadioStation } from '@/api/radioApi';
import { colors } from '@/constants/theme';
import StationListItem from '@/components/stations/StationListItem';
import { usePlayerContext } from '@/contexts/PlayerContext';
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import EmptyState from '@/components/ui/EmptyState';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { setCurrentStation } = usePlayerContext();
  const { favorites, removeFavorite } = useFavoritesContext();
  const [isEditing, setIsEditing] = useState(false);

  const handleStationPress = (station: RadioStation) => {
    if (isEditing) {
      Alert.alert(
        "Remove from favorites?",
        `Remove ${station.name} from your favorites?`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "Remove", 
            onPress: () => removeFavorite(station.stationuuid),
            style: "destructive"
          }
        ]
      );
    } else {
      setCurrentStation(station);
    }
  };

  const handleShare = () => {
    // Implement share functionality
    Alert.alert("Share", "Share your favorite stations with friends (Coming soon)");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Favorites</Text>
          <Text style={styles.subtitle}>
            {favorites.length} {favorites.length === 1 ? 'station' : 'stations'}
          </Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={handleShare}
          >
            <Share2 size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.headerButton, 
              isEditing && styles.activeHeaderButton
            ]} 
            onPress={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <XCircle size={20} color={colors.accent} />
            ) : (
              <Plus size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={item => item.stationuuid}
          renderItem={({ item }) => (
            <StationListItem 
              station={item} 
              onPress={() => handleStationPress(item)}
              showFavorite={false}
              isEditing={isEditing}
            />
          )}
          contentContainerStyle={styles.stationsList}
        />
      ) : (
        <EmptyState
          icon={<Heart size={50} color={colors.accent} />}
          title="No favorites yet"
          message="Add stations to your favorites to quickly access them later"
          actionText="Discover Stations"
          actionRoute="/"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  activeHeaderButton: {
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
  },
  stationsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
});