'use client'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "../auth-layout";
import InputError from "@/components/ui/input-error";
import { FormEvent, useState } from "react";
import React from 'react';
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Form() {
  const router = useRouter();
  const [name, setName] = useState(undefined);
  const [email, setEmail] = useState(undefined);
  const [password, setPassword] = useState(undefined);
  const [repeatPassword, setRepeatPassword] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const fetchRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await axios.post('/api/auth/register', {
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
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      console.error('error: ', error);
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
            <Label htmlFor="email">Name</Label>
            <Input
              id="name"
              type="text"
              name="name"
              value={name}
              placeholder="name"
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <InputError message={''} className="mt-2" />
          </div>
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
            <InputError message={''} className="mt-2" />
          </div>
          {/* Password */}
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
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
              showPasswordToggle
            />
            <InputError message={''} className="mt-2" />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password_confirmation">Confirm Password</Label>
            </div>
            <Input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              value={repeatPassword}
              placeholder="password"
              autoComplete="new-password"
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
              showPasswordToggle
            />
            <InputError message={''} className="mt-2" />
          </div>
          <Button type="submit" className="w-full items-center" disabled={loading}>
            <span> {loading ? 'Registering in...' : 'Register'} </span>
            {loading && <Loader2 className='animate-spin' />}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};