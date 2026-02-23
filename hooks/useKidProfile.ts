import { useQuery } from "@tanstack/react-query";
import { fetchKidProfile } from "@/actions/kid";

const useKidProfile = () => {
  return useQuery({
    queryKey:['kid'],
    queryFn: async () => {
        return await fetchKidProfile()
    }
  })
};

export default useKidProfile;
