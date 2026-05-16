export default function DashboardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-light">
      <div className="text-center animate-fade-in-up">
        {/* Pine Green heading */}
        <h1 className="font-display text-5xl font-bold text-pine mb-4">
          MICo
        </h1>

        {/* Gold accent */}
        <p className="text-xl text-slate-muted mb-8">
          Michigan Community Platform
        </p>

        {/* Test card with design system */}
        <div className="mx-auto max-w-md rounded-2xl bg-sage p-8 shadow-card card-hover">
          <div className="mb-4 inline-flex h-3 w-3 rounded-full bg-gold animate-pulse-glow" />
          <p className="font-display text-lg font-semibold text-pine">
            Design System Active
          </p>
          <p className="mt-2 text-sm text-slate-muted">
            Pine Green • Detroit Gold • Petoskey Sage • Iron Slate
          </p>
        </div>
      </div>
    </div>
  );
}
