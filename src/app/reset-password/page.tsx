"use client";

import type React from "react";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { serverDomain } from "@/lib/variables";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
  const router = useRouter();
  const token = useSearchParams().get("token");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitDisabled(true);

    const form = e.currentTarget;
    const newPassword = (
      form.elements.namedItem("password") as HTMLInputElement
    ).value;
    const reTypedPassword = (
      form.elements.namedItem("confirm-password") as HTMLInputElement
    ).value;

    if (newPassword.length < 8) {
      setSubmitDisabled(false);
      return toast.error("Password must be at least 8 characters!");
    } else if (!/[A-Z]/.test(newPassword)) {
      setSubmitDisabled(false);
      return toast.error("At least one uppercase character required!");
    } else if (!/[0-9]/.test(newPassword)) {
      setSubmitDisabled(false);
      return toast.error("At least one number required!");
    } else if (!/[^A-Za-z0-9]/.test(newPassword)) {
      setSubmitDisabled(false);
      return toast.error("At least one special character required!");
    }
    if (newPassword !== reTypedPassword) {
      setSubmitDisabled(false);
      return toast.error("Passwords do not match!");
    }

    const res = await fetch(
      `${serverDomain}/api/auth/reset-password?token=${token}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword, reTypedPassword }),
      }
    );
    const result = await res.json();

    if (result.ok) {
      toast.success(result?.message);
      router.push("/login");
    } else {
      setSubmitDisabled(false);
      toast.error(result?.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showConfirmPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={submitDisabled}>
              Reset Password
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <p className="w-full">
            Remember your password?{" "}
            <Button
              variant="link"
              className="p-0 text-sm font-normal"
              onClick={() => router.push("/login")}
            >
              Back to login
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
