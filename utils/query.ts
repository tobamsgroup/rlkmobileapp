import { queryClient } from "@/app/_layout";

export const invalidateQueries = (key:string | string[]) => {
  return queryClient.invalidateQueries({
    queryKey: Array.isArray(key) ? [...key] : [key],
  });
};