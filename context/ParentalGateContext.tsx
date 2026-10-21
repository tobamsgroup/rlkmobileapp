import ParentalGateModal from '@/components/ParentalGateModal';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { Linking } from 'react-native';

type ParentalGateContextType = {
  // Runs `action` only after a parent passes the gate.
  requireParentalGate: (action: () => void | Promise<void>) => void;
  // Opens an external URL behind the gate.
  openExternalLink: (url: string) => void;
};

const ParentalGateContext = createContext<ParentalGateContextType | null>(
  null,
);

export const ParentalGateProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const pendingAction = useRef<(() => void | Promise<void>) | null>(null);

  const requireParentalGate = useCallback(
    (action: () => void | Promise<void>) => {
      pendingAction.current = action;
      setOpen(true);
    },
    [],
  );

  const openExternalLink = useCallback(
    (url: string) => requireParentalGate(() => Linking.openURL(url)),
    [requireParentalGate],
  );

  const handleClose = () => {
    pendingAction.current = null;
    setOpen(false);
  };

  const handleSuccess = () => {
    const action = pendingAction.current;
    pendingAction.current = null;
    setOpen(false);
    // Let the modal dismiss before opening a browser, sheet or purchase UI.
    setTimeout(() => {
      Promise.resolve(action?.()).catch(console.log);
    }, 400);
  };

  return (
    <ParentalGateContext.Provider
      value={{ requireParentalGate, openExternalLink }}
    >
      {children}
      <ParentalGateModal
        open={open}
        onSuccess={handleSuccess}
        onClose={handleClose}
      />
    </ParentalGateContext.Provider>
  );
};

export const useParentalGate = () => {
  const context = useContext(ParentalGateContext);
  if (!context) {
    throw new Error('useParentalGate must be used within ParentalGateProvider');
  }
  return context;
};
