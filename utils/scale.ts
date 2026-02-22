import { Dimensions, PixelRatio } from "react-native";
import Constants from "expo-constants";

const FIGMA_HEIGHT = 812;
const FIGMA_WIDTH = 375;

export const SCREEN_HEIGHT = Dimensions.get("window").height;
export const SCREEN_WIDTH = Dimensions.get("window").width;
export const STAUS_BAR_HEIGHT =  Constants.statusBarHeight

export const scaleHeight = (size: number) => {
  const scaled = (SCREEN_HEIGHT / FIGMA_HEIGHT) * size;
  return Math.round(PixelRatio.roundToNearestPixel(scaled));
};

export const scaleWidth = (size: number) => {
  const scaled = (SCREEN_WIDTH / FIGMA_WIDTH) * size;
  return Math.round(PixelRatio.roundToNearestPixel(scaled));
};
