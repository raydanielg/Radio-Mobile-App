import { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Music2, Radio, Zap } from 'lucide-react-native';
import { fetchRadioStations, RadioStation } from '@/api/radioApi';
import { colors } from '@/constants/theme';
import RadioCard from '@/components/stations/RadioCard';
import CategoryScroll from '@/components/ui/CategoryScroll';
import FeaturedStation from '@/components/stations/FeaturedStation';
import { usePlayerContext } from '@/contexts/PlayerContext';

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const { setCurrentStation } = usePlayerContext();
  const [featuredStations, setFeaturedStations] = useState<RadioStation[]>([]);
  const [popularStations, setPopularStations] = useState<RadioStation[]>([]);
  const [recentStations, setRecentStations] = useState<RadioStation[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [genres, setGenres] = useState<string[]>([
    'All', 'Pop', 'Rock', 'Jazz', 'Classical', 'Hip Hop', 'R&B', 'Dance', 'Reggae', 'Folk'
  ]);
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      const stations = await fetchRadioStations('Tanzania');
      
      // Sort by votes/popularity for featured stations
      const sortedByVotes = [...stations].sort((a, b) => b.votes - a.votes);
      setFeaturedStations(sortedByVotes.slice(0, 5));
      
      // Sort by click count for popular stations
      const sortedByClicks = [...stations].sort((a, b) => b.clickcount - a.clickcount);
      setPopularStations(sortedByClicks.slice(0, 10));
      
      // Recent stations (could be from recent API additions or user history)
      const sortedByRecent = [...stations].sort((a, b) => 
        new Date(b.lastchangetime).getTime() - new Date(a.lastchangetime).getTime()
      );
      setRecentStations(sortedByRecent.slice(0, 10));
      
      // Extract unique genres
      if (stations.length > 0) {
        const uniqueGenres = ['All', ...new Set(stations
          .map(station => station.tags?.split(',') || [])
          .flat()
          .filter(tag => tag && tag.trim() !== '')
          .map(tag => tag.trim())
        )].slice(0, 15);
        
        setGenres(uniqueGenres);
      }
    } catch (error) {
      console.error('Failed to load stations:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStations();
    setRefreshing(false);
  };

  const handleStationPress = (station: RadioStation) => {
    setCurrentStation(station);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.title}>Radio Hub</Text>
          <View style={styles.locationContainer}>
            <MapPin size={14} color={colors.accent} />
            <Text style={styles.locationText}>Tanzania</Text>
          </View>
        </View>

        {featuredStations.length > 0 && (
          <View style={styles.featuredContainer}>
            <Text style={styles.sectionTitle}>Featured Stations</Text>
            <FeaturedStation 
              station={featuredStations[0]} 
              onPress={() => handleStationPress(featuredStations[0])}
            />
          </View>
        )}

        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <CategoryScroll 
            categories={genres}
            selectedCategory={selectedGenre}
            onSelectCategory={setSelectedGenre}
          />
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Stations</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={popularStations}
            keyExtractor={item => item.stationuuid}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <RadioCard 
                station={item} 
                onPress={() => handleStationPress(item)}
              />
            )}
            contentContainerStyle={styles.stationsScrollContent}
          />
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Added</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={recentStations}
            keyExtractor={item => item.stationuuid}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <RadioCard 
                station={item} 
                onPress={() => handleStationPress(item)}
              />
            )}
            contentContainerStyle={styles.stationsScrollContent}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: colors.textPrimary,
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.accent,
    marginLeft: 4,
  },
  featuredContainer: {
    marginTop: 10,
    marginHorizontal: 20,
  },
  categoriesContainer: {
    marginTop: 25,
    marginHorizontal: 20,
  },
  sectionContainer: {
    marginTop: 25,
    marginBottom: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.accent,
  },
  stationsScrollContent: {
    paddingLeft: 20,
    paddingRight: 10,
  },
});