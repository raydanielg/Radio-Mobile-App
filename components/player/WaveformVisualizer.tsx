import { StyleSheet, View } from 'react-native';
import { colors } from '@/constants/theme';

interface WaveformVisualizerProps {
  audioData: number[];
  height: number;
}

export default function WaveformVisualizer({ audioData, height }: WaveformVisualizerProps) {
  return (
    <View style={[styles.container, { height }]}>
      {audioData.map((value, index) => (
        <View
          key={index}
          style={[
            styles.bar,
            {
              height: value * height * 0.8,
              backgroundColor: getBarColor(index, audioData.length),
            },
          ]}
        />
      ))}
    </View>
  );
}

const getBarColor = (index: number, total: number) => {
  // Create a gradient effect across bars
  const ratio = index / total;
  
  if (ratio < 0.2) {
    return colors.gradientSecondary[1]; // Orange-ish
  } else if (ratio < 0.5) {
    return colors.gradientSecondary[0]; // Pink
  } else if (ratio < 0.8) {
    return colors.gradientPrimary[0]; // Purple
  } else {
    return colors.gradientPrimary[1]; // Deep purple/blue
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    opacity: 0.7,
  },
  bar: {
    width: 3,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginHorizontal: 1,
  },
});