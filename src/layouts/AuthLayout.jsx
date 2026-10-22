import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-hero px-4">
      <Link to="/" className="mb-6 font-heading text-3xl font-semibold text-display">
        SHILOH
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-line bg-card p-8 shadow-soft">
        <Outlet />
      </div>
    </div>
  );
}