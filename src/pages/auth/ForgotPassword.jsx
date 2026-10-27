import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
/*
 * IMAGE: save the photo as src/assets/images/login-01.jpg (file names are case-sensitive on deploy).
 * The model stands on the LEFT and the right side is empty, so the form sits on the right.
 */
import forgotBg from "@/assets/images/foregot-pass.png";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
  if (!email.trim()) return "Email is required.";
  if (!EMAIL_PATTERN.test(email.trim())) return "Enter a valid email address.";
  return "";
}

/*
 * Props:
 *  - onSubmit({ email }): async. Plug in your real "send reset link" call here.
 *      Resolve when the request was accepted, throw an Error with a friendly message on failure.
 * Without this prop the page shows a notice instead of pretending that an email was sent.
 */
export default function ForgotPasswordPage({ onSubmit, className }) {
  const emailId = useId();

  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [sentTo, setSentTo] = useState(""); // set only after a real, successful request
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const error = touched ? validateEmail(email) : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // block duplicate submissions
    setTouched(true);
    if (validateEmail(email)) return;

    if (!onSubmit) {
      setFormError("Password reset isn't connected to the backend yet.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      await onSubmit({ email: email.trim() });
      setSentTo(email.trim());
    } catch (err) {
      setFormError(err?.message || "We couldn't send the reset link. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSentTo("");
    setTouched(false);
    setFormError("");
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
          {sentTo ? (
            /* success state: shown only after onSubmit really resolved */
            <div role="status">
              <CheckCircle2 aria-hidden="true" className="h-10 w-10 text-terracotta" />
              <h1
                id="forgot-heading"
                className="mt-5 font-heading text-3xl leading-tight text-display sm:text-[2rem]"
              >
                Check your inbox
              </h1>
              <p className="mt-3 font-body text-base text-muted">
                If an account exists for{" "}
                <span className="font-medium text-display break-all">{sentTo}</span>, you will
                receive a link to reset your password shortly.
              </p>

              <button
                type="button"
                onClick={reset}
                className="mt-8 font-body text-sm font-medium text-display underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              <h1
                id="forgot-heading"
                className="font-heading text-3xl leading-tight text-display sm:text-[2rem]"
              >
                Forgot your password?
              </h1>
              <p className="mt-3 font-body text-base text-muted">
                Enter your email and we&apos;ll send you a link to reset it.
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-8">
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
                    onBlur={() => setTouched(true)}
                    aria-invalid={!!error}
                    aria-describedby={`${emailId}-error`}
                    className={cn(
                      "h-12 w-full rounded-xl border bg-card pl-11 pr-4 font-body text-sm text-display placeholder:text-subtle",
                      "outline-none transition-[border-color,box-shadow] duration-300",
                      "focus:border-terracotta focus:ring-2 focus:ring-terracotta/25",
                      error ? "border-error" : "border-line-card",
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
                  {error}
                </p>

                {/* form-level message (API errors / missing integration) */}
                <p
                  role="alert"
                  className={cn(
                    "mb-4 mt-2 rounded-xl border border-error/30 bg-error/5 px-4 py-3 font-body text-sm text-error",
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
                    "mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-pill px-6",
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
                  {submitting ? "Sending" : "Send reset link"}
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