import axios from "@/lib/axios";
import { IAvatar } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useKidAvatars = () => {
  return useQuery({
    queryKey: ["avatars"],
    queryFn: async () => {
      const response = await axios.get(`/upload/avatars`);
      return response?.data?.data?.avatars as IAvatar[]
    },
  });
};


