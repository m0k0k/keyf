"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Form from "next/form";
import { verifyEmailOTP } from "@/app/(auth)/actions";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";

export function OTPForm({
  email,
  ...props
}: React.ComponentProps<typeof Card> & { email: string }) {
  const initialState = {
    error: "",
  };
  const [state, formAction, pending] = useActionState(
    verifyEmailOTP,
    initialState,
  );

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Enter verification code</CardTitle>
        <CardDescription>We sent a 6-digit code to {email}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form action={formAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="otp" className="sr-only">
                Verification code
              </FieldLabel>
              <Input type="hidden" name="email" value={email} />
              <InputOTP maxLength={6} id="otp" name="otp" required>
                <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <FieldDescription className="text-center">
                Enter the 6-digit code sent to your email.
              </FieldDescription>
            </Field>
            {state.error && (
              <FieldDescription className="text-destructive text-center">
                {state.error}
              </FieldDescription>
            )}
            <Button disabled={pending} type="submit">
              Verify
            </Button>
            <FieldDescription className="text-center">
              Didn&apos;t receive the code? <a href="#">Resend</a>
            </FieldDescription>
          </FieldGroup>
        </Form>
      </CardContent>
    </Card>
  );
}
