'use client'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "../auth-layout";
import InputError from "@/components/ui/input-error";
import { useState } from "react";
import React from 'react';
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/provider/language-provider";

export default function Form() {
  const router = useRouter();
  const [name, setName] = useState('jervi');
  const [email, setEmail] = useState('gacembekhira@gmail.com');
  const [password, setPassword] = useState('password');
  const [repeatPassword, setRepeatPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const doTranslate = useTranslation(translations);


  const fetchRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      await axios.post('/api/auth/register', {
        name: name,
        email: email,
        password: password,
        repeatPassword: repeatPassword,
      });
      const response2 = await signIn('credentials', {
        email: email,
        password: password,
        redirect: false,
      });
      if (!response2?.error) {
        toast({
          title: doTranslate('Success'),
          description: doTranslate('Register In Successfully')
        });
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      console.error('error: ', error);
      toast({
        title: doTranslate('Error'),
        description: doTranslate('Error happened'),
        variant: "destructive",
      });
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout isLogin={false}>
      {/* <Head title="Log in" /> */}
      <form onSubmit={fetchRegister} >
        <div className="flex flex-col gap-6">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="email">{doTranslate('Name')}</Label>
            <Input
              id="name"
              type="text"
              name="name"
              value={name}
              placeholder={doTranslate('Name')}
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <InputError message={''} className="mt-2" />
          </div>
          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">{doTranslate('Email')}</Label>
            <Input
              id="email"
              type="email"
              name={doTranslate('Email')}
              value={email}
              placeholder="email"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <InputError message={''} className="mt-2" />
          </div>
          {/* Password */}
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">{doTranslate('Password')}</Label>
            </div>
            <Input
              id="password"
              type="password"
              name="password"
              value={password}
              placeholder={doTranslate('Password')}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              required
              showPasswordToggle
            />
            <InputError message={''} className="mt-2" />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password_confirmation">{doTranslate('Confirm Password')}</Label>
            </div>
            <Input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              value={repeatPassword}
              placeholder={doTranslate('Password')}
              autoComplete="new-password"
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
              showPasswordToggle
            />
            <InputError message={''} className="mt-2" />
          </div>
          <Button type="submit" className="w-full items-center" disabled={loading}>
            <span> {loading ? doTranslate('Registering in...') : doTranslate('Register')} </span>
            {loading && <Loader2 className='animate-spin' />}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

const translations = {
  "Success": {
    "English": "Success",
    "French": "Succès",
    "Arabic": "نجاح"
  },
  "Register In Successfully": {
    "English": "Register In Successfully",
    "French": "Enregistré avec succès",
    "Arabic": "تم التسجيل بنجاح"
  },
  "Error": {
    "English": "Error",
    "French": "Erreur",
    "Arabic": "خطأ"
  },
  "Error happened": {
    "English": "Error happened",
    "French": "Une erreur est survenue",
    "Arabic": "حدث خطأ"
  },
  "Name": {
    "English": "Name",
    "French": "Nom",
    "Arabic": "الاسم"
  },
  "Email": {
    "English": "Email",
    "French": "Email/Courriel",
    "Arabic": "البريد الإلكتروني"
  },
  "Password": {
    "English": "Password",
    "French": "Mot de passe",
    "Arabic": "كلمة المرور"
  },
  "Confirm Password": {
    "English": "Confirm Password",
    "French": "Confirmer le mot de passe",
    "Arabic": "تأكيد كلمة المرور"
  },
  "Registering in...": {
    "English": "Registering in...",
    "French": "Enregistrement en cours...",
    "Arabic": "جاري التسجيل..."
  },
  "Register": {
    "English": "Register",
    "French": "S'inscrire/Enregistrer",
    "Arabic": "تسجيل"
  }
}