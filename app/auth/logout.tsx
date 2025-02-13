'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function LogoutActionComponent() {
  return (
    <span
      onClick={() => {
        signOut();
      }}
    >
      <LogOut />
      Log out
    </span>
  );
}