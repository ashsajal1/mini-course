"use client";

import { ProgressProvider } from "@bprogress/next/app";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider
      height="3px"
      color="#2563eb"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
}
