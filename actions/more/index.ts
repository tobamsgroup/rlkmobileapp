import axios from "@/lib/axios";
import { getData } from "@/lib/storage";
import { GuardianLoginSession } from "@/types";

export const updateGuardianProfile = async (payload: any) => {
  const user = await getData<GuardianLoginSession>("user");
  await axios.patch(`/guardian/${user?._id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
