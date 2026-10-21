import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line bg-card px-6 py-4 font-heading text-xl text-display">
        Hazy Admin
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}