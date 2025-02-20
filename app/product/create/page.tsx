'use client'

import { Label } from "@/components/ui/label";
import { useTranslation } from "@/provider/language-provider";
import useHeadbarInsetStore from "@/zustand/headbarInsetStore";

export default function Page() {
  const doTranslate = useTranslation(translations);
  const setHeaderTitles = useHeadbarInsetStore((state: any) => state.setHeaderTitles);
  setHeaderTitles([doTranslate('Product'), doTranslate('Create')]);
  return (
    <div className="flex h-full justify-center items-center ">
      <Label>{doTranslate('Coming soons')}</Label>
    </div>
  );
}

const translations = {
  "Product": {
    "English": "Product",
    "French": "Produit",
    "Arabic": "المنتج"
  },
  "Create": {
    "English": "Create",
    "French": "Créer",
    "Arabic": "إنشاء"
  },
  "Coming soons": {
    "English": "Coming soons",
    "French": "Bientôt disponible",
    "Arabic": "قريباً"
  },
}