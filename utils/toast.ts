import Toast from "react-native-toast-message";

export const showToast = (
  type: "error" | "info" | "success" = "success",
  text1: string,
  text2?: string,
  position?:'bottom' | 'top'
) => {
  Toast.show({
    type,
    text1,
    text2,
    position
  });
};
