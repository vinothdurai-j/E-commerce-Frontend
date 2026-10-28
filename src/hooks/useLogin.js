import { useMutation } from "@tanstack/react-query";
import loginService from "@/service/users/login";

const getMessage = (err) =>
  err?.response?.data?.message ||
  "We couldn't log you in. Please try again.";

const useLogin = () => {
  const mutation = useMutation({
    mutationFn: loginService,
  });

  const login = async (payload) => {
    try {
      return await mutation.mutateAsync(payload);
    } catch (err) {
      throw new Error(getMessage(err));
    }
  };

  return {
    login,
    isLoading: mutation.isPending,
    error: mutation.error ? getMessage(mutation.error) : "",
  };
};

export default useLogin;