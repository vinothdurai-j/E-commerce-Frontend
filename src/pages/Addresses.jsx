import { useEffect, useId, useState } from "react";
import {
  Building2,
  Hash,
  Home,
  Landmark,
  Loader2,
  Map as MapIcon,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Star,
  Trash2,
  User,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { notify } from "@/utils/toast";
import {
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/hooks/useAddress";


const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const MOBILE_PATTERN = /^\d{10}$/;
const PINCODE_PATTERN = /^\d{6}$/;
const TYPES = ["home", "work", "other"];

const EMPTY = {
  fullName: "",
  mobile: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  type: "home",
  isDefault: false,
};

/* API data -> safe form values */
const normalize = (a) => ({
  fullName: a?.fullName ?? "",
  mobile: a?.mobile ?? "",
  addressLine1: a?.addressLine1 ?? "",
  addressLine2: a?.addressLine2 ?? "",
  landmark: a?.landmark ?? "",
  city: a?.city ?? "",
  state: a?.state ?? "",
  pincode: a?.pincode ?? "",
  country: a?.country ?? "India",
  type: a?.type ?? "home",
  isDefault: !!a?.isDefault,
});

/* matches backend addressSchema required fields */
function validateAddress(v) {
  const e = {};
  if (!v.fullName.trim()) e.fullName = "Full name is required.";
  if (!v.mobile) e.mobile = "Mobile number is required.";
  else if (!MOBILE_PATTERN.test(v.mobile)) e.mobile = "Mobile number must be 10 digits.";
  if (!v.addressLine1.trim()) e.addressLine1 = "Address is required.";
  if (!v.city.trim()) e.city = "City is required.";
  if (!v.state.trim()) e.state = "State is required.";
  if (!v.pincode) e.pincode = "Pincode is required.";
  else if (!PINCODE_PATTERN.test(v.pincode)) e.pincode = "Pincode must be 6 digits.";
  return e;
}

/* Same Field as Profile page */
function Field({
  label,
  name,
  type = "text",
  icon: Icon,
  value,
  error,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
}) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-body text-sm font-medium text-body">
        {label}
      </label>
      <div className="relative">
        <Icon
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
        />
        <input
          id={id}
          name={name}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={`${id}-error`}
          className={cn(
            "h-12 w-full rounded-xl border bg-card pl-11 pr-4 font-body text-sm text-display placeholder:text-subtle",
            "outline-none transition-[border-color,box-shadow] duration-300",
            "focus:border-terracotta focus:ring-2 focus:ring-terracotta/25",
            error ? "border-error" : "border-line-card",
            "motion-reduce:transition-none"
          )}
        />
      </div>
      <p id={`${id}-error`} role="alert" className="mt-1.5 min-h-5 font-body text-xs text-error">
        {error || ""}
      </p>
    </div>
  );
}

const primaryBtn = cn(
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-pill px-6",
  "font-body text-xs font-semibold uppercase tracking-[0.18em] text-inverse",
  "transition-colors duration-300 hover:bg-terracotta focus-visible:bg-terracotta",
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta",
  "disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-pill",
  "motion-reduce:transition-none"
);

const secondaryBtn = cn(
  "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line-card bg-card px-6",
  "font-body text-xs font-semibold uppercase tracking-[0.18em] text-display",
  "transition-colors duration-300 hover:border-terracotta hover:text-terracotta",
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta",
  "disabled:cursor-not-allowed disabled:opacity-70",
  "motion-reduce:transition-none"
);

const linkBtn = cn(
  "inline-flex items-center gap-1.5 font-body text-sm text-body",
  "transition-colors duration-300 hover:text-terracotta",
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta",
  "disabled:cursor-not-allowed disabled:opacity-60",
  "motion-reduce:transition-none"
);

