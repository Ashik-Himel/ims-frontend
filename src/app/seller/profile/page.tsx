"use client";

import type React from "react";

import { Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { serverDomain } from "@/lib/variables";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function SellerProfilePage() {
  const token = Cookies.get("token");
  const router = useRouter();
  const [updateProfileSubmitDisabled, setUpdateProfileSubmitDisabled] =
    useState(false);
  const [updatePasswordBtnDisabled, setUpdatePasswordBtnDisabled] =
    useState(false);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    fetch(`${serverDomain}/api/auth/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserId(data?.user?._id);
        setName(data?.user?.name);
        setEmail(data?.user?.email);
        setPhone(data?.user?.phone);
      });
  }, []);

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdateProfileSubmitDisabled(true);

    const form = e.currentTarget;
    const name = (
      form.elements.namedItem("name") as HTMLInputElement
    ).value.trim();
    const email = (
      form.elements.namedItem("email") as HTMLInputElement
    ).value.trim();
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;

    const res = await fetch(`${serverDomain}/api/auth/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId,
        name,
        email,
        phone,
      }),
    });
    const result = await res.json();

    if (result?.ok) {
      setUpdateProfileSubmitDisabled(false);
      toast.success(result?.message);
    } else {
      setUpdateProfileSubmitDisabled(false);
      toast.error(result?.message);
      router.refresh();
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdatePasswordBtnDisabled(true);

    const form = e.currentTarget;
    const password = (
      form.elements.namedItem("current-password") as HTMLInputElement
    ).value;
    const newPassword = (
      form.elements.namedItem("new-password") as HTMLInputElement
    ).value;
    const reTypedPassword = (
      form.elements.namedItem("confirm-password") as HTMLInputElement
    ).value;

    if (newPassword !== reTypedPassword) {
      setUpdatePasswordBtnDisabled(false);
      return toast.error("Passwords do not match!");
    }
    if (newPassword.length < 8) {
      setUpdatePasswordBtnDisabled(false);
      return toast.error("Password must be at least 8 characters!");
    } else if (!/[A-Z]/.test(newPassword)) {
      setUpdatePasswordBtnDisabled(false);
      return toast.error("At least one uppercase character required!");
    } else if (!/[0-9]/.test(newPassword)) {
      setUpdatePasswordBtnDisabled(false);
      return toast.error("At least one number required!");
    } else if (!/[^A-Za-z0-9]/.test(newPassword)) {
      setUpdatePasswordBtnDisabled(false);
      return toast.error("At least one special character required!");
    }

    const res = await fetch(`${serverDomain}/api/auth/update-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password, newPassword, reTypedPassword }),
    });
    const result = await res.json();

    if (result?.ok) {
      setUpdatePasswordBtnDisabled(false);
      form.reset();
      toast.success(result?.message);
    } else {
      setUpdatePasswordBtnDisabled(false);
      toast.error(result?.message);
    }
  };

  return (
    <DashboardLayout userRole="seller">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      className="pl-10"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      className="pl-10"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={updateProfileSubmitDisabled}>
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handlePasswordUpdate} className="space-y-2">
                <h3 className="text-lg font-medium">Change Password</h3>
                <Separator />
                <div className="grid gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      name="current-password"
                      type="password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      name="new-password"
                      type="password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="mt-6"
                  disabled={updatePasswordBtnDisabled}
                >
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
