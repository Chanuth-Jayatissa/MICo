"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { signInWithEmail, signInWithGoogle } from "@/app/auth/actions";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  async function handleEmailLogin(formData: FormData) {
    setIsLoading(true);
    await signInWithEmail(formData);
    setIsLoading(false);
  }

  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    await signInWithGoogle();
    setIsGoogleLoading(false);
  }

  return (
    <div className="w-full max-w-md animate-fade-in-up">
      {/* Mobile Logo */}
      <div className="mb-8 lg:hidden">
        <h1 className="font-display text-3xl font-bold text-pine">MICo</h1>
        <p className="text-sm text-slate-muted">Michigan Community Platform</p>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-slate-iron">
          Welcome back
        </h2>
        <p className="mt-2 text-slate-muted">
          Sign in to access your personalized Michigan tech community.
        </p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error animate-scale-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{decodeURIComponent(error)}</span>
        </div>
      )}

      {message && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-success/20 bg-success/5 px-4 py-3 text-sm text-success animate-scale-in">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Google Sign In */}
      <button
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading}
        className="group flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white px-4 py-3.5 font-medium text-slate-iron shadow-soft transition-all duration-200 hover:border-pine/30 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isGoogleLoading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-pine/30 border-t-pine" />
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        <span>Continue with Google</span>
      </button>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-wider text-slate-light">
          or
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Email Form */}
      <form action={handleEmailLogin} className="space-y-4">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-slate-iron"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-light" />
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-border bg-white py-3 pl-11 pr-4 text-slate-iron placeholder:text-slate-light transition-all duration-200 outline-none focus:border-pine focus:ring-2 focus:ring-pine/10"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-iron"
            >
              Password
            </label>
            <button type="button" className="text-xs text-pine hover:text-pine-light transition-colors">
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-light" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-border bg-white py-3 pl-11 pr-12 text-slate-iron placeholder:text-slate-light transition-all duration-200 outline-none focus:border-pine focus:ring-2 focus:ring-pine/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-light hover:text-slate-muted transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-pine py-3.5 font-semibold text-white shadow-md transition-all duration-200 hover:bg-pine-light hover:shadow-pine-glow active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <span>Signing in...</span>
            </div>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Sign Up Link */}
      <p className="mt-8 text-center text-sm text-slate-muted">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-pine hover:text-pine-light transition-colors"
        >
          Create one for free
        </Link>
      </p>
    </div>
  );
}
