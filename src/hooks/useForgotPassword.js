// hooks/useForgotPassword.js
import { useMutation } from "@tanstack/react-query";
import forgotPasswordService from "@/service/users/forgotPassword";

const getMessage = (err) =>
  err?.response?.data?.message ||
  "We couldn't send the reset link. Please try again.";

const useForgotPassword = () => {
  const mutation = useMutation({
    mutationFn: forgotPasswordService,
  });

  const forgotPassword = async (payload) => {
    try {
      return await mutation.mutateAsync(payload);
    } catch (err) {
      throw new Error(getMessage(err));
    }
  };

  return {
    forgotPassword,
    isLoading: mutation.isPending,
    error: mutation.error ? getMessage(mutation.error) : "",
  };
};

export default useForgotPassword;