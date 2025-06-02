import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Settings, 
  Moon, 
  Globe, 
  Bell, 
  Clock, 
  ChartBar as BarChart, 
  Wifi, 
  Headphones, 
  Heart, 
  RefreshCw, 
  Share2, 
  Info, 
  ChevronRight,
  Volume2,
  Radio,
  Shield,
  Database
} from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { usePlayerContext } from '@/contexts/PlayerContext';

const SECTIONS = {
  PLAYBACK: 'Playback',
  APPEARANCE: 'Appearance',
  NOTIFICATIONS: 'Notifications',
  DATA: 'Data & Storage',
  ABOUT: 'About',
};

const STORAGE_KEYS = {
  DARK_MODE: 'settings_darkMode',
  STREAM_QUALITY: 'settings_streamQuality',
  NOTIFICATIONS: 'settings_notifications',
  SLEEP_TIMER: 'settings_sleepTimer',
  AUTO_DOWNLOAD: 'settings_autoDownload',
  DATA_SAVER: 'settings_dataSaver',
  VOLUME: 'settings_volume',
  BUFFER_SIZE: 'settings_bufferSize',
  OFFLINE_MODE: 'settings_offlineMode',
};

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { volume, setVolume } = usePlayerContext();
  
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [streamQuality, setStreamQuality] = useState('High');
  const [notifications, setNotifications] = useState(true);
  const [sleepTimer, setSleepTimer] = useState(false);
  const [autoDownload, setAutoDownload] = useState(false);
  const [dataSaver, setDataSaver] = useState(false);
  const [bufferSize, setBufferSize] = useState('Normal');
  const [offlineMode, setOfflineMode] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [
        darkModeSetting,
        streamQualitySetting,
        notificationsSetting,
        sleepTimerSetting,
        autoDownloadSetting,
        dataSaverSetting,
        volumeSetting,
        bufferSizeSetting,
        offlineModeSetting
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.DARK_MODE),
        AsyncStorage.getItem(STORAGE_KEYS.STREAM_QUALITY),
        AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS),
        AsyncStorage.getItem(STORAGE_KEYS.SLEEP_TIMER),
        AsyncStorage.getItem(STORAGE_KEYS.AUTO_DOWNLOAD),
        AsyncStorage.getItem(STORAGE_KEYS.DATA_SAVER),
        AsyncStorage.getItem(STORAGE_KEYS.VOLUME),
        AsyncStorage.getItem(STORAGE_KEYS.BUFFER_SIZE),
        AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_MODE)
      ]);

      setDarkMode(darkModeSetting === 'true');
      if (streamQualitySetting) setStreamQuality(streamQualitySetting);
      setNotifications(notificationsSetting === 'true');
      setSleepTimer(sleepTimerSetting === 'true');
      setAutoDownload(autoDownloadSetting === 'true');
      setDataSaver(dataSaverSetting === 'true');
      if (volumeSetting) setVolume(parseFloat(volumeSetting));
      if (bufferSizeSetting) setBufferSize(bufferSizeSetting);
      setOfflineMode(offlineModeSetting === 'true');
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSetting = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  };

  const handleStreamQualityChange = () => {
    Alert.alert(
      'Stream Quality',
      'Select your preferred streaming quality',
      [
        { text: 'Low (64kbps)', onPress: () => {
          setStreamQuality('Low');
          saveSetting(STORAGE_KEYS.STREAM_QUALITY, 'Low');
        }},
        { text: 'Medium (128kbps)', onPress: () => {
          setStreamQuality('Medium');
          saveSetting(STORAGE_KEYS.STREAM_QUALITY, 'Medium');
        }},
        { text: 'High (256kbps)', onPress: () => {
          setStreamQuality('High');
          saveSetting(STORAGE_KEYS.STREAM_QUALITY, 'High');
        }},
      ]
    );
  };

  const handleBufferSizeChange = () => {
    Alert.alert(
      'Buffer Size',
      'Select buffer size for smoother playback',
      [
        { text: 'Small (Less memory)', onPress: () => {
          setBufferSize('Small');
          saveSetting(STORAGE_KEYS.BUFFER_SIZE, 'Small');
        }},
        { text: 'Normal', onPress: () => {
          setBufferSize('Normal');
          saveSetting(STORAGE_KEYS.BUFFER_SIZE, 'Normal');
        }},
        { text: 'Large (Better stability)', onPress: () => {
          setBufferSize('Large');
          saveSetting(STORAGE_KEYS.BUFFER_SIZE, 'Large');
        }},
      ]
    );
  };

  const handleSleepTimer = () => {
    Alert.alert(
      'Sleep Timer',
      'Stop playback after:',
      [
        { text: '15 minutes', onPress: () => setSleepTimer(true) },
        { text: '30 minutes', onPress: () => setSleepTimer(true) },
        { text: '1 hour', onPress: () => setSleepTimer(true) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderSettingItem = (
    icon: React.ReactNode, 
    title: string, 
    subtitle?: string,
    rightElement?: React.ReactNode,
    onPress?: () => void
  ) => {
    return (
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={onPress}
      >
        <View style={styles.settingIconContainer}>
          {icon}
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
        {rightElement || (
          <ChevronRight size={18} color={colors.textSecondary} />
        )}
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = (title: string) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderSectionHeader(SECTIONS.PLAYBACK)}
        {renderSettingItem(
          <Volume2 size={20} color={colors.accent} />,
          'Volume',
          'Adjust playback volume',
          <Text style={styles.settingValue}>{Math.round(volume * 100)}%</Text>
        )}
        {renderSettingItem(
          <Radio size={20} color={colors.accent} />,
          'Audio Quality',
          'Set your preferred streaming quality',
          <Text style={styles.settingValue}>{streamQuality}</Text>,
          handleStreamQualityChange
        )}
        {renderSettingItem(
          <Database size={20} color={colors.accent} />,
          'Buffer Size',
          'Adjust streaming buffer size',
          <Text style={styles.settingValue}>{bufferSize}</Text>,
          handleBufferSizeChange
        )}
        {renderSettingItem(
          <Clock size={20} color={colors.accent} />,
          'Sleep Timer',
          'Automatically stop playback after a set time',
          <Switch
            value={sleepTimer}
            onValueChange={(value) => {
              if (value) {
                handleSleepTimer();
              } else {
                setSleepTimer(false);
                saveSetting(STORAGE_KEYS.SLEEP_TIMER, false);
              }
            }}
            trackColor={{ false: colors.cardBackground, true: 'rgba(138, 43, 226, 0.5)' }}
            thumbColor={sleepTimer ? colors.accent : '#f4f3f4'}
          />
        )}
        
        {renderSectionHeader(SECTIONS.APPEARANCE)}
        {renderSettingItem(
          <Moon size={20} color={colors.accent} />,
          'Dark Mode',
          'Enable dark theme for the app',
          <Switch
            value={darkMode}
            onValueChange={(value) => {
              setDarkMode(value);
              saveSetting(STORAGE_KEYS.DARK_MODE, value);
            }}
            trackColor={{ false: colors.cardBackground, true: 'rgba(138, 43, 226, 0.5)' }}
            thumbColor={darkMode ? colors.accent : '#f4f3f4'}
          />
        )}
        {renderSettingItem(
          <Globe size={20} color={colors.accent} />,
          'Language',
          'Change app language',
          <Text style={styles.settingValue}>English</Text>
        )}
        
        {renderSectionHeader(SECTIONS.NOTIFICATIONS)}
        {renderSettingItem(
          <Bell size={20} color={colors.accent} />,
          'Push Notifications',
          'Get notified about new stations and features',
          <Switch
            value={notifications}
            onValueChange={(value) => {
              setNotifications(value);
              saveSetting(STORAGE_KEYS.NOTIFICATIONS, value);
            }}
            trackColor={{ false: colors.cardBackground, true: 'rgba(138, 43, 226, 0.5)' }}
            thumbColor={notifications ? colors.accent : '#f4f3f4'}
          />
        )}
        
        {renderSectionHeader(SECTIONS.DATA)}
        {renderSettingItem(
          <Shield size={20} color={colors.accent} />,
          'Offline Mode',
          'Access downloaded content without internet',
          <Switch
            value={offlineMode}
            onValueChange={(value) => {
              setOfflineMode(value);
              saveSetting(STORAGE_KEYS.OFFLINE_MODE, value);
            }}
            trackColor={{ false: colors.cardBackground, true: 'rgba(138, 43, 226, 0.5)' }}
            thumbColor={offlineMode ? colors.accent : '#f4f3f4'}
          />
        )}
        {renderSettingItem(
          <Wifi size={20} color={colors.accent} />,
          'Data Saver',
          'Reduce data usage while streaming',
          <Switch
            value={dataSaver}
            onValueChange={(value) => {
              setDataSaver(value);
              saveSetting(STORAGE_KEYS.DATA_SAVER, value);
            }}
            trackColor={{ false: colors.cardBackground, true: 'rgba(138, 43, 226, 0.5)' }}
            thumbColor={dataSaver ? colors.accent : '#f4f3f4'}
          />
        )}
        {renderSettingItem(
          <RefreshCw size={20} color={colors.accent} />,
          'Auto-download',
          'Automatically download favorites for offline',
          <Switch
            value={autoDownload}
            onValueChange={(value) => {
              setAutoDownload(value);
              saveSetting(STORAGE_KEYS.AUTO_DOWNLOAD, value);
            }}
            trackColor={{ false: colors.cardBackground, true: 'rgba(138, 43, 226, 0.5)' }}
            thumbColor={autoDownload ? colors.accent : '#f4f3f4'}
          />
        )}
        {renderSettingItem(
          <BarChart size={20} color={colors.accent} />,
          'Listening History',
          'View and manage your listening history'
        )}
        
        {renderSectionHeader(SECTIONS.ABOUT)}
        {renderSettingItem(
          <Share2 size={20} color={colors.accent} />,
          'Share App',
          'Share Radio Hub with friends'
        )}
        {renderSettingItem(
          <Info size={20} color={colors.accent} />,
          'About Radio Hub',
          'Version 1.0.0'
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionHeader: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: colors.accent,
    marginTop: 25,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: colors.textPrimary,
  },
  settingSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  settingValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.accent,
    marginRight: 5,
  },
});