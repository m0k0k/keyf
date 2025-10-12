import { createAuthClient } from "better-auth/react";
import { auth } from "@/auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});
export const signIn = async () => {
  await authClient.signIn.social(
    {
      provider: "google",
      callbackURL: "/app",
    },
    {
      onSuccess(ctx) {
        console.log("ctx", ctx);
      },
    },
  );
};

export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
export type UserType = "user" | "starter" | "plus" | "pro" | "admin";

export const { useSession } = authClient;
