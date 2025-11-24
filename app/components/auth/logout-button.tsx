"use client";

import { SignOutButton } from "@clerk/nextjs";

export function LogoutButton() {
  return (
    <SignOutButton>
      <button className="btn btn-error btn-sm">Logout</button>
    </SignOutButton>
  );
}