/* ---------- Add / Edit form ---------- */
function AddressForm({ address, onSubmit, onCancel, submitting }) {
  const isEdit = !!address;
  const [values, setValues] = useState(() => normalize(address));
  const [touched, setTouched] = useState({});

  const errors = validateAddress(values);
  const showError = (f) => (touched[f] ? errors[f] : "");

  const handleChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;
    if (name === "mobile") value = value.replace(/\D/g, "").slice(0, 10);
    if (name === "pincode") value = value.replace(/\D/g, "").slice(0, 6);
    setValues((v) => ({ ...v, [name]: value }));
  };
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;
    setTouched(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, true])));
    if (Object.keys(errors).length) return;

    onSubmit({
      ...values,
      fullName: values.fullName.trim(),
      addressLine1: values.addressLine1.trim(),
      addressLine2: values.addressLine2.trim(),
      landmark: values.landmark.trim(),
      city: values.city.trim(),
      state: values.state.trim(),
    });
  };

  const bind = (name) => ({
    name,
    value: values[name],
    error: showError(name),
    onChange: handleChange,
    onBlur: handleBlur,
  });

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-x-6 sm:grid-cols-2">
        <Field label="Full name" icon={User} autoComplete="name" placeholder="Receiver's name" {...bind("fullName")} />
        <Field
          label="Mobile number"
          type="tel"
          inputMode="numeric"
          icon={Phone}
          autoComplete="tel-national"
          maxLength={10}
          placeholder="10-digit mobile number"
          {...bind("mobile")}
        />
        <div className="sm:col-span-2">
          <Field
            label="Address line 1"
            icon={Home}
            autoComplete="address-line1"
            placeholder="House no, building, street"
            {...bind("addressLine1")}
          />
        </div>
        <div className="sm:col-span-2">
          <Field
            label="Address line 2 (optional)"
            icon={Home}
            autoComplete="address-line2"
            placeholder="Area, colony"
            {...bind("addressLine2")}
          />
        </div>
        <div className="sm:col-span-2">
          <Field label="Landmark (optional)" icon={Landmark} placeholder="Near..." {...bind("landmark")} />
        </div>
        <Field label="City" icon={Building2} autoComplete="address-level2" placeholder="City" {...bind("city")} />
        <Field label="State" icon={MapIcon} autoComplete="address-level1" placeholder="State" {...bind("state")} />
        <Field
          label="Pincode"
          inputMode="numeric"
          icon={Hash}
          autoComplete="postal-code"
          maxLength={6}
          placeholder="6-digit pincode"
          {...bind("pincode")}
        />
      </div>

      {/* address type */}
      <fieldset className="mt-1">
        <legend className="mb-2 font-body text-sm font-medium text-body">Address type</legend>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <label
              key={t}
              className={cn(
                "cursor-pointer rounded-full border px-5 py-2 font-body text-xs font-semibold uppercase tracking-[0.18em]",
                "transition-colors duration-300 motion-reduce:transition-none",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-terracotta",
                values.type === t
                  ? "border-pill bg-pill text-inverse"
                  : "border-line-card bg-card text-display hover:border-terracotta hover:text-terracotta"
              )}
            >
              <input
                type="radio"
                name="type"
                value={t}
                checked={values.type === t}
                onChange={() => setValues((v) => ({ ...v, type: t }))}
                className="sr-only"
              />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-5 flex cursor-pointer items-center gap-2 font-body text-sm text-body">
        <input
          type="checkbox"
          checked={values.isDefault}
          onChange={(e) => setValues((v) => ({ ...v, isDefault: e.target.checked }))}
          className="h-4 w-4 accent-terracotta"
        />
        Make this my default address
      </label>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} disabled={submitting} className={secondaryBtn}>
          <X aria-hidden="true" className="h-4 w-4" />
          Cancel
        </button>
        <button type="submit" disabled={submitting} aria-busy={submitting} className={primaryBtn}>
          {submitting && (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin motion-reduce:animate-none" />
          )}
          {submitting ? "Saving" : isEdit ? "Update address" : "Save address"}
        </button>
      </div>
    </form>
  );
}

