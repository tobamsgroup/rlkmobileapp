import axios from "@/lib/axios";
// import { childProfileSchema } from "./component/AddKidProfile";
import { childProfileSchema } from "@/components/Home/CreateChildProfile";
import { getData } from "@/lib/storage";
import {
  GuardianLoginSession,
  GuardianProfileProps,
  LearningOverviewResponse,
} from "@/types";
import { cache } from "react";
import * as z from "zod";
// import { childProfileSchema } from "./component/AddKidProfileForm";

export const fetchDashboardOverview = async (guardianId: string) => {
  const res = await axios.get(`/track/me/${guardianId}`);
  return res?.data;
};

export const fetchTrackSummary = async (guardianId: string) => {
  const res = await axios.get(`/track/guardian/${guardianId}/learning-info`);
  return res?.data;
};

export const getNotifications = async () => {
  const res = await axios.get("/notifications");
  return res.data;
};

export const getGuardianProfile = cache(
  async (): Promise<GuardianProfileProps> => {
    const user = await getData<GuardianLoginSession>("user");
    const res = await axios.get(`/guardian/profile`);
    return res.data?.data;
  },
);

export const updateGuardianProfile = async (
  firstName: string,
  lastName: string,
) => {
  const user = await getData<GuardianLoginSession>("user");
  const res = await axios.patch(`/guardian/${user?._id}`, {
    firstName,
    lastName,
  });
  return res.data?.data;
};

export const createKidProfile = async (
  profile: z.infer<typeof childProfileSchema>,
) => {
  const user = await getData<GuardianLoginSession>("user");
  const payload = {
    ...profile,
    role: "kid",
    guardianId: user?._id,
  };

  const res = await axios.post("/auth/signup/kid", payload);
  return res?.data?.data;
};

export const updateKidProfile = async (id:string, payload:any) => {
  const res = await axios.patch(`/kid/${id}`, payload);
  return res?.data?.data;
};

export const getKidsOverview = cache(
  async (kidId: string): Promise<LearningOverviewResponse> => {
    const res = await axios.get(`kid/${kidId}/learning-overview`);
    return res.data?.data;
  },
);

type Overview = {
  totalUniqueStudents: number;
  totalAssignedStudents: number;
  totalCompletedStudents: number;
};
export const getGuardianOverview = cache(async (): Promise<Overview> => {
  const res = await axios.get(`/guardian/overview`);
  return res.data?.data;
});
