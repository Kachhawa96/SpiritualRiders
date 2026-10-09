"use client";

import { useState, useTransition } from "react";
import { submitContactMessageAction } from "@/app/contact/actions";
import { Button } from "@/components/ui/Button";

const TOPICS = [
  { id: "general", label: "General Brotherhood" },
  { id: "rides", label: "Ride Invitations" },
  { id: "chapter", label: "Chapter & Membership" },
  { id: "press", label: "Press & Media" },
] as const;

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [selectedTopic, setSelectedTopic] = useState<string>("general");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("topic", selectedTopic);

    startTransition(async () => {
      const res = await submitContactMessageAction(formData);
      if (res.success) {
        setIsSubmitted(true);
      } else {
        setErrorMessage(res.error || "Failed to send message. Please try again.");
      }
    });
  };

  if (isSubmitted) {
    return (
      <div className="rounded-sm border border-gold-500/40 bg-obsidian-900/60 p-8 text-center sm:p-12">
        <div className="mx-auto grid size-12 place-items-center rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-400">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="mt-5 font-display text-2xl font-bold text-ivory-100">
          Dispatch Received
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-graphite-300">
          Your message has reached Spiritual Riders leadership. We will answer directly to your email as soon as we dismount from the road.
        </p>
        <div className="mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsSubmitted(false);
              setErrorMessage(null);
            }}
          >
            Send another dispatch
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-sm border border-border-subtle bg-obsidian-900/40 p-6 sm:p-8"
    >
      <h2 className="font-display text-xl font-bold tracking-wide text-ivory-100">
        Transmit a Message
      </h2>
      <p className="mt-1 text-xs text-graphite-300">
        Leave your coordinates and words. The line will answer.
      </p>

      {errorMessage && (
        <div className="mt-5 rounded-sm border border-red-500/40 bg-red-950/40 p-4 text-xs text-red-300">
          <strong>Notice:</strong> {errorMessage}
        </div>
      )}

      <div className="mt-6 space-y-5">
        {/* Name & Email */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="contact-name"
              className="block text-[0.68rem] uppercase tracking-[0.22em] text-graphite-300"
            >
              Your Name *
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              placeholder="e.g. Kabir Rathore"
              className="mt-2 h-11 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3.5 text-xs text-ivory-100 transition-all duration-200 placeholder:text-graphite-500 focus:border-gold-500 focus:outline-none focus:shadow-[0_0_15px_oklch(67%_0.14_75/0.12)]"
            />
          </div>

          <div>
            <label
              htmlFor="contact-email"
              className="block text-[0.68rem] uppercase tracking-[0.22em] text-graphite-300"
            >
              Email Address *
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              placeholder="you@domain.com"
              className="mt-2 h-11 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3.5 text-xs text-ivory-100 transition-all duration-200 placeholder:text-graphite-500 focus:border-gold-500 focus:outline-none focus:shadow-[0_0_15px_oklch(67%_0.14_75/0.12)]"
            />
          </div>
        </div>

        {/* Topic Pills */}
        <div>
          <span className="block text-[0.68rem] uppercase tracking-[0.22em] text-graphite-300">
            Inquiry Topic
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {TOPICS.map((topic) => {
              const active = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`h-9 cursor-pointer rounded-xs border px-3 text-[0.68rem] uppercase tracking-[0.16em] transition-all duration-200 active:scale-[0.98] motion-reduce:transform-none ${
                    active
                      ? "border-gold-500 bg-gold-500 text-obsidian-950 font-semibold"
                      : "border-charcoal-600 bg-obsidian-950 text-graphite-300 hover:border-gold-500/50 hover:text-ivory-100"
                  }`}
                >
                  {topic.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="contact-message"
            className="block text-[0.68rem] uppercase tracking-[0.22em] text-graphite-300"
          >
            Message *
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            placeholder="Tell us about your machine, ride intentions, or inquiry..."
            className="mt-2 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 p-3.5 text-xs leading-relaxed text-ivory-100 transition-all duration-200 placeholder:text-graphite-500 focus:border-gold-500 focus:outline-none focus:shadow-[0_0_15px_oklch(67%_0.14_75/0.12)]"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? "Transmitting..." : "Send Dispatch"}
          </Button>
        </div>
      </div>
    </form>
  );
}
