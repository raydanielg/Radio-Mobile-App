import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Radio, Search, Heart, Settings, ChartBar as BarChart3 } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import TabBarPlayer from '@/components/player/TabBarPlayer';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      <TabBarPlayer />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            ...styles.tabBar,
            height: 60 + (Platform.OS === 'ios' ? insets.bottom : 10),
            paddingBottom: Platform.OS === 'ios' ? insets.bottom : 10,
          },
          tabBarBackground: () => (
            <BlurView intensity={80} style={StyleSheet.absoluteFill}>
              <LinearGradient
                colors={['rgba(30, 12, 53, 0.85)', 'rgba(10, 10, 20, 0.95)']}
                style={StyleSheet.absoluteFill}
              />
            </BlurView>
          ),
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Discover',
            tabBarIcon: ({ color, size }) => (
              <Radio size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => (
              <Search size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="trending"
          options={{
            title: 'Trending',
            tabBarIcon: ({ color, size }) => (
              <BarChart3 size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favorites',
            tabBarIcon: ({ color, size }) => (
              <Heart size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Settings size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
    backgroundColor: 'transparent',
  },
  tabLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
  },
});