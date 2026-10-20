import React from "react";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  Target,
  Eye,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Lock,
  DoorOpen,
  UserCheck,
  Mail,
  Users,
  CreditCard,
  Layers,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export const metadata = {
  title: "About Us | HousingManagement",
  description:
    "Learn about HousingManagement's mission, platform features, and administrative oversight for rental housing.",
};

export default function AboutUsPage() {
  const adminEmail = "milonmondolmd33@gmail.com";

  const pillars = [
    {
      title: "Landlord Verification",
      desc: "Property owners submit National ID (NID) or Passport identification and property ownership details for administrator review before listings go live.",
      icon: ShieldCheck,
    },
    {
      title: "Direct Tenant Connection",
      desc: "Tenants browse genuine rooms and properties directly without middlemen or unnecessary broker commission fees.",
      icon: UserCheck,
    },
    {
      title: "bKash Digital Payments",
      desc: "Integrated bKash payment gateway enabling transparent booking transactions, digital payment records, and refund processing.",
      icon: CreditCard,
    },
    {
      title: "Role-Based Management",
      desc: "Distinct portals for Tenants to track bookings, Landlords to manage properties and rooms, and Administrators to oversee platform activity.",
      icon: Layers,
    },
  ];

  const features = [
    {
      title: "For Tenants",
      points: [
        "Search and filter rooms by location, budget, and capacity",
        "View detailed property descriptions, house amenities, and photos",
        "Reserve rooms online with instant bKash checkout",
        "Manage booking requests and payment receipts in tenant dashboard",
      ],
      icon: Users,
      ctaText: "Browse Rooms",
      ctaHref: "/all-rooms",
    },
    {
      title: "For Landlords",
      points: [
        "Apply for landlord verification with NID/Passport documentation",
        "Create and publish rental property listings across cities",
        "Add multiple rooms with custom seat capacities and rental prices",
        "Review and manage tenant booking requests directly from dashboard",
      ],
      icon: Building2,
      ctaText: "Apply as Landlord",
      ctaHref: "/landloard-apply",
    },
  ];

  return (
    <div className="min-h-screen bg-background space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-border/60 bg-gradient-to-b from-primary/10 via-muted/20 to-background text-center">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-bold border border-primary/25 shadow-xs">
            <Sparkles className="size-3.5" />
            <span>About HousingManagement</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
            Modern Rental Housing Management in{" "}
            <span className="text-primary bg-clip-text">Bangladesh</span>
          </h1>

          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            HousingManagement is an integrated web platform built to connect
            verified landlords with prospective tenants, streamline room
            reservations, and provide secure bKash digital payment processing.
          </p>
        </div>
      </section>

      {/* 2. Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="rounded-3xl border border-border/60 bg-card p-8 sm:p-10 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                <Target className="size-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Platform Mission
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Transparent & Efficient Rental Access
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                To simplify the rental housing search by providing structured,
                verified room listings, removing unnecessary brokerage intermediaries,
                and enabling secure online payments between tenants and landlords.
              </p>
            </div>
            <div className="pt-4 border-t border-border/40 flex items-center gap-2 text-xs font-semibold text-foreground">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span>Direct landlord-tenant communication with clear terms</span>
            </div>
          </div>

          {/* Vision */}
          <div className="rounded-3xl border border-border/60 bg-card p-8 sm:p-10 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                <Eye className="size-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Platform Vision
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                A Unified Digital Housing Ecosystem
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                To build a reliable digital standard for residential accommodations
                across major cities in Bangladesh, where finding and managing a rental
                space is dependable, structured, and fully documented.
              </p>
            </div>
            <div className="pt-4 border-t border-border/40 flex items-center gap-2 text-xs font-semibold text-foreground">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span>Structured verification and digital transaction records</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Architectural Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Key Features
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            How the System Operates
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Core components designed into the HousingManagement platform to
            ensure security and transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="rounded-3xl border border-border/60 bg-card p-6 space-y-3 shadow-xs hover:border-primary/40 transition-colors"
              >
                <div className="size-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                  <Icon className="size-6" />
                </div>
                <h3 className="font-extrabold text-base text-foreground">
                  {pillar.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Two-Sided Platform Experience */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="rounded-3xl border border-border/60 bg-muted/20 p-8 sm:p-10 space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="text-xl font-extrabold text-foreground">
                      {feat.title}
                    </h3>
                  </div>

                  <ul className="space-y-3 pt-2 text-xs sm:text-sm text-muted-foreground">
                    {feat.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-border/40">
                  <Link
                    href={feat.ctaHref}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "rounded-xl font-bold gap-1 cursor-pointer"
                    )}
                  >
                    <span>{feat.ctaText}</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Platform Administration & Oversight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/60 bg-card p-8 sm:p-12 shadow-xs space-y-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              System Administration
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Platform Integrity & Administrator Oversight
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              HousingManagement is monitored through a dedicated administrative
              portal. The platform administrator actively audits landlord
              verification submissions, reviews all booking transactions, and
              handles user account statuses.
            </p>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl border border-border/60 bg-muted/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/15 text-primary border border-primary/25 flex items-center justify-center shrink-0">
                <Mail className="size-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground">
                  Official Administrative Contact
                </span>
                <div className="text-sm font-extrabold text-foreground">
                  {adminEmail}
                </div>
              </div>
            </div>

            <Link
              href="/contact"
              className={cn(
                buttonVariants({ size: "sm" }),
                "rounded-xl font-bold gap-1.5 self-start sm:self-auto cursor-pointer"
              )}
            >
              <span>Contact Administrator</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/15 via-primary/5 to-muted/30 p-8 sm:p-14 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Start Using HousingManagement
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            Find rental rooms with ease or list your property directly as a
            verified landlord.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/all-rooms"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-2xl font-bold gap-2 cursor-pointer"
              )}
            >
              <DoorOpen className="size-4" />
              <span>Browse All Rooms</span>
            </Link>

            <Link
              href="/landloard-apply"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-2xl font-bold gap-2 cursor-pointer"
              )}
            >
              <ShieldCheck className="size-4" />
              <span>Apply as Landlord</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
