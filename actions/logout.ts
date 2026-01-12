import { removeData } from "@/lib/storage";
import { logout } from "@/redux/authSlice";

export const handleLogout = async (dispatch:any) => {
  await removeData("user");
  dispatch(logout());
};
