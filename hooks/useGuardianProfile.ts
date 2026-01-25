import { useQuery } from "@tanstack/react-query";
import { getGuardianProfile } from "@/actions/home";

const useGuardian = () => {
  return useQuery({
    queryKey:['guardian'],
    queryFn: async () => {
        return await getGuardianProfile()
    }
  })
};

export default useGuardian;
