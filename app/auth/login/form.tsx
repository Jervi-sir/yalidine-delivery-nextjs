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
import LogoutActionComponent from '../logout';

export default function Form() {
  const router = useRouter();
  const [email, setEmail] = useState('gacembekhira@gmail.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  };

  return (
    <AuthLayout isLogin={true}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={email}
            placeholder="email"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputError message={error || ''} className="mt-2" />
        </div>
        {/* Password */}
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            value={password}
            placeholder="password"
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
          <span> {loading ? 'Logging in...' : 'Login'} </span>
          {loading && <Loader2 className='animate-spin' />}
        </Button>
      </form>
    </AuthLayout>
  );
}
