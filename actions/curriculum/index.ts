import axios from "@/lib/axios";
import { getData } from "@/lib/storage";
import {
  ActivityProps,
  Chapter,
  GuardianLoginSession,
  IGuardianKids,
  VolumeAssignmentStatsResponse,
  VolumeStat,
} from "@/types";
import { cache } from "react";

export type CurriculumStats = {
  id: string;
  title: string;
  image: string;
  totalVolumes: number;
  assignedVolumes: number;
};

type CourseAssignProps = {
  kidIds: string[];
  bookId: string;
  seriesIds: string[];
  chapterIds: string[];
};

type SeriesAssignedKids = {
  seriesId: string;      
  seriesTitle: string;   
  assignedKids: string[]; 
}


export const getCurriculumStats = cache(
  async (): Promise<CurriculumStats[]> => {
    const resp = await axios.get("/guardian/curriculum");
    return resp?.data?.data;
  },
);

export const getRecentActivities = cache(async (): Promise<ActivityProps[]> => {
  const resp = await axios.get(`/activities/recent`);
  return resp?.data?.data;
});

export const getSeriesVolume = cache(
  async (seriesId: string): Promise<VolumeAssignmentStatsResponse> => {
    const resp = await axios.get(`/guardian/curriculum/${seriesId}/volumes`);
    return resp?.data?.data;
  },
);
export const getKidAssignedToSeries = cache(
  async (seriesId: string): Promise<SeriesAssignedKids[]> => {
    const resp = await axios.get(`/guardian/curriculum/${seriesId}/kids`);
    return resp?.data?.data;
  },
);
export const getActiveVolume = cache(
  async (): Promise<VolumeAssignmentStatsResponse> => {
    const resp = await axios.get(`/guardian/curriculum/active/volumes`);
    return resp?.data?.data;
  },
);
export const getInactiveVolume = cache(async (): Promise<VolumeStat[]> => {
  const resp = await axios.get(`/guardian/curriculum/inactive/volumes`);
  return resp?.data?.data;
});

export const getVolume = cache(
  async (volumeId: string): Promise<VolumeStat> => {
    const resp = await axios.get(`/book/series/${volumeId}`);
    // console.log(resp.data.data)
    return resp?.data?.data;
  },
);
export const getSeriesChapters = cache(
  async (seriesId: string): Promise<Chapter[]> => {
    const resp = await axios.get(`/series/${seriesId}/chapters`);
    return resp?.data?.chapters;
  },
);

export const getAllKids = cache(async (): Promise<IGuardianKids[]> => {
  const resp = await axios.get(`/guardian/kids`);
  return resp?.data?.data?.kidIds;
});

export const assignKidsToCourse = async (data: CourseAssignProps) => {
   const user = await getData<GuardianLoginSession>("user");
  const payload = { ...data, guardianId: user?._id };
  axios.post("/kid/course/assign", payload);
};

export interface KidCourseWithPopulatedKid {
  _id: string;
  kidId: {
    _id: string;
    username: string;
    password: string;
    name: string;
    age: number;
    preferredLearningTopics: string[];
    role: "kid";
    guardianId: string;
    picture: string;
    createdAt: string;
    updatedAt: string;
  };
  guardianId: string;
  bookId: string;
  assignedSeries: {
    _id: string;
    volumeId: string;
    progress: number;
    assignedAt: string;
  }[];
  assignedChapters: {
    _id: string;
    chapterId: string;
    progress: number;
    completedLessons: string[];
    assignedAt: string;
  }[];
  badgesUnlocked: string[];
  assignmentsCompleted: number;
  __v: number;
}

export const fetchKidsCourseBySeries = cache(
  async (id: string): Promise<KidCourseWithPopulatedKid[]> => {
    const resp = await axios.get(`/kid/course/series/${id}`);
    return resp?.data?.data;
  },
);

export const fetchKidsCourses = cache(
  async (): Promise<KidCourseWithPopulatedKid[]> => {
    const resp = await axios.get(`/kid/courses`);
    return resp?.data?.data;
  },
);
