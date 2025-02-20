'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AuthLayout } from '../auth-layout';
import InputError from '@/components/ui/input-error';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/provider/language-provider';

export default function Form() {
  const router = useRouter();
  const [email, setEmail] = useState('gacembekhira@gmail.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const doTranslate = useTranslation(translations);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await signIn('credentials', {
        email: email,
        password: password,
        redirect: false,
      });
      if (!response?.error) {
        toast({
          title: doTranslate('Success'),
          description: doTranslate('Logged In Successfully'),
        });
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError(error)
      toast({
        title: doTranslate('Error'),
        description: doTranslate('Error happened'),
        variant: "destructive",
      });
    } finally {
      setLoading(false)
    }
  };

  return (
    <AuthLayout isLogin={true}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email">{doTranslate('Email')}</Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={email}
            placeholder={doTranslate('Email')}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputError message={error || ''} className="mt-2" />
        </div>
        {/* Password */}
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">{doTranslate('Password')}</Label>
            <a
              href="#"
              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
            >
              {doTranslate('Forgot your password?')}
            </a>
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
          />
          <InputError message={error || ''} className="mt-2" />
        </div>
        {/* <div className="block">
          <Checkbox
            id="remember"
            name="remember"
            onChange={(e) => { }}
            className="bg-neutral-900"
          />
          <label
            htmlFor="remember"
            className="pl-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </label>
        </div> */}
        <Button type="submit" className="w-full items-center" disabled={loading}>
          <span> {loading ? doTranslate('Logging in...') : doTranslate('Login')} </span>
          {loading && <Loader2 className='animate-spin' />}
        </Button>
      </form>
    </AuthLayout>
  );
}


const translations = {
  "Success": {
    "English": "Success",
    "French": "Succès",
    "Arabic": "نجاح"
  },
  "Error": {
    "English": "Error",
    "French": "Erreur",
    "Arabic": "خطأ"
  },
  "Logged In Successfully": {
    "English": "Logged In Successfully",
    "French": "Connecté avec succès",
    "Arabic": "تم تسجيل الدخول بنجاح"
  },
  "Error happened": {
    "English": "Error happened",
    "French": "Une erreur est survenue",
    "Arabic": "حدث خطأ"
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
  "Forgot your password?": {
    "English": "Forgot your password?",
    "French": "Mot de passe oublié ?",
    "Arabic": "نسيت كلمة المرور؟"
  },
  "Logging in...": {
    "English": "Logging in...",
    "French": "Connexion en cours...",
    "Arabic": "جاري تسجيل الدخول..."
  },
  "Login": {
    "English": "Login",
    "French": "Se connecter/Connexion",
    "Arabic": "تسجيل الدخول"
  }
}