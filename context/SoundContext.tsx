import React, {
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useAudioPlayer } from "expo-audio";

/**
 * Define the shape of the context
 */
type SoundContextType = {
  play: (key: string) => void;
};

/**
 * Create context with explicit undefined default
 */
const SoundContext = createContext<SoundContextType | undefined>(undefined);

type SoundProviderProps = {
  children: ReactNode;
};

export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  const success = useAudioPlayer(require("../assets/sounds/ding.mp3"));

  const play = (key: string): void => {
    switch (key) {
      case "success":
        success.seekTo(0);
        success.play();
        break;
      default:
        break;
    }
  };

  return (
    <SoundContext.Provider value={{ play }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);

  if (!context) {
    throw new Error("useSound must be used within SoundProvider");
  }

  return context;
};
