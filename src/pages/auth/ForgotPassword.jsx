import { useEffect, useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, KeyRound, Loader2, Lock, Mail } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import useForgotPassword from "@/hooks/useForgotPassword";
import useResetPassword from "@/hooks/useResetPassword";
import { notify } from "@/utils/toast"; // change to the real path of your toast file
/*
 * IMAGE: save the photo as src/assets/images/login-01.jpg (file names are case-sensitive on deploy).
 * The model stands on the LEFT and the right side is empty, so the form sits on the right.
 */
import forgotBg from "@/assets/images/foregot-pass.png";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_PATTERN = /^\d{6}$/; // backend: 6 digits
const MIN_PASSWORD = 8; // backend minimum is 6; the form is a little stricter, same as register
const RESEND_SECONDS = 30;

function validateEmail(email) {
  if (!email.trim()) return "Email is required.";
  if (!EMAIL_PATTERN.test(email.trim())) return "Enter a valid email address.";
  return "";
}

/* step 2 validation: otp + password + confirm (matches backend resetPasswordValidation) */
function validateReset({ otp, password, confirm }) {
  const errors = {};
  if (!otp) errors.otp = "OTP is required.";
  else if (!OTP_PATTERN.test(otp)) errors.otp = "Enter the 6-digit OTP.";
  if (!password) errors.password = "Password is required.";
  else if (password.length < MIN_PASSWORD)
    errors.password = `Use at least ${MIN_PASSWORD} characters.`;
  if (!confirm) errors.confirm = "Please confirm your password.";
  else if (confirm !== password) errors.confirm = "Passwords do not match.";
  return errors;
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
  maxLength,
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
          maxLength={maxLength}
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

const submitClass = cn(
  "mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-pill px-6",
  "font-body text-xs font-semibold uppercase tracking-[0.18em] text-inverse",
  "transition-colors duration-300 hover:bg-terracotta focus-visible:bg-terracotta",
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta",
  "disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-pill",
  "motion-reduce:transition-none"
);

const linkButtonClass =
  "font-body text-sm font-medium text-display underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:cursor-not-allowed disabled:opacity-60 disabled:no-underline";

/*
 * Props (all optional):
 *  - onSubmit({ email }): replaces the built-in "send OTP" API call.
 *  - onReset({ email, otp, password }): replaces the built-in "reset password" API call.
 * Without them the page uses useForgotPassword / useResetPassword (TanStack Query -> service).
 *
 * Flow: step "email" (send OTP)  ->  step "reset" (OTP + new password)  ->  login page.
 */
export default function ForgotPasswordPage({ onSubmit, onReset, className }) {
  const emailId = useId();
  const navigate = useNavigate();
  const { forgotPassword } = useForgotPassword();
  const { resetPassword } = useResetPassword();

  const [step, setStep] = useState("email"); // "email" | "reset"
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const [values, setValues] = useState({ otp: "", password: "", confirm: "" });
  const [touched, setTouched] = useState({});

  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [formError, setFormError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  /* resend countdown */
  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const emailError = emailTouched ? validateEmail(email) : "";
  const resetErrors = validateReset(values);
  const showError = (field) => (touched[field] ? resetErrors[field] : "");

  const sendOtp = async (address) => {
    const payload = { email: address };
    if (onSubmit) await onSubmit(payload);
    else await forgotPassword(payload);
  };

  /* STEP 1: send the OTP */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (submitting) return; // block duplicate submissions
    setEmailTouched(true);
    if (validateEmail(email)) return;

    setSubmitting(true);
    setFormError("");
    try {
      const address = email.trim();
      await sendOtp(address);
      notify.success("OTP sent. Please check your email.");
      setEmail(address);
      setValues({ otp: "", password: "", confirm: "" });
      setTouched({});
      setCooldown(RESEND_SECONDS);
      setStep("reset");
    } catch (err) {
      const message = err?.message || "We couldn't send the OTP. Please try again.";
      setFormError(message);
      notify.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  /* resend OTP (step 2) */
  const handleResend = async () => {
    if (resending || submitting || cooldown > 0) return;
    setResending(true);
    setFormError("");
    try {
      await sendOtp(email.trim());
      notify.success("A new OTP has been sent.");
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      const message = err?.message || "We couldn't resend the OTP. Please try again.";
      setFormError(message);
      notify.error(message);
    } finally {
      setResending(false);
    }
  };

  const handleChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;
    // otp: digits only, max 6
    if (name === "otp") value = value.replace(/\D/g, "").slice(0, 6);
    setFormError("");
    setValues((v) => ({ ...v, [name]: value }));
  };
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  /* STEP 2: verify OTP + set the new password */
  const handleReset = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setTouched({ otp: true, password: true, confirm: true });
    if (Object.keys(resetErrors).length) return;

    setSubmitting(true);
    setFormError("");
    try {
      const payload = {
        email: email.trim(),
        otp: values.otp,
        password: values.password,
      };
      if (onReset) await onReset(payload);
      else await resetPassword(payload);
      notify.success("Password reset successfully. Please log in.");
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (err) {
      const message = err?.message || "We couldn't reset your password. Please try again.";
      setFormError(message);
      notify.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const changeEmail = () => {
    setStep("email");
    setEmailTouched(false);
    setFormError("");
    setCooldown(0);
  };

  return (
    <main
      /* fixed + z-50: full-screen even when a parent layout (logo, white card) wraps this page */
      className={cn(
        "fixed inset-0 z-50 isolate overflow-y-auto overflow-x-hidden bg-card font-body",
        className
      )}
    >
      {/* background: the original photo, only repositioned. object-left keeps the model visible */}
      <img
        src={forgotBg}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        draggable={false}
        className="fixed inset-0 -z-10 h-full w-full object-cover object-left"
      />

      {/* form sits on the empty right side of the photo */}
      <div className="flex min-h-full w-full items-center justify-center px-4 py-10 sm:px-8 md:justify-end md:pr-12 lg:pr-24 xl:pr-32">
        <section
          aria-labelledby="forgot-heading"
          className={cn(
            "w-full max-w-[27.5rem] rounded-3xl border border-line-card bg-cream-soft/95 p-6 shadow-soft sm:p-9",
            "transition duration-700",
            EASE,
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none"
          )}
        >
          {step === "reset" ? (
            /* STEP 2: OTP + new password */
            <>
              <h1
                id="forgot-heading"
                className="font-heading text-3xl leading-tight text-display sm:text-[2rem]"
              >
                Reset your password
              </h1>
              <p className="mt-3 font-body text-base text-muted">
                We sent a 6-digit OTP to{" "}
                <span className="font-medium text-display break-all">{email}</span>. Enter it
                below with your new password.
              </p>

              <form onSubmit={handleReset} noValidate className="mt-8">
                <Field
                  label="OTP"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  icon={KeyRound}
                  placeholder="Enter the 6-digit OTP"
                  value={values.otp}
                  error={showError("otp")}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Field
                  label="New password"
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
                  label="Confirm new password"
                  name="confirm"
                  type="password"
                  icon={Lock}
                  autoComplete="new-password"
                  placeholder="Re-enter your new password"
                  value={values.confirm}
                  error={showError("confirm")}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                {/* form-level message (API errors) */}
                <p
                  role="alert"
                  className={cn(
                    "mb-4 rounded-xl border border-error/30 bg-error/5 px-4 py-3 font-body text-sm text-error",
                    formError ? "block" : "hidden"
                  )}
                >
                  {formError}
                </p>

                <button type="submit" disabled={submitting} aria-busy={submitting} className={submitClass}>
                  {submitting && (
                    <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin motion-reduce:animate-none" />
                  )}
                  {submitting ? "Resetting" : "Reset password"}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between gap-3">
                <button type="button" onClick={changeEmail} className={linkButtonClass}>
                  Use a different email
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0 || resending || submitting}
                  className={linkButtonClass}
                >
                  {resending ? "Sending" : cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
                </button>
              </div>
            </>
          ) : (
            /* STEP 1: ask for the email, send the OTP */
            <>
              <h1
                id="forgot-heading"
                className="font-heading text-3xl leading-tight text-display sm:text-[2rem]"
              >
                Forgot your password?
              </h1>
              <p className="mt-3 font-body text-base text-muted">
                Enter your email and we&apos;ll send you an OTP to reset it.
              </p>

              <form onSubmit={handleSendOtp} noValidate className="mt-8">
                <label htmlFor={emailId} className="mb-2 block font-body text-sm font-medium text-body">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
                  />
                  <input
                    id={emailId}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setFormError("");
                      setEmail(e.target.value);
                    }}
                    onBlur={() => setEmailTouched(true)}
                    aria-invalid={!!emailError}
                    aria-describedby={`${emailId}-error`}
                    className={cn(
                      "h-12 w-full rounded-xl border bg-card pl-11 pr-4 font-body text-sm text-display placeholder:text-subtle",
                      "outline-none transition-[border-color,box-shadow] duration-300",
                      "focus:border-terracotta focus:ring-2 focus:ring-terracotta/25",
                      emailError ? "border-error" : "border-line-card",
                      "motion-reduce:transition-none"
                    )}
                  />
                </div>
                {/* reserved height so the layout never jumps */}
                <p
                  id={`${emailId}-error`}
                  role="alert"
                  className="mt-1.5 min-h-5 font-body text-xs text-error"
                >
                  {emailError}
                </p>

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

                <button type="submit" disabled={submitting} aria-busy={submitting} className={submitClass}>
                  {submitting && (
                    <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin motion-reduce:animate-none" />
                  )}
                  {submitting ? "Sending" : "Send OTP"}
                </button>
              </form>
            </>
          )}

          <p className="mt-8 text-center font-body text-sm text-muted">
            <Link
              to={ROUTES.LOGIN}
              className="group inline-flex items-center gap-2 font-semibold text-display underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              <ArrowLeft
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
              />
              Back to log in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}