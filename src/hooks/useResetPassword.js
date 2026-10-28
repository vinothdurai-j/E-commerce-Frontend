// hooks/useResetPassword.js
import { useMutation } from "@tanstack/react-query";
import resetPasswordService from "@/service/users/resetPassword";

const getMessage = (err) =>
  err?.response?.data?.message ||
  "We couldn't reset your password. Please try again.";

const useResetPassword = () => {
  const mutation = useMutation({
    mutationFn: resetPasswordService,
  });

  const resetPassword = async (payload) => {
    try {
      return await mutation.mutateAsync(payload);
    } catch (err) {
      throw new Error(getMessage(err));
    }
  };

  return {
    resetPassword,
    isLoading: mutation.isPending,
    error: mutation.error ? getMessage(mutation.error) : "",
  };
};

export default useResetPassword;