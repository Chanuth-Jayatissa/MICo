"use client";

import { MicoProvider } from "@/lib/store/mico-store";
import ToastContainer from "@/components/ui/ToastContainer";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MicoProvider>
      {children}
      <ToastContainer />
    </MicoProvider>
  );
}
