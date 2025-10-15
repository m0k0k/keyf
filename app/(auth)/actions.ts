"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const signUp = async (prevState: any, formData: FormData) => {
  const confirmPassword = formData.get("confirm-password") as string;
  const password = formData.get("password") as string;
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  console.log(name, email, password);

  const response = await auth.api.signUpEmail({
    returnHeaders: true,

    body: {
      email,
      password,
      name,
    },
    asResponse: true,
  });

  if (response.status === 200) {
    redirect(`/otp?email=${email}`);
  } else {
    return { error: "Something went wrong. Please try again." };
  }
};

export const verifyEmailOTP = async (prevState: any, formData: FormData) => {
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;
  const token = formData.get("token") as string;
  console.log(email, otp, token);

  const response = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp,
    },
    asResponse: true,
  });
  if (response.status === 200) {
    redirect(`/app`);
  } else {
    return { error: "Invalid OTP" };
  }
};

export const signIn = async (prevState: any, formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const response = await auth.api.signInEmail({
    body: {
      email,
      password,
      callbackURL: "/",
    },
    asResponse: true,
  });
  console.log("response", response);
  console.log("prevState", prevState);
  console.log("status", response.status);
  if (response.status === 200) {
    redirect("/app");
  } else {
    return { error: "Invalid email or password" };
  }
};
