import { useEffect, useId, useState } from "react";
import { Loader2, Mail, Pencil, Phone, User, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { notify } from "@/utils/toast";
import useAuth from "@/hooks/useAuth";
import useProfile from "@/hooks/useProfile";
import modelImg from "@/assets/images/Men’s01.png"; // rename the file: no curly apostrophe

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^\d{10}$/; // backend: 10 digits

/* turns API data into safe form values (API fields can be missing) */
const normalize = (u) => ({
  username: u?.username ?? "",
  email: u?.email ?? "",
  mobile: u?.mobile ?? "",
});

/* matches backend registerValidation */
function validateProfile({ username, email, mobile }) {
  const errors = {};
  if (!username.trim()) errors.username = "Name is required.";
  if (!email.trim()) errors.email = "Email is required.";
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Enter a valid email address.";
  if (!mobile) errors.mobile = "Mobile number is required.";
  else if (!MOBILE_PATTERN.test(mobile)) errors.mobile = "Mobile number must be 10 digits.";
  return errors;
}

/* One labelled input. In view mode it is read-only and looks like plain text. */
function Field({
  label,
  name,
  type = "text",
  icon: Icon,
  value,
  error,
  readOnly,
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
          readOnly={readOnly}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={`${id}-error`}
          className={cn(
            "h-12 w-full rounded-xl border pl-11 pr-4 font-body text-sm text-display placeholder:text-subtle",
            "outline-none transition-[border-color,box-shadow,background-color] duration-300",
            readOnly
              ? "cursor-default border-line-card bg-transparent"
              : "bg-card focus:border-terracotta focus:ring-2 focus:ring-terracotta/25",
            !readOnly && (error ? "border-error" : "border-line-card"),
            "motion-reduce:transition-none"
          )}
        />
      </div>
      {/* reserved height so the layout never jumps */}
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

/*
 * The form. It is only rendered once the API data is ready (see Profile below),
 * so its initial state always comes from real data.
 *  - user: { username, email, mobile }
 *  - onSave(values): async, calls the update API
 */
function ProfileForm({ user, onSave, className }) {
  const [saved, setSaved] = useState(() => normalize(user)); // last saved values
  const [values, setValues] = useState(() => normalize(user)); // form values
  const [touched, setTouched] = useState({});
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // when fresh data arrives from the API (refetch), update the view
  useEffect(() => {
    if (editing) return;
    const next = normalize(user);
    setSaved(next);
    setValues(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const errors = validateProfile(values);
  const showError = (field) => (editing && touched[field] ? errors[field] : "");
  const initial = (saved.username || "?").trim().charAt(0).toUpperCase();

  const handleChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;
    // mobile: digits only, max 10
    if (name === "mobile") value = value.replace(/\D/g, "").slice(0, 10);
    setFormError("");
    setValues((v) => ({ ...v, [name]: value }));
  };
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const startEdit = () => {
    setValues(saved);
    setTouched({});
    setFormError("");
    setEditing(true);
  };

  const cancelEdit = () => {
    setValues(saved);
    setTouched({});
    setFormError("");
    setEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setTouched({ username: true, email: true, mobile: true });
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    setFormError("");
    try {
      const payload = {
        username: values.username.trim(),
        email: values.email.trim(),
        mobile: values.mobile,
      };
      await onSave(payload);
      setSaved(payload);
      setValues(payload);
      setEditing(false);
      notify.success("Profile updated successfully.");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "We couldn't update your profile. Please try again.";
      setFormError(message);
      notify.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={cn("mx-auto w-full max-w-4xl px-4 py-10 sm:px-8", className)}>
      {/* model image on the left, card on the right (image hidden on small screens) */}
      <div className="flex items-center justify-center">
        <img
          src={modelImg}
          alt=""
          aria-hidden="true"
          decoding="async"
          draggable={false}
          className={cn(
            "pointer-events-none -mr-2 hidden h-[22rem] w-auto shrink-0 select-none object-contain md:block lg:h-[25rem]",
            "transition duration-700",
            EASE,
            mounted ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0",
            "motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none"
          )}
        />

        <section
          aria-labelledby="profile-heading"
          className={cn(
            "w-full max-w-[40rem] rounded-3xl border border-line-card bg-cream-soft/95 p-6 shadow-soft sm:p-9",
            "transition duration-700",
            EASE,
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none"
          )}
        >
          {/* header: avatar + title */}
          <div className="flex items-center gap-4">
            <div
              aria-hidden="true"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pill font-heading text-2xl text-inverse"
            >
              {initial}
            </div>
            <div className="min-w-0">
              <h1
                id="profile-heading"
                className="font-heading text-3xl leading-tight text-display sm:text-[2rem]"
              >
                Personal information
              </h1>
              <p className="mt-1 font-body text-base text-muted">
                {editing ? "Update your details and save." : "Your account details."}
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} noValidate className="mt-8">
            <div className="grid gap-x-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field
                  label="Full name / Username"
                  name="username"
                  icon={User}
                  autoComplete="username"
                  placeholder="Enter your name"
                  value={editing ? values.username : saved.username}
                  error={showError("username")}
                  readOnly={!editing}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <Field
                label="Email address"
                name="email"
                type="email"
                inputMode="email"
                icon={Mail}
                autoComplete="email"
                placeholder="Enter your email"
                value={editing ? values.email : saved.email}
                error={showError("email")}
                readOnly={!editing}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Field
                label="Mobile number"
                name="mobile"
                type="tel"
                inputMode="numeric"
                icon={Phone}
                autoComplete="tel-national"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={editing ? values.mobile : saved.mobile}
                error={showError("mobile")}
                readOnly={!editing}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            {/* form-level message (API errors) */}
            <p
              role="alert"
              className={cn(
                "mb-4 mt-2 rounded-xl border border-error/30 bg-error/5 px-4 py-3 font-body text-sm text-error",
                formError ? "block" : "hidden"
              )}
            >
              {formError}
            </p>

            <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              {editing ? (
                <>
                  <button type="button" onClick={cancelEdit} disabled={submitting} className={secondaryBtn}>
                    <X aria-hidden="true" className="h-4 w-4" />
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} aria-busy={submitting} className={primaryBtn}>
                    {submitting && (
                      <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin motion-reduce:animate-none" />
                    )}
                    {submitting ? "Saving" : "Save changes"}
                  </button>
                </>
              ) : (
                <button type="button" onClick={startEdit} className={primaryBtn}>
                  <Pencil aria-hidden="true" className="h-4 w-4" />
                  Edit profile
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

/*
 * The page you use in your router: <Route path={ROUTES.PROFILE} element={<Profile />} />
 * It gets the id from the logged-in user, loads the profile from the API,
 * and renders the form only when the data is ready.
 */
export default function Profile({ className }) {
  const { user: authUser, updateAuthUser } = useAuth();
  const { user, isLoading, isError, refetch, updateProfile } = useProfile(authUser?.id);

  if (isLoading) {
    return <p className="p-10 text-center font-body text-muted">Loading your profile…</p>;
  }

  if (isError || !user) {
    return (
      <div className="p-10 text-center font-body">
        <p className="text-error">We couldn&apos;t load your profile.</p>
        <button type="button" onClick={() => refetch()} className="mt-3 underline">
          Try again
        </button>
      </div>
    );
  }

  const handleSave = async (values) => {
    await updateProfile(values);
    updateAuthUser(values); // keeps the navbar name in sync
  };

  return <ProfileForm user={user} onSave={handleSave} className={className} />;
}