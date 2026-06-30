import { getData } from '@/lib/storage';
import { Redirect } from 'expo-router';
import * as Updates from 'expo-updates';
import { useEffect, useState } from 'react';

export default function Index() {
  const [isLoggedIn, setisLoggedIn] = useState(false);

  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest Expo updates: ${error}`);
    }
  }

  useEffect(() => {
    const check = async () => {
      const user = await getData('user');
      if (user) {
        setisLoggedIn(true);
      } else {
        setisLoggedIn(false);
      }
    };
    if (!__DEV__) {
      onFetchUpdateAsync();
    }
    check();
  }, []);
  return <Redirect href={isLoggedIn ? '/(tabs)' : '/onboarding'} />;
}
