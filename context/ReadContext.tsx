import { getData, storeData } from '@/lib/storage';
import { HAPTIC } from '@/utils/haptic';
import { showToast } from '@/utils/toast';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export type IAccents = {
  id: string;
  name: string;
  code?: string[];
  voice?: string;
};
interface ReadingSettings {
  fontSize: {
    header:number;
    body:number
  };
  lineSpace: number;
  dyslexiaFriendly: boolean;
  highContrast: boolean;
}

interface SettingsContextType {
  selectedAccent: IAccents | null;
  setSelectedAccent: (accent: IAccents | null) => void;

  selectedVoice: IAccents | null;
  setSelectedVoice: (voice: IAccents | null) => void;

  readingSettings: ReadingSettings;
  updateReadingSettings: (settings: Partial<ReadingSettings>) => void;

  saveSettings: () => void;

  resetAccent: () => void;
  resetVoice: () => void;
  resetReadingSettings: () => void;
  resetAllSettings: () => void;
}

const defaultReadingSettings: ReadingSettings = {
  fontSize: {
    header:16,
    body:14
  },
  lineSpace: 24,
  dyslexiaFriendly: false,
  highContrast: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

const STORAGE_KEYS = {
  ACCENT: 'user_accent_settings',
  VOICE: 'user_voice_settings',
  READING: 'user_reading_settings',
};

export const ReadSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAccent, setSelectedAccentState] = useState<IAccents | null>(
    null,
  );
  const [selectedVoice, setSelectedVoiceState] = useState<IAccents | null>(
    null,
  );
  const [readingSettings, setReadingSettingsState] = useState<ReadingSettings>(
    defaultReadingSettings,
  );

  useEffect(() => {
    try {
      const preloadData = async () => {
        const storedAccent = await getData<IAccents>(STORAGE_KEYS.ACCENT);
        const storedVoice = await getData<IAccents>(STORAGE_KEYS.VOICE);
        const storedReading = await getData<ReadingSettings>(
          STORAGE_KEYS.READING,
        );

        if (storedAccent) {
          setSelectedAccentState(storedAccent);
        }
        if (storedVoice) {
          setSelectedVoiceState(storedVoice);
        }
        if (storedReading) {
          setReadingSettingsState(storedReading);
        }
      };
      preloadData();
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
    }
  }, []);

  const setSelectedAccent = (accent: IAccents | null) => {
    setSelectedAccentState(accent);
    try {
      if (accent) {
        localStorage.setItem(STORAGE_KEYS.ACCENT, JSON.stringify(accent));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACCENT);
      }
    } catch (error) {
      console.error('Error saving accent to localStorage:', error);
    }
  };

  const setSelectedVoice = (voice: IAccents | null) => {
    setSelectedVoiceState(voice);
    try {
      if (voice) {
        localStorage.setItem(STORAGE_KEYS.VOICE, JSON.stringify(voice));
      } else {
        localStorage.removeItem(STORAGE_KEYS.VOICE);
      }
    } catch (error) {
      console.error('Error saving voice to localStorage:', error);
    }
  };

  const updateReadingSettings = (settings: Partial<ReadingSettings>) => {
    const newSettings = { ...readingSettings, ...settings };
    setReadingSettingsState(newSettings);
  };

  const saveSettings = () => {
    try {
      if (selectedAccent) {
        storeData(STORAGE_KEYS.ACCENT, selectedAccent);
      }
      if (selectedVoice) {
        storeData(STORAGE_KEYS.VOICE, selectedVoice);
      }
      storeData(STORAGE_KEYS.READING, readingSettings);
      showToast('success', 'Your settings have been saved');
      HAPTIC.success();
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const resetAccent = () => {
    setSelectedAccent(null);
  };

  const resetVoice = () => {
    setSelectedVoice(null);
  };

  const resetReadingSettings = () => {
    updateReadingSettings(defaultReadingSettings);
  };

  const resetAllSettings = () => {
    resetAccent();
    resetVoice();
    resetReadingSettings();
  };

  return (
    <SettingsContext.Provider
      value={{
        selectedAccent,
        setSelectedAccent,
        selectedVoice,
        setSelectedVoice,
        readingSettings,
        updateReadingSettings,
        saveSettings,
        resetAccent,
        resetVoice,
        resetReadingSettings,
        resetAllSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useReadSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a ReadSettingsProvider');
  }
  return context;
};
