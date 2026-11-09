"use server";

import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { revalidatePath } from "next/cache";
import type { ContactActionState } from "@/lib/contact-action-state";

const inbox = "nexusrisegen@gmail.com";
const SMTP_SEND_TIMEOUT_MS = 8_000;
const supportOptions = [
  "Career & Education Guidance",
  "Navigating a personal struggle / Life transition",
  "Urgent: I am in distress and need someone to talk to",
] as const;
const ageStages = ["Teen (13–17)", "Young adult (18–24)", "Adult / parent / guardian", "Mentor / other adult", "Prefer not to say"] as const;

function textField(formData: FormData, field: string, maxLength: number) {
  const value = formData.get(field);
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function validEmail(email: string) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getPublicSupabase() {
  // Keep the public form behind the table's insert-only RLS policy.
  // Do not use the service-role key here because it would bypass safeguarding RLS.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase URL or publishable key is missing.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function notifyInbox(subject: string, text: string, replyTo?: string) {
  // Next.js loads .env.local for the server runtime. Environment values are
  // synchronous strings, so they should be read directly rather than awaited.
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (!user || !pass) throw new Error("Gmail SMTP credentials are not configured.");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    // Port 587 uses STARTTLS and is more widely reachable than implicit TLS
    // on port 465. `requireTLS` prevents sending credentials without TLS.
    port: 587,
    secure: false,
    requireTLS: true,
    auth: { user, pass },
    // Bound DNS/TCP/TLS and SMTP waits so an unavailable SMTP connection
    // cannot keep the Server Action open indefinitely.
    dnsTimeout: 3_000,
    connectionTimeout: 5_000,
    greetingTimeout: 5_000,
    socketTimeout: 8_000,
  });

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    const sendMail = transporter.sendMail({
      from: `Nexus Contact Form <${user}>`,
      to: inbox,
      replyTo,
      subject,
      text,
    });

    await Promise.race([
      sendMail,
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error(`SMTP send timed out after ${SMTP_SEND_TIMEOUT_MS}ms.`)),
          SMTP_SEND_TIMEOUT_MS,
        );
      }),
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
    transporter.close();
  }
}

export async function submitMentorshipRequest(
  _previousState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  console.log("1. Starting Submission...");

  // A honeypot catches simple automated submissions without exposing an error to the bot.
  if (textField(formData, "website", 200)) {
    return { success: false, status: "error", message: "This submission could not be processed. Please try again." };
  }

  const name = textField(formData, "name", 120);
  const email = textField(formData, "email", 254).toLowerCase();
  const ageStage = textField(formData, "age_stage", 80);
  const supportType = textField(formData, "support_type", 100);
  const story = textField(formData, "story", 6000);

  if (!name || !validEmail(email) || !ageStages.includes(ageStage as (typeof ageStages)[number]) || !supportOptions.includes(supportType as (typeof supportOptions)[number]) || story.length < 10) {
    return { success: false, status: "error", message: "Please check each field and share at least a short note so we can respond appropriately." };
  }

  try {
    // SQL equivalent (kept as a reference only; the insert below goes through Supabase so RLS applies):
    // INSERT INTO public.mentorship_requests (name, email, age_stage, support_type, story)
    // VALUES ($1, $2, $3, $4, $5);
    console.log("2. Attempting Database Insert...");
    const { error } = await getPublicSupabase().from("mentorship_requests").insert({
      name,
      email,
      age_stage: ageStage,
      support_type: supportType,
      story,
    });

    if (error) throw error;
  } catch (error) {
    console.error("DB ERROR:", error);
    return { success: false, status: "error", message: "Database connection failed. Please try again." };
  }

  revalidatePath("/contact");

  try {
    console.log("3. Database Insert Successful. Attempting Email...");
    await notifyInbox(
      "New Nexus Mentorship Request",
      `New mentorship request\n\nName: ${name}\nEmail: ${email}\nAge / life stage: ${ageStage}\nSupport requested: ${supportType}\n\nStory:\n${story}`,
      email,
    );
    return { success: true, status: "success", message: "Thank you. Your request has been received by our Safeguarding Lead. Expect a personalized response within 24–48 hours." };
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return { success: true, status: "warning", message: "Your request was saved securely, but the email notification could not be delivered. Please contact nexusrisegen@gmail.com if you need a response soon." };
  }
}

export async function submitSuggestion(
  _previousState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const suggestion = textField(formData, "suggestion", 3000);
  const name = textField(formData, "name", 120);
  const email = textField(formData, "email", 254).toLowerCase();
  console.log("1. Suggestion: Data extracted", { suggestion, name, email });

  // A filled honeypot is rejected rather than reported as a false success.
  if (textField(formData, "website", 200)) {
    return { success: false, status: "error", message: "This submission could not be processed. Please try again." };
  }

  if (suggestion.length < 5 || (email && !validEmail(email))) {
    return { success: false, status: "error", message: "Please add a little more detail and check the email address." };
  }

  try {
    // SQL equivalent (kept as a reference only; the insert below goes through Supabase so RLS applies):
    // INSERT INTO public.platform_suggestions (suggestion, name, email)
    // VALUES ($1, $2, $3);
    console.log("2. Suggestion: Attempting DB Insert...");
    const { error } = await getPublicSupabase().from("platform_suggestions").insert({
      suggestion,
      name: name || null,
      email: email || null,
    });

    if (error) throw error;
  } catch (error) {
    console.error("SUGGESTION DB ERROR:", error);
    return { success: false, status: "error", message: "We couldn’t submit your suggestion just now. Please try again." };
  }

  revalidatePath("/contact");

  try {
    console.log("3. Suggestion: DB Success. Attempting Email...");
    await notifyInbox(
      "New Platform Suggestion",
      `New platform suggestion\n\nSuggestion:\n${suggestion}\n\nName: ${name || "Not provided"}\nEmail: ${email || "Not provided"}`,
      email || undefined,
    );
    return { success: true, status: "success", message: "Thanks for helping improve Nexus. Your suggestion has been received." };
  } catch (error) {
    console.error("SUGGESTION EMAIL ERROR:", error);
    return { success: true, status: "warning", message: "Your suggestion was saved, but the email notification could not be delivered. Thank you for sharing it." };
  }
}