/* ---------- One address card ---------- */
function AddressCard({ address: a, onEdit, onDelete, onSetDefault, busy }) {
  return (
    <article className="flex flex-col rounded-2xl border border-line-card bg-card p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full bg-stage px-3 py-1 font-body text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-body">
          {a.type}
        </span>
        {a.isDefault && (
          <span className="rounded-full bg-terracotta/10 px-3 py-1 font-body text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-terracotta">
            Default
          </span>
        )}
      </div>

      <h3 className="font-heading text-xl text-display">{a.fullName}</h3>
      <p className="mt-1 font-body text-sm leading-relaxed text-body">
        {a.addressLine1}
        {a.addressLine2 && `, ${a.addressLine2}`}
        {a.landmark && `, ${a.landmark}`}
      </p>
      <p className="font-body text-sm text-body">
        {a.city}, {a.state} - {a.pincode}
      </p>
      <p className="font-body text-sm text-body">{a.country}</p>
      <p className="mt-2 font-body text-sm text-muted">+91 {a.mobile}</p>

      <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 border-t border-line-card pt-4 mt-4">
        <button type="button" onClick={() => onEdit(a)} className={linkBtn}>
          <Pencil aria-hidden="true" className="h-3.5 w-3.5" /> Edit
        </button>
        <button type="button" onClick={() => onDelete(a._id)} disabled={busy} className={cn(linkBtn, "hover:!text-error")}>
          <Trash2 aria-hidden="true" className="h-3.5 w-3.5" /> Delete
        </button>
        {!a.isDefault && (
          <button type="button" onClick={() => onSetDefault(a._id)} disabled={busy} className={linkBtn}>
            <Star aria-hidden="true" className="h-3.5 w-3.5" /> Set default
          </button>
        )}
      </div>
    </article>
  );
}

/* ---------- Page ---------- */
export default function Addresses({ className }) {
  const { data: addresses = [], isLoading, isError, refetch } = useAddresses();
  const addMut = useAddAddress();
  const updateMut = useUpdateAddress();
  const deleteMut = useDeleteAddress();
  const defaultMut = useSetDefaultAddress();

  const [mode, setMode] = useState(null); // null | "add" | address object (edit)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const close = () => setMode(null);

  const handleSubmit = (values) => {
    if (mode === "add") {
      addMut.mutate(values, { onSuccess: close });
    } else {
      updateMut.mutate({ id: mode._id, data: values }, { onSuccess: close });
    }
  };

  const handleDelete = (id) => notify.confirm("Delete this address?", () => deleteMut.mutate(id));

  return (
    <main className={cn("mx-auto w-full max-w-4xl px-4 py-10 sm:px-8", className)}>
      <section
        aria-labelledby="addresses-heading"
        className={cn(
          "w-full rounded-3xl border border-line-card bg-cream-soft/95 p-6 shadow-soft sm:p-9",
          "transition duration-700",
          EASE,
          mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none"
        )}
      >
        {/* header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              aria-hidden="true"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pill text-inverse"
            >
              <MapPin className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h1 id="addresses-heading" className="font-heading text-3xl leading-tight text-display sm:text-[2rem]">
                Saved addresses
              </h1>
              <p className="mt-1 font-body text-base text-muted">
                {mode ? (mode === "add" ? "Add a new delivery address." : "Update your address.") : "Manage your delivery addresses."}
              </p>
            </div>
          </div>

          {!mode && (
            <button type="button" onClick={() => setMode("add")} className={primaryBtn}>
              <Plus aria-hidden="true" className="h-4 w-4" />
              Add new
            </button>
          )}
        </div>

        {/* form */}
        {mode && (
          <div className="mt-8">
            <AddressForm
              key={mode === "add" ? "add" : mode._id}
              address={mode === "add" ? null : mode}
              onSubmit={handleSubmit}
              onCancel={close}
              submitting={addMut.isPending || updateMut.isPending}
            />
          </div>
        )}

        {/* list states */}
        {!mode && (
          <div className="mt-8">
            {isLoading && <p className="py-10 text-center font-body text-muted">Loading your addresses…</p>}

            {isError && (
              <div className="py-10 text-center font-body">
                <p className="text-error">We couldn&apos;t load your addresses.</p>
                <button type="button" onClick={() => refetch()} className="mt-3 underline">
                  Try again
                </button>
              </div>
            )}

            {!isLoading && !isError && addresses.length === 0 && (
              <p className="py-10 text-center font-body text-muted">No saved addresses yet.</p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {addresses.map((a) => (
                <AddressCard
                  key={a._id}
                  address={a}
                  onEdit={setMode}
                  onDelete={handleDelete}
                  onSetDefault={(id) => defaultMut.mutate(id)}
                  busy={deleteMut.isPending || defaultMut.isPending}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}