"use client";

import type React from "react";

import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/lib/userStore";
import { serverDomain } from "@/lib/variables";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [submitDisabled2, setSubmitDisabled2] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitDisabled(true);

    const form = e.currentTarget;
    const email = (
      form.elements.namedItem("email") as HTMLInputElement
    ).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    const res = await fetch(`${serverDomain}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const result = await res.json();

    if (result.ok) {
      Cookies.set("token", result?.token, {
        secure: true,
        sameSite: "Strict",
        expires: 7,
      });
      setUser({ available: true, role: result?.userRole });
      toast.success("Logged in successfully.");
      if (result?.userRole === "admin") {
        router.replace("/admin/dashboard");
      } else if (result?.userRole === "seller") {
        router.replace("/seller/dashboard");
      }
    } else if (result.message === "User not found") {
      setSubmitDisabled(false);
      toast.error("User not found with this email address.");
    } else if (result?.message === "User not active") {
      setSubmitDisabled(false);
      toast.error("Account restricted. Please contact to the admin.");
    } else if (result.message === "Invalid credentials") {
      setSubmitDisabled(false);
      toast.error("Your credentials are invalid.");
    } else {
      setSubmitDisabled(false);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setSubmitDisabled2(true);

    const form = e.currentTarget;
    const email = (
      form.elements.namedItem("forgot-email") as HTMLInputElement
    ).value.trim();

    const res = await fetch(`${serverDomain}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const result = await res.json();

    if (result.ok) {
      form.reset();
      setSubmitDisabled(false);
      setIsDialogOpen(false);
      toast.success(result.message);
    } else {
      setSubmitDisabled(false);
      toast.error(result.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Inventory Management System
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="px-0 text-sm font-normal">
                      Forgot password?
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Forgot Password</DialogTitle>
                      <DialogDescription>
                        Enter your email address and we&apos;ll send you a link
                        to reset your password.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="forgot-email">Email</Label>
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="name@example.com"
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={submitDisabled2}>
                          Send Link
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
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
            <Button type="submit" className="w-full" disabled={submitDisabled}>
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
