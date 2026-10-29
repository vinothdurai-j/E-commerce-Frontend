import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getMyAddresses from "@/service/address/getMyAddresses";
import addAddress from "@/service/address/addAddress";
import updateAddress from "@/service/address/updateAddress";
import deleteAddress from "@/service/address/deleteAddress";
import setDefault from "@/service/address/setDefault";
import { notify } from "@/utils/toast";

const KEY = ["addresses"];

// backend array or { addresses: [...] } edhu anuppinaalum work aagum
const normalize = (res) => (Array.isArray(res) ? res : res?.addresses ?? res?.data ?? []);

export const useAddresses = () =>
  useQuery({
    queryKey: KEY,
    queryFn: getMyAddresses,
    select: normalize,
  });

const useAddressMutation = (fn, successMsg) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      notify.success(successMsg);
    },
    onError: (err) =>
      notify.error(err?.response?.data?.message || "Something went wrong"),
  });
};

export const useAddAddress = () => useAddressMutation(addAddress, "Address added");
export const useUpdateAddress = () => useAddressMutation(updateAddress, "Address updated");
export const useDeleteAddress = () => useAddressMutation(deleteAddress, "Address deleted");
export const useSetDefaultAddress = () => useAddressMutation(setDefault, "Default address changed");