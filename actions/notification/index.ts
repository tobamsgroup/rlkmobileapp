import axios from "@/lib/axios"
import { getData } from "@/lib/storage";
import { GuardianLoginSession, NotificationProp } from "@/types";


export const createNotification = async (info: any) => {
    const res = await axios.post("/notifications", info)
    return res.data
};

export type NotificationType =
  | 'feedback_received'
  | 'new_message'
  | 'assignment_due'
  | 'course_completed'; 

export interface NotificationMetadata {
  achievementId?: string;
  points?: number;
  [key: string]: any; 
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: NotificationType;
  metadata: NotificationMetadata;
  createdAt: string; 
  updatedAt: string; 
}

export const getAllNotifications = async (): Promise<NotificationProp[]> => {
    const user = await getData<GuardianLoginSession>('user')
    const res = await axios.get("/notifications")
    if (user?.role?.toLowerCase() as unknown === "kid"){
        return res.data?.notifications
    }else{
        return res.data?.guardian
    }
};

export const getUnreadCount = async () => {
    const res = await axios.get("/notifications/unread-count")
    return res.data;
};

export const getReadNotifications = async () => {
    const res = await axios.get("/notifications/read");
    return res.data;

};


export const getUnreadNotifications = async () => {
    const res = await axios.get("/notifications/unread");
    return res.data;

};

export const getSingleNotifications = async () => {
    const notificationId = ''
   const res= await axios.get(`/notifications/${notificationId}`)
    return res.data;

}

export const updateMarkallRead = async () => {
    const res = await axios.patch('/notifications/mark-all-read')
    return res.data
}