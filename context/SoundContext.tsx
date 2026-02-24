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
  const trashDrop = useAudioPlayer(require("../assets/sounds/trash-drop.mp3"));
  const correct = useAudioPlayer(require("../assets/sounds/correct.mp3"));
  const cheers = useAudioPlayer(require("../assets/sounds/cheers.mp3"));
  const wrong = useAudioPlayer(require("../assets/sounds/wrong.mp3"));

  const play = (key: string): void => {
    switch (key) {
      case "success":
        success.seekTo(0);
        success.play();
        break;
      case "trashDrop":
        trashDrop.seekTo(0);
        trashDrop.play();
        break;
      case "correct":
        correct.seekTo(0);
        correct.play();
        break;
      case "cheers":
        cheers.seekTo(0);
        cheers.play();
        break;
      case "wrong":
        wrong.seekTo(0);
        wrong.play();
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
