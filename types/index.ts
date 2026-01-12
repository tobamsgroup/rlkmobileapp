
export enum Role {
  TEACHER = "Teacher",
  PARENT = "Parent",
  KID = "Kid",
}

export type GuardianLoginSession = {
  _id: string;
  password: string;
  role: Role;
  kidIds: string[];
  email: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  firstName?: string;
  lastName?: string;
};

export type GuardianProfileProps = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  picture: string;
  isVerified: true;
  totalKids: number;
  activeTrackCount: number;
  createdAt: string;
};

export type KidLoginSession = {
  _id: string;
  password: string;
  role: Role;
  kidIds: string[];
  name: string;
  username: string;
  picture: string;
  age: number;
  preferredLearningTopics: string;
  createdAt: string;
  updatedAt: string;
  guardianId: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
};


export type  IAvatar = {
  id: string;
  url: string;
}