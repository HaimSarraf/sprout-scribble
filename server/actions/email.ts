"use server";

import getBaseUrl from "@/lib/base-url";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = getBaseUrl();

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Sproud & Scribble - Confirmation Email",
    html: `<p>
        Click to <a href=${confirmLink}>confirm youe Email</a>
    </p>`,
  });

  if (error) return console.log(error);
  if (data) return data;
};
