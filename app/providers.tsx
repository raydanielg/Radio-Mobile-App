import { ReactNode } from 'react';
import { PlayerProvider } from '@/contexts/PlayerContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <FavoritesProvider>
      <PlayerProvider>
        {children}
      </PlayerProvider>
    </FavoritesProvider>
  );
}