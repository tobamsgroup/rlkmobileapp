import { handleLogout } from "@/actions/logout";
import Button from "@/components/Button";
import Container from "@/components/Container";
import { useAppDispatch } from "@/hooks/redux";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  return (
    <Container>
      <View className="flex-1 items-center justify-center ">
        <Button
          className="w-[60%]"
          onPress={() => handleLogout(dispatch)}
          text="Log Out"
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
