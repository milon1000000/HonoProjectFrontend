import React from "react";
import Link from "next/link";
import {
  Building2,
  Mail,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30 text-foreground">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="size-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                <Building2 className="size-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-foreground">
                Housing<span className="text-primary">Management</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              Online rental housing and room reservation platform. Connect with
              verified landlords, book rooms, and complete payments securely
              with bKash.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <ShieldCheck className="size-3.5" />
                <span>Verified Landlord Management</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Discover
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/all-rooms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  All Rental Rooms
                </Link>
              </li>
              <li>
                <Link
                  href="/properties"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/landloard"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Landlords
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Platform
                </Link>
              </li>
            </ul>
          </div>

          {/* For Landlords & Tenants */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/landloard-apply"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <span>Apply as Landlord</span>
                  <ArrowRight className="size-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  User Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Create Account
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Administration
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="size-3.5 text-primary shrink-0" />
                <a
                  href="mailto:milonmondolmd33@gmail.com"
                  className="hover:text-foreground transition-colors"
                >
                  milonmondolmd33@gmail.com
                </a>
              </li>
              <li className="text-[11px] text-muted-foreground leading-relaxed">
                Platform Administrator & Support Contact for HousingManagement.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/40 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} HousingManagement. All rights
            reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/about-us"
              className="hover:text-foreground transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="hover:text-foreground transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
