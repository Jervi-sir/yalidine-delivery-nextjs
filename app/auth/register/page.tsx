'use client'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "../auth-layout";
import { Checkbox } from "@/components/ui/checkbox";
import InputError from "@/components/ui/input-error";

export default function Page() {

  return (
    <AuthLayout isLogin={false}>
      {/* <Head title="Log in" /> */}
      <form >
        <div className="flex flex-col gap-6">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="email">Name</Label>
            <Input
              id="name"
              type="text"
              name="name"
              value={''}
              placeholder="name"
              autoComplete="name"
              onChange={(e) => { }}
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
              value={''}
              placeholder="email"
              autoComplete="email"
              onChange={(e) => { }}
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
              value={''}
              placeholder="password"
              autoComplete="current-password"
              onChange={(e) => { }}
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
              value={''}
              placeholder="password"
              autoComplete="new-password"
              onChange={(e) => { }}
              required
              showPasswordToggle
            />
            <InputError message={''} className="mt-2" />
          </div>
          <Button type="submit" className="w-full" disabled={false}>
            Register
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};


