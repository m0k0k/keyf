import * as React from "react";

interface EmailTemplateProps {
  email: string;
  token?: string;
  url: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  email,
  url,
}) => (
  <div>
    <h1>Welcome, {email}!</h1>
    <p>
      Click <a href={url}>here</a> to sign in
    </p>
  </div>
);
