import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async <T>(key: string, value: T): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error("AsyncStorage store error:", error);
    return false;
  }
};

export const getData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? (JSON.parse(jsonValue) as T) : null;
  } catch (error) {
    console.error("AsyncStorage get error:", error);
    return null;
  }
};

export const removeData = async (key: string): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("AsyncStorage remove error:", error);
    return false;
  }
};

export const clearStorage = async (): Promise<boolean> => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error("AsyncStorage clear error:", error);
    return false;
  }
};
