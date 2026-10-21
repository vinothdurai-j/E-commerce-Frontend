import { Navigate, Outlet } from "react-router-dom";
import { tokenStorage } from "@/utils/tokenStorage";
import { ROUTES } from "@/constants/routes";

export default function AdminRoute() {
  // TODO: AuthContext-la user.role === "admin" check pannunga
  const isLoggedIn = Boolean(tokenStorage.get());

  if (!isLoggedIn) return <Navigate to={ROUTES.LOGIN} replace />;
  return <Outlet />;
}