import { useEffect, useState, useCallback } from "react";
import { getData } from "@/lib/storage";
import { GuardianLoginSession, KidLoginSession } from "@/types";

type UserSession = GuardianLoginSession & KidLoginSession | null;

export const useUser = () => {
  const [user, setUser] = useState<UserSession>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    setLoading(true);
    const storedUser = await getData<UserSession>("user");
    setUser(storedUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return {
    user,
    loading,
    refreshUser: loadUser,
    isLoggedIn: !!user,
  };
};
