"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/provider/language-provider"

const languages = [
  { label: "Français",  value: "fr",  selector: "French"  },
  { label: "English",   value: "en",  selector: "English"  },
  { label: "العربية",   value: "ar",  selector: "Arabic" },
];

export function LanguageSelector() {
  const { language, changeLanguage } = useLanguage() // You're using next-themes for theme, not language.  This is important!
  const [selectedLanguage, setSelectedLanguage] = React.useState("fr"); // Default language

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang.value);
    changeLanguage(lang.selector)
  };

  React.useEffect(() => {
    if(language === 'French') setSelectedLanguage("fr");
    if(language === 'Arabic') setSelectedLanguage("ar");
    if(language === 'English') setSelectedLanguage("en");
  }, [language])


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="capitalize">
          {languages.find(lang => lang.value === selectedLanguage)?.value} {/* Default to EN if not found */}
          <span className="sr-only">Toggle Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => handleLanguageChange(lang)}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
