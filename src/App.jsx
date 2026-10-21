import { Toaster } from "react-hot-toast";
import AppRoutes from "@/routes/AppRoutes";
import ScrollToTop from "@/components/common/ScrollToTop";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { toastOptions } from "@/utils/toast";

export default function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <AppRoutes />
      <Toaster position="top-right" toastOptions={toastOptions} />
    </ErrorBoundary>
  );
}