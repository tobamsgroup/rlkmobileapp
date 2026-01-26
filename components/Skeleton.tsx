import { View, ViewStyle } from "react-native";
import { twMerge } from "tailwind-merge";

const Skeleton = ({ className, style }: { className?: string, style?:ViewStyle }) => {
  return (
    <View
    style={style}
      className={twMerge(
        "animate-pulse h-6 rounded-md bg-[#D3D2D366]",
        className
      )}
    />
  );
};

export default Skeleton;
