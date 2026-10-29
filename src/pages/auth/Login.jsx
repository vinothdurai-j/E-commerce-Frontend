import { useEffect, useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, User } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import useAuth from "@/hooks/useAuth";
import useLogin from "@/hooks/useLogin";
import { notify } from "@/utils/toast"; // change to the real path of your toast file
/*
 * IMAGE: assumes login-01.png is in src/assets/images/. File names are case-sensitive
 * on Linux/Vercel/Netlify, so the name below must match the real file exactly.
 */
import loginBg from "@/assets/images/login-01.png";

/*
 * ROUTES: the paths below use your route constants if they exist, otherwise the
 * fallback strings. Align them with your router.
 */
const SIGNUP_PATH = ROUTES.REGISTER ?? "/register";
const FORGOT_PATH = ROUTES.FORGOT_PASSWORD ?? "/forgot-password";
const HOME_PATH = ROUTES.HOME ?? "/";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^[6-9]\d{9}$/; // 10-digit Indian mobile number

/* identifier = email OR 10-digit mobile number (matches backend loginValidation) */
function validate({ identifier, password }) {
  const errors = {};
  const value = identifier.trim();
  if (!value) errors.identifier = "Email or mobile number is required.";
  else if (value.includes("@")) {
    if (!EMAIL_PATTERN.test(value)) errors.identifier = "Enter a valid email address.";
  } else if (!MOBILE_PATTERN.test(value)) {
    errors.identifier = "Enter a valid email or 10-digit mobile number.";
  }
  if (!password) errors.password = "Password is required.";
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

/*
 * Props (all optional):
 *  - onSubmit({ identifier, password }): if a parent passes it, it is used instead of the built-in API call.
 *  - onGoogleSignIn(): plug in your real OAuth start here.
 * Without onSubmit, the page logs in through the useLogin hook (TanStack Query -> service).
 */
export default function LoginPage({ onSubmit, onGoogleSignIn, className }) {
  const identifierId = useId();
  const passwordId = useId();
  const navigate = useNavigate();
  const { login } = useLogin();
  const { setAuth } = useAuth();

  const [values, setValues] = useState({ identifier: "", password: "" });
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const errors = validate(values);
  const showError = (field) => touched[field] && errors[field];

  const handleChange = (e) => {
    setFormError("");
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };
  const handleBlur = (e) =>
    setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // block duplicate submissions
    setTouched({ identifier: true, password: true });
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    setFormError("");
    try {
      const payload = {
        identifier: values.identifier.trim(),
        password: values.password,
      };

      if (onSubmit) {
        await onSubmit(payload);
      } else {
        const res = await login(payload);

        // response shape: { message, data: { token, user } }
        const token = res?.data?.token ?? res?.token;
        const user = res?.data?.user ?? res?.user;

        if (!token) {
          throw new Error("Login succeeded, but the access token was not found.");
        }

        // saves token + user together and updates the UI everywhere
        setAuth({ token, user });

        notify.success("Logged in successfully");
        navigate(HOME_PATH, { replace: true });
      }
    } catch (err) {
      const message = err?.message || "We couldn't log you in. Please try again.";
      setFormError(message);
      notify.error(message);
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

  const inputClass = (field) =>
    cn(
      "h-12 w-full rounded-xl border bg-card pl-11 pr-4 font-body text-sm text-display placeholder:text-subtle",
      "transition-[border-color,box-shadow] duration-300 outline-none",
      "focus:border-terracotta focus:ring-2 focus:ring-terracotta/25",
      showError(field) ? "border-error" : "border-line-card",
      "motion-reduce:transition-none"
    );

  return (
    <main
      /* fixed + z-50: full-screen even when a parent layout (logo, white card) wraps this page */
      className={cn(
        "fixed inset-0 z-50 isolate overflow-y-auto overflow-x-hidden bg-canvas font-body",
        className
      )}
    >
      {/* background: the original image, only repositioned (never edited) */}
      <img
        src={loginBg}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        draggable={false}
        className="fixed inset-0 -z-20 h-full w-full object-cover object-[75%_center] md:object-right"
      />
      {/* subtle readability overlay, mobile only */}
      <div aria-hidden="true" className="fixed inset-0 -z-10 bg-canvas/40 md:hidden" />

      <div className="flex min-h-full w-full items-center px-4 py-28 sm:px-8 md:pl-12 lg:pl-20 xl:pl-20">
        <section
          aria-labelledby="login-heading"
          className={cn(
            "w-full max-w-[27.5rem] rounded-3xl border border-line-card bg-cream-soft/95 p-6 shadow-soft sm:p-9",
            "transition duration-700",
            EASE,
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none"
          )}
        >
          <h1
            id="login-heading"
            className="font-heading text-3xl leading-tight text-display sm:text-[2rem]"
          >
            Log in to your account
          </h1>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            {/* email or mobile */}
            <div>
              <label htmlFor={identifierId} className="mb-2 block font-body text-sm font-medium text-body">
                Email address / Mobile number
              </label>
              <div className="relative">
                <User aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
                <input
                  id={identifierId}
                  name="identifier"
                  type="text"
                  inputMode="email"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="Enter your email or mobile number"
                  value={values.identifier}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!showError("identifier")}
                  aria-describedby={`${identifierId}-error`}
                  className={inputClass("identifier")}
                />
              </div>
              {/* reserved height so the layout never jumps */}
              <p id={`${identifierId}-error`} role="alert" className="mt-1.5 min-h-5 font-body text-xs text-error">
                {showError("identifier") || ""}
              </p>
            </div>

            {/* password */}
            <div>
              <label htmlFor={passwordId} className="mb-2 block font-body text-sm font-medium text-body">
                Password
              </label>
              <div className="relative">
                <Lock aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
                <input
                  id={passwordId}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!showError("password")}
                  aria-describedby={`${passwordId}-error`}
                  className={cn(inputClass("password"), "pr-12")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors duration-300 hover:text-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta motion-reduce:transition-none"
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    <Eye aria-hidden="true" className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="mt-1.5 flex items-start justify-between gap-3">
                <p id={`${passwordId}-error`} role="alert" className="min-h-5 font-body text-xs text-error">
                  {showError("password") || ""}
                </p>
                <Link
                  to={FORGOT_PATH}
                  className="shrink-0 font-body text-sm text-muted underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* form-level message (API errors / missing integration) */}
            <p
              role="alert"
              className={cn(
                "rounded-xl border border-error/30 bg-error/5 px-4 py-3 font-body text-sm text-error",
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
                "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-pill px-6",
                "font-body text-xs font-semibold uppercase tracking-[0.18em] text-inverse",
                "transition-colors duration-300 hover:bg-terracotta focus-visible:bg-terracotta",
                "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta",
                "disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-pill",
                "motion-reduce:transition-none"
              )}
            >
              {submitting && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin motion-reduce:animate-none" />}
              {submitting ? "Logging in" : "Log in"}
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
            Don&apos;t have an account?{" "}
            <Link
              to={SIGNUP_PATH}
              className="font-semibold text-display underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              Sign up
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}