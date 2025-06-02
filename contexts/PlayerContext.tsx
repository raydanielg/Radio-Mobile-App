import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { RadioStation } from '@/api/radioApi';
import { Platform } from 'react-native';

interface PlayerContextType {
  currentStation: RadioStation | null;
  isPlaying: boolean;
  isBuffering: boolean;
  volume: number;
  playbackPosition: number;
  duration: number;
  setCurrentStation: (station: RadioStation | null) => void;
  togglePlayPause: () => void;
  stopPlayback: () => void;
  setVolume: (volume: number) => void;
  audioData: number[];
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioData, setAudioData] = useState<number[]>(Array(50).fill(0));

  // Set up audio mode on mount
  useEffect(() => {
    setupAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const setupAudio = async () => {
    if (Platform.OS !== 'web') {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    }
  };

  // Handle playback of a new station
  useEffect(() => {
    if (currentStation) {
      playStation(currentStation);
    }
  }, [currentStation]);

  // Generate random audio data for visualization (will be replaced with real audio analysis)
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const newData = audioData.map(() => Math.random() * 0.8 + 0.2);
        setAudioData(newData);
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, audioData]);

  const playStation = async (station: RadioStation) => {
    // Unload previous sound
    if (sound) {
      await sound.unloadAsync();
    }
    
    try {
      setIsBuffering(true);
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: station.url_resolved },
        { shouldPlay: true, volume },
        onPlaybackStatusUpdate
      );
      
      setSound(newSound);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing station:', error);
      setIsBuffering(false);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setIsBuffering(status.isBuffering);
      
      if (status.didJustFinish) {
        // Radio streams don't typically "finish" but if they do, we can handle it here
      }
      
      if (status.durationMillis) {
        setDuration(status.durationMillis);
      }
      
      if (status.positionMillis) {
        setPlaybackPosition(status.positionMillis);
      }
    } else {
      if (status.error) {
        console.error(`Playback error: ${status.error}`);
      }
    }
  };

  const togglePlayPause = async () => {
    if (!sound) return;
    
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const stopPlayback = async () => {
    if (!sound) return;
    
    await sound.stopAsync();
    setCurrentStation(null);
    setIsPlaying(false);
  };

  const handleSetVolume = async (newVolume: number) => {
    setVolume(newVolume);
    if (sound) {
      await sound.setVolumeAsync(newVolume);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentStation,
        isPlaying,
        isBuffering,
        volume,
        playbackPosition,
        duration,
        setCurrentStation,
        togglePlayPause,
        stopPlayback,
        setVolume: handleSetVolume,
        audioData,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return context;
};