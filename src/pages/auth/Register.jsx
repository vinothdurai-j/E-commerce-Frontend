import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
/*
 * IMAGE: same background as the login page. Change the file name here if you want
 * a different one for register. Names are case-sensitive on deploy.
 */
import registerBg from "@/assets/images/login-03.png";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

function validate({ name, email, password, confirm, agree }) {
  const errors = {};
  if (!name.trim()) errors.name = "Full name is required.";
  if (!email.trim()) errors.email = "Email is required.";
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Password is required.";
  else if (password.length < MIN_PASSWORD)
    errors.password = `Use at least ${MIN_PASSWORD} characters.`;
  if (!confirm) errors.confirm = "Please confirm your password.";
  else if (confirm !== password) errors.confirm = "Passwords do not match.";
  if (!agree) errors.agree = "Please accept the terms to continue.";
  return errors;
}

function GoogleLogo() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.1 5.5c4.3-4 6.8-9.9 6.8-16.9z" />
      <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.4-4.6 2.3-8.8 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

/* One labelled input with a left icon, optional password eye toggle and a reserved error line. */
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
}) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

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
          type={isPassword && show ? "text" : type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={`${id}-error`}
          className={cn(
            "h-12 w-full rounded-xl border bg-card pl-11 font-body text-sm text-display placeholder:text-subtle",
            isPassword ? "pr-12" : "pr-4",
            "outline-none transition-[border-color,box-shadow] duration-300",
            "focus:border-terracotta focus:ring-2 focus:ring-terracotta/25",
            error ? "border-error" : "border-line-card",
            "motion-reduce:transition-none"
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors duration-300 hover:text-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta motion-reduce:transition-none"
          >
            {show ? (
              <EyeOff aria-hidden="true" className="h-4 w-4" />
            ) : (
              <Eye aria-hidden="true" className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {/* reserved height so the layout never jumps */}
      <p id={`${id}-error`} role="alert" className="mt-1.5 min-h-5 font-body text-xs text-error">
        {error || ""}
      </p>
    </div>
  );
}

/*
 * Props:
 *  - onSubmit({ name, email, password }): async. Plug in your real register call here.
 *      Resolve on success (redirect inside it), throw an Error with a friendly message on failure.
 *  - onGoogleSignIn(): plug in your real OAuth start here.
 * Without these props the page shows a notice instead of pretending to register.
 */
export default function RegisterPage({ onSubmit, onGoogleSignIn, className }) {
  const agreeId = useId();

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    agree: false,
  });
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const errors = validate(values);
  const showError = (field) => (touched[field] ? errors[field] : "");

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormError("");
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
  };
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // block duplicate submissions
    setTouched({ name: true, email: true, password: true, confirm: true, agree: true });
    if (Object.keys(errors).length) return;

    if (!onSubmit) {
      setFormError("Registration isn't connected to the backend yet.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      await onSubmit({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
    } catch (err) {
      setFormError(err?.message || "We couldn't create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = () => {
    if (!onGoogleSignIn) {
      setFormError("Google sign-in isn't configured yet.");
      return;
    }
    setFormError("");
    onGoogleSignIn();
  };

  return (
    <main
      /* fixed + z-50: full-screen even when a parent layout (logo, white card) wraps this page */
      className={cn(
        "fixed inset-0 z-50 isolate overflow-y-auto overflow-x-hidden bg-cream-soft font-body",
        className
      )}
    >
      {/* two columns on lg+: form on the left, image on the right. Mobile/tablet: form only */}
      <div className="grid min-h-full lg:grid-cols-2">
        {/* LEFT: form column */}
        <div className="flex items-center justify-center px-4 py-10 sm:px-10 lg:px-14 xl:px-20">
          <section
            aria-labelledby="register-heading"
            className={cn(
              "w-full max-w-xl",
              "transition duration-700",
              EASE,
              mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none"
            )}
          >
            <h1
              id="register-heading"
              className="font-heading text-3xl leading-tight text-display sm:text-4xl"
            >
              Create your account
            </h1>
            <p className="mt-2 font-body text-base text-muted">
              Join SHILOH for new arrivals, offers and faster checkout.
            </p>

            {/* fields sit in two columns from sm up: name + email, password + confirm */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-8 grid grid-cols-1 gap-x-4 sm:grid-cols-2"
            >
              <Field
                label="Full name"
                name="name"
                icon={User}
                autoComplete="name"
                placeholder="Enter your full name"
                value={values.name}
                error={showError("name")}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Field
                label="Email address"
                name="email"
                type="email"
                inputMode="email"
                icon={Mail}
                autoComplete="email"
                placeholder="Enter your email"
                value={values.email}
                error={showError("email")}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Field
                label="Password"
                name="password"
                type="password"
                icon={Lock}
                autoComplete="new-password"
                placeholder={`At least ${MIN_PASSWORD} characters`}
                value={values.password}
                error={showError("password")}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Field
                label="Confirm password"
                name="confirm"
                type="password"
                icon={Lock}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={values.confirm}
                error={showError("confirm")}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {/* terms */}
              <div className="pb-1 sm:col-span-2">
                <div className="flex items-start gap-3">
                  <input
                    id={agreeId}
                    name="agree"
                    type="checkbox"
                    checked={values.agree}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!showError("agree")}
                    aria-describedby={`${agreeId}-error`}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-line-card accent-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                  />
                  <label htmlFor={agreeId} className="font-body text-sm text-muted">
                    I agree to the{" "}
                    <Link
                      to={ROUTES.TERMS}
                      className="font-medium text-display underline-offset-4 hover:underline"
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      to={ROUTES.PRIVACY}
                      className="font-medium text-display underline-offset-4 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>
                <p
                  id={`${agreeId}-error`}
                  role="alert"
                  className="mt-1.5 min-h-5 font-body text-xs text-error"
                >
                  {showError("agree")}
                </p>
              </div>

              {/* form-level message (API errors / missing integration) */}
              <p
                role="alert"
                className={cn(
                  "mb-4 rounded-xl border border-error/30 bg-error/5 px-4 py-3 font-body text-sm text-error sm:col-span-2",
                  formError ? "block" : "hidden"
                )}
              >
                {formError}
              </p>

              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className={cn(
                  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-pill px-6 sm:col-span-2",
                  "font-body text-xs font-semibold uppercase tracking-[0.18em] text-inverse",
                  "transition-colors duration-300 hover:bg-terracotta focus-visible:bg-terracotta",
                  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta",
                  "disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-pill",
                  "motion-reduce:transition-none"
                )}
              >
                {submitting && (
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin motion-reduce:animate-none" />
                )}
                {submitting ? "Creating account" : "Create account"}
              </button>
            </form>

            {/* divider */}
            <div className="my-6 flex items-center gap-4" role="separator">
              <span className="h-px flex-1 bg-line-card" />
              <span className="font-body text-sm text-muted">or</span>
              <span className="h-px flex-1 bg-line-card" />
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={submitting}
              className={cn(
                "inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-line-card bg-card px-6",
                "font-body text-sm font-medium text-display",
                "transition-[border-color,box-shadow] duration-300 hover:border-terracotta hover:shadow-soft",
                "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta",
                "disabled:cursor-not-allowed disabled:opacity-70",
                "motion-reduce:transition-none"
              )}
            >
              <GoogleLogo />
              Continue with Google
            </button>

            <p className="mt-8 text-center font-body text-sm text-muted">
              Already have an account?{" "}
              <Link
                to={ROUTES.LOGIN}
                className="font-semibold text-display underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
              >
                Log in
              </Link>
            </p>
          </section>
        </div>

        {/* RIGHT: image column (hidden below lg). The original image, only repositioned. */}
        <div className="relative hidden lg:block">
          <img
            src={registerBg}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
          />
        </div>
      </div>
    </main>
  );
}