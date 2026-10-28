import { useMutation } from "@tanstack/react-query";
import registerService from "@/service/users/register";

const getMessage = (err) =>
  err?.response?.data?.message ||
  "We couldn't create your account. Please try again.";

const useRegister = () => {
  const mutation = useMutation({
    mutationFn: registerService,
  });


  const register = async (payload) => {
    try {
      return await mutation.mutateAsync(payload);
    } catch (err) {
      throw new Error(getMessage(err));
    }
  };

  return {
    register,
    isLoading: mutation.isPending,
    error: mutation.error ? getMessage(mutation.error) : "",
  };
};

export default useRegister;