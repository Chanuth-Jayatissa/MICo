"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  Network,
  UserCircle,
  LogOut,
} from "lucide-react";
import { signOut } from "@/app/auth/actions";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/events", icon: Calendar, label: "Events" },
  { href: "/jobs", icon: Briefcase, label: "Jobs" },
  { href: "/network", icon: Network, label: "Network" },
  { href: "/profile", icon: UserCircle, label: "Profile" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-20 flex-col items-center bg-gradient-pine py-6 shadow-lg">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="mb-10 flex flex-col items-center group"
      >
        <div className="relative">
          <span className="font-display text-xl font-bold text-white tracking-tight group-hover:text-gold transition-colors duration-300">
            MI
          </span>
          <span className="font-display text-xl font-bold text-gold tracking-tight">
            Co
          </span>
          {/* Subtle glow behind logo on hover */}
          <div className="absolute inset-0 rounded-full bg-gold/0 blur-xl transition-all duration-500 group-hover:bg-gold/20" />
        </div>
      </Link>

      {/* Navigation Items */}
      <nav className="flex flex-1 flex-col items-center gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-white/15 shadow-lg shadow-gold/20"
                  : "hover:bg-white/10"
              }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute -left-[22px] h-8 w-1 rounded-r-full bg-gold shadow-gold-glow animate-scale-in" />
              )}

              <Icon
                className={`h-5 w-5 transition-all duration-300 ${
                  isActive
                    ? "text-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                    : "text-pine-100/50 group-hover:text-pine-100/80 group-hover:scale-110"
                }`}
              />

              {/* Tooltip */}
              <div className="absolute left-full ml-3 rounded-lg bg-slate-iron px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1 whitespace-nowrap">
                {item.label}
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 h-2 w-2 rotate-45 bg-slate-iron" />
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Sign Out Button */}
      <button
        onClick={() => signOut()}
        className="group flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 hover:bg-white/10"
      >
        <LogOut className="h-5 w-5 text-pine-100/40 transition-all duration-300 group-hover:text-error group-hover:scale-110" />

        {/* Tooltip */}
        <div className="absolute left-full ml-3 rounded-lg bg-slate-iron px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1 whitespace-nowrap">
          Sign out
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 h-2 w-2 rotate-45 bg-slate-iron" />
        </div>
      </button>
    </aside>
  );
}
