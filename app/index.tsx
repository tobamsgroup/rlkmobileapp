import { getData } from "@/lib/storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const [isLoggedIn, setisLoggedIn] = useState(false);

  useEffect(() => {
    const check = async () => {
      const user = await getData("user");
      if (user) {
        setisLoggedIn(true);
      } else {
        setisLoggedIn(false);
      }
    };
    check();
  }, []);
  return <Redirect href={isLoggedIn ? "/(tabs)" :"/onboarding"} />;
}
