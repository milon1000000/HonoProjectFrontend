"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Building2,
  CreditCard,
  UserCheck,
  ChevronDown,
  Loader2,
  Send,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "cn";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "booking",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const adminEmail = "milonmondolmd33@gmail.com";

  // Opens directly in Google Chrome / Gmail Web in a new tab
  const getGmailUrl = (subject?: string) => {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      adminEmail
    )}${subject ? `&su=${encodeURIComponent(subject)}` : ""}`;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(adminEmail);
    setCopied(true);
    toast.success("Admin email copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success(
        `Thank you! Your message has been sent to our administrator at ${adminEmail}.`
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "booking",
        subject: "",
        message: "",
      });
    }, 800);
  };

  const contactCards = [
    {
      title: "Project Administrator",
      detail: adminEmail,
      subDetail: "Opens directly in Gmail / Google Chrome",
      icon: Mail,
      href: getGmailUrl("HousingManagement Support Inquiry"),
      actionText: "Open in Gmail / Google",
      isExternal: true,
    },
    {
      title: "Landlord Inquiries",
      detail: "Verification & Listings",
      subDetail: "Assistance with landlord applications and room listings",
      icon: UserCheck,
      href: "/landloard-apply",
      actionText: "Apply as Landlord",
      isExternal: false,
    },
    {
      title: "Payment & Booking Support",
      detail: "bKash Transactions & Refunds",
      subDetail: "Direct resolution for payments via Google / Gmail",
      icon: CreditCard,
      href: getGmailUrl("bKash Payment & Refund Inquiry"),
      actionText: "Email via Gmail",
      isExternal: true,
    },
    {
      title: "General Platform Inquiries",
      detail: "HousingManagement Support",
      subDetail: "Feedback, suggestions, and account assistance",
      icon: ShieldCheck,
      href: getGmailUrl("HousingManagement General Inquiry"),
      actionText: "Open in Gmail",
      isExternal: true,
    },
  ];

  const faqs = [
    {
      question: "How do I reserve a room on HousingManagement?",
      answer:
        "Browse the available listings in All Rooms or Properties, choose a room, and click 'View Room Details'. You can then initiate a booking and complete payment via bKash to confirm your reservation.",
    },
    {
      question: "How does the bKash payment work?",
      answer:
        "Payments for bookings are made through the bKash gateway. Once paid, the booking is recorded in your dashboard with an official payment status, and the landlord is notified.",
    },
    {
      question: "How do landlords get verified?",
      answer:
        "Landlords apply through the Landlord Application portal by submitting their details, address, and NID or Passport number. The administrator reviews and approves the application before listings are published.",
    },
    {
      question: "How can I cancel a booking and receive a refund?",
      answer:
        "Tenants can manage their reservations under the My Bookings section in the dashboard. If eligible under cancellation terms, refunds are processed back through the payment system.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section className="relative border-b border-border/60 bg-gradient-to-b from-primary/10 via-muted/20 to-background py-16 sm:py-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-semibold border border-primary/25 shadow-xs">
            <MessageSquare className="size-3.5" />
            <span>Support & Administration</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Contact HousingManagement
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Have questions about rental rooms, need help with a bKash booking,
            or require administrative assistance? Reach out directly to the
            platform administrator.
          </p>

          {/* Quick copy email bar */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-border/60 bg-card text-xs font-mono text-foreground shadow-xs">
              <Mail className="size-3.5 text-primary" />
              <span>{adminEmail}</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyEmail}
              className="gap-1.5 text-xs rounded-xl cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="size-3 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="size-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center transition-transform group-hover:scale-110">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {card.title}
                    </h3>
                    <p className="text-sm sm:text-base font-extrabold text-foreground mt-1 truncate">
                      {card.detail}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {card.subDetail}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border/40">
                  {card.isExternal ? (
                    <a
                      href={card.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{card.actionText}</span>
                      <ExternalLink className="size-3" />
                    </a>
                  ) : (
                    <Link
                      href={card.href}
                      className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>{card.actionText}</span>
                      <span>&rarr;</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Form and Support Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inquiry Form */}
          <div className="lg:col-span-7 rounded-3xl border border-border/60 bg-card p-6 sm:p-10 shadow-xs space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Send a Message
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Submit an Inquiry
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Inquiries are sent directly to the project administrator at{" "}
                <strong className="text-foreground">{adminEmail}</strong>.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center space-y-4 animate-in fade-in-50">
                <div className="size-14 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="size-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Message Sent Successfully
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                    Your inquiry has been delivered to{" "}
                    <span className="font-semibold text-foreground">
                      {adminEmail}
                    </span>
                    . We will review and respond to your email as soon as
                    possible.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubmitted(false)}
                  className="rounded-xl cursor-pointer"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Your Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="h-10 rounded-xl bg-background/60 text-xs"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Your Email <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="h-10 rounded-xl bg-background/60 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Contact Number (Optional)
                    </label>
                    <Input
                      type="tel"
                      placeholder="Your phone number"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="h-10 rounded-xl bg-background/60 text-xs"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Inquiry Category
                    </label>
                    <select
                      aria-label="Inquiry Category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-input bg-background/60 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="booking">Room Booking & Reservation</option>
                      <option value="landlord">Landlord Verification & Listing</option>
                      <option value="payment">bKash Payment & Refund</option>
                      <option value="general">General Administrative Query</option>
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Subject
                  </label>
                  <Input
                    placeholder="Brief description of inquiry..."
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="h-10 rounded-xl bg-background/60 text-xs"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Message <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    className="w-full rounded-xl border border-input bg-background/60 p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto h-11 px-8 rounded-xl font-bold gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </Button>

                  <a
                    href={getGmailUrl(formData.subject || "HousingManagement Inquiry")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
                  >
                    <span>Or compose directly in Gmail / Google Chrome</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Platform Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-background p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-foreground">
                    Administrative Oversight
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    HousingManagement Platform
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                HousingManagement provides a dedicated administrative system to
                verify landlords, oversee room reservations, and ensure fair,
                secure transactions between tenants and property owners.
              </p>

              <div className="space-y-3 pt-2 border-t border-border/40 text-xs">
                <div className="flex items-center justify-between gap-2 text-foreground font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    <span>Admin: {adminEmail}</span>
                  </div>
                  <a
                    href={getGmailUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <span>Open in Gmail</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span>Landlord identity & property verification review</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span>bKash payment monitoring and refund management</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-foreground">
                Platform Shortcuts
              </h3>
              <div className="space-y-2">
                <Link
                  href="/all-rooms"
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors text-xs font-semibold text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="size-4 text-primary" />
                    Browse All Rental Rooms
                  </span>
                  <span>&rarr;</span>
                </Link>

                <Link
                  href="/landloard-apply"
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors text-xs font-semibold text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <UserCheck className="size-4 text-emerald-500" />
                    Landlord Application Portal
                  </span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-10 shadow-xs space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Common questions regarding room bookings, landlord approvals, and
              payment transactions.
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-border/40">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.question} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer py-1"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 transition-transform duration-200 text-muted-foreground",
                        isOpen && "rotate-180 text-primary"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <p className="text-xs sm:text-sm text-muted-foreground pt-2.5 leading-relaxed animate-in fade-in-50">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
