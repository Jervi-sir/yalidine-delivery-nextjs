'use client'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "../auth-layout";
import { Checkbox } from "@/components/ui/checkbox";
import InputError from "@/components/ui/input-error";

export default function Page() {

  return (
    <AuthLayout isLogin={true}>
      {/* <Head title="Log in" /> */}
      {/* {status && (
        <div className="mb-4 text-sm font-medium text-green-600">
          {status}
        </div>
      )} */}

      <form >
        <div className="flex flex-col gap-6">
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
              onChange={(e) => {}}
              required
            />
            <InputError message={''} className="mt-2" />
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
              value={''}
              placeholder="password"
              autoComplete="current-password"
              onChange={(e) => {}}
              required
              showPasswordToggle
            />
            <InputError message={''} className="mt-2" />
          </div>
          <div className="block">
            <Checkbox
              id="remember"
              name="remember"
              onChange={(e) => {}}
              className="bg-neutral-900"
            />
            <label
              htmlFor="remember"
              className="pl-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>
          <Button type="submit" className="w-full" disabled={false}>
            Login
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};


