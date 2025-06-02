import { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, Zap, Headphones, Music2 } from 'lucide-react-native';
import { fetchTrendingStations, RadioStation } from '@/api/radioApi';
import { colors } from '@/constants/theme';
import TrendingStationItem from '@/components/stations/TrendingStationItem';
import { usePlayerContext } from '@/contexts/PlayerContext';

type TrendingCategory = 'votes' | 'clicks' | 'recent';

export default function TrendingScreen() {
  const insets = useSafeAreaInsets();
  const { setCurrentStation } = usePlayerContext();
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<TrendingCategory>('votes');

  useEffect(() => {
    loadTrendingStations();
  }, [category]);

  const loadTrendingStations = async () => {
    setLoading(true);
    try {
      const trendingStations = await fetchTrendingStations(category);
      setStations(trendingStations);
    } catch (error) {
      console.error('Error loading trending stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStationPress = (station: RadioStation) => {
    setCurrentStation(station);
  };

  const renderCategoryButton = (
    title: string, 
    categoryValue: TrendingCategory, 
    icon: React.ReactNode
  ) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        category === categoryValue && styles.activeCategoryButton
      ]}
      onPress={() => setCategory(categoryValue)}
    >
      {icon}
      <Text 
        style={[
          styles.categoryButtonText,
          category === categoryValue && styles.activeCategoryButtonText
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Trending</Text>
        <Text style={styles.subtitle}>The hottest radio stations right now</Text>
      </View>

      <View style={styles.categoriesContainer}>
        {renderCategoryButton(
          'Most Voted', 
          'votes', 
          <Zap 
            size={16} 
            color={category === 'votes' ? colors.accent : colors.textSecondary} 
            style={styles.categoryIcon} 
          />
        )}
        {renderCategoryButton(
          'Most Played', 
          'clicks', 
          <Headphones 
            size={16} 
            color={category === 'clicks' ? colors.accent : colors.textSecondary} 
            style={styles.categoryIcon} 
          />
        )}
        {renderCategoryButton(
          'Newest', 
          'recent', 
          <Music2 
            size={16} 
            color={category === 'recent' ? colors.accent : colors.textSecondary} 
            style={styles.categoryIcon} 
          />
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={stations}
          keyExtractor={item => item.stationuuid}
          renderItem={({ item, index }) => (
            <TrendingStationItem
              station={item}
              rank={index + 1}
              onPress={() => handleStationPress(item)}
            />
          )}
          contentContainerStyle={styles.stationsList}
          showsVerticalScrollIndicator={false}
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
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
  },
  categoryIcon: {
    marginRight: 5,
  },
  categoryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeCategoryButtonText: {
    color: colors.accent,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stationsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
});