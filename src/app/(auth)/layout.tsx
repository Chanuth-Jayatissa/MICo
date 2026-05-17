import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — MICo",
  description: "Sign in to your MICo account to access Michigan tech events, jobs, and insider referrals.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Michigan Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-pine relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-pine-light/20 blur-3xl" />
        <div className="absolute bottom-12 right-12 h-64 w-64 rounded-full bg-gold/10 blur-2xl" />
        <div className="absolute top-1/3 right-1/4 h-48 w-48 rounded-full bg-pine-light/10 blur-xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tight">
              MICo
            </h1>
            <p className="mt-1 text-pine-100/70 text-sm">
              Michigan Community Platform
            </p>
          </div>

          {/* Hero Text */}
          <div className="max-w-md">
            <h2 className="font-display text-3xl font-bold leading-tight text-white mb-4">
              Welcome home to the Mitten.
            </h2>
            <p className="text-lg text-pine-100/80 leading-relaxed">
              Your AI-powered gateway to Michigan&apos;s tech community. 
              Discover local events, find tailored opportunities, and connect 
              with insider referrals — all powered by MICo AI.
            </p>

            {/* Feature pills */}
            <div className="mt-8 flex flex-wrap gap-3">
              {["AI Job Matching", "Event Discovery", "Insider Referrals"].map(
                (feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm"
                  >
                    {feature}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Bottom */}
          <p className="text-sm text-pine-100/50">
            Powered by MICo AI · Built for Michigan
          </p>
        </div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex w-full items-center justify-center bg-surface-light px-6 lg:w-1/2">
        {children}
      </div>
    </div>
  );
}
