import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db/drizzle"; // your drizzle instance
import { user, session, account, verification } from "@/lib/db/schema";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";
import { magicLink } from "better-auth/plugins";
import { EmailTemplate } from "@/app/(auth)/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
        input: false, // don't allow user to set role
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    nextCookies(),
    emailOTP({
      sendVerificationOnSignUp: true,
      expiresIn: 900,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          // Send the OTP for sign-in
          await resend.emails.send({
            from: "Keyf AI <hello@notifications.keyf.ai>",
            to: email,
            subject: "Sign in to Keyf AI",
            text: `You requested to sign in to Keyf AI. \n\nYour one-time code is: ${otp} \n\nThis code expires in 10 minutes.\n\nIf you did not request this, please ignore this email.`,
          });
        } else if (type === "email-verification") {
          // Send the OTP for email verification
          await resend.emails.send({
            from: "Keyf AI <hello@notifications.keyf.ai>",
            to: email,
            subject: "Verify your email",
            text: `Your one-time code is: ${otp} \n\nThis code expires in 10 minutes.`,
          });
        } else {
          // Send the OTP for password reset
        }
      },
    }),

    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        console.log(request);
        const { data, error } = await resend.emails.send({
          from: "Keyf AI <hello@notifications.keyf.ai>",
          to: email,
          subject: "Magic Link",
          react: EmailTemplate({ email, token, url }) as React.ReactElement,
        });
        if (error) {
          console.error(error);
        }
        console.log(data);
      },
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
});
