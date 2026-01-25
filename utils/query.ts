import { queryClient } from "@/app/_layout";

export const invalidateQueries = (key:string) => {
  return queryClient.invalidateQueries({ queryKey: [key] });
};