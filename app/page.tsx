'use client'
import { MainLogo } from "@/components/MainLogo";
import { useSession } from "next-auth/react";
import { GhostIcon, UnlockIcon, UnlockKeyholeIcon } from "lucide-react";
import useHeadbarInsetStore from "@/zustand/headbarInsetStore";
import { useTranslation } from "@/provider/language-provider";

export default function Home() {
  const { data: session } = useSession()
  const setHeaderTitles = useHeadbarInsetStore((state: any) => state.setHeaderTitles);
  setHeaderTitles(['Welcome To ' + process.env.NEXT_PUBLIC_BRAND]);

  const doTranslate = useTranslation(translations);

  return (
    <div className="items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="mt-5 sm:-mt-10 flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <MainLogo />
        <ol className="-mt-10 mx-auto list-inside list-decimal text-sm text-center font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 text-center">
            {doTranslate('Deliver')}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              {doTranslate('Quickly')}
            </code>
          </li>
          <li className="text-center">{doTranslate('No Cost for')}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              {doTranslate('Le Retour')}
            </code>
          </li>
        </ol>
        <div className="mx-auto flex gap-4 items-center justify-center flex-col sm:flex-row">
          {session
            ? <a
              className="mx-auto rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              href="/dashboard"
              rel="noopener noreferrer"
            >
              <GhostIcon />
              {doTranslate('Go To Dashboard')}
            </a>
            : <a
              className="mx-auto rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-48"
              href="/auth/login"
              rel="noopener noreferrer"
            >
              <UnlockKeyholeIcon />
              {doTranslate('Login')}
            </a>
          }
        </div>
      </main>
    </div>
  );
}


const translations = {
  "Deliver": {
    "English": "Deliver",
    "French": "Livrer",
    "Arabic": "توصيل"
  },
  "Quickly": {
    "English": "Quickly",
    "French": "Rapidement",
    "Arabic": "بسرعة"
  },
  "No Cost for": {
    "English": "No Cost for",
    "French": "Sans frais pour",
    "Arabic": "بدون تكلفة لـ"
  },
  "Le Retour": {
    "English": "Le Retour",
    "French": "Le Retour",
    "Arabic": "الإرجاع"
  },
  "Go To Dashboard": {
    "English": "Go To Dashboard",
    "French": "Aller au tableau de bord",
    "Arabic": "الذهاب إلى لوحة التحكم"
  },
  "Login": {
    "English": "Login",
    "French": "Se connecter",
    "Arabic": "تسجيل الدخول"
  },
}