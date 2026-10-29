import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getUserById from "@/service/users/getUserById";
import updateUser from "@/service/users/updateUser";

export const profileKey = (id) => ["profile", id];

/* Adjust this if your backend wraps the user, e.g. { data: {...} } or { user: {...} } */
const pickUser = (res) => res?.data ?? res?.user ?? res;

export default function useProfile(id) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: profileKey(id),
    queryFn: () => getUserById(id),
    select: pickUser,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: (values) => updateUser({ id, ...values }),
    onSuccess: (res, values) => {
      // keep the cache in sync so the page shows the new values immediately
      queryClient.setQueryData(profileKey(id), (old) => {
        const updated = pickUser(res);
        const base = pickUser(old) ?? {};
        return { ...base, ...values, ...(typeof updated === "object" ? updated : {}) };
      });
    },
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    updateProfile: mutation.mutateAsync, // returns a promise, so Profile's try/catch works
    isUpdating: mutation.isPending,
  };
}