'use client';

import { useTranslation } from '@/provider/language-provider';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function LogoutActionComponent() {
  const doTranslate = useTranslation(translations);
  return (
    <span
      onClick={() => {
        signOut();
      }}
    >
      <LogOut />
      {doTranslate('Log out')}
    </span>
  );
}

const translations = {
  "Log out": {
    "English": "Log out",
    "French": "Se déconnecter",
    "Arabic": "تسجيل الخروج"
  }
}