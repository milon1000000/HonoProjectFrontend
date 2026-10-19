"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Crown,
  LayoutDashboard,
  LogOut,
  Menu,
  Loader2,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";
import { useGetMe, useLogout } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  { label: "Landloard", href: "/landloard" },
  { label: "Properties", href: "/properties" },
  { label: "All Rooms", href: "/all-rooms" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetMe();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const user = data?.data;
  const isLoggedIn = Boolean(user);

  const displayName = user?.name || user?.username || "User";
  const displayEmail = user?.email || "";
  const profileImage =
    user?.imageUrl || user?.profileImage || user?.avatar || "";

  const avatarFallback =
    displayName
      .split(" ")
      .map((chunk: string) => chunk[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const dashboardHref =
    user?.role === "ADMIN"
      ? "/admin"
      : user?.role === "LANDLORD"
        ? "/landlord"
        : "/user";

  const userMenuItems = [
    { label: "Dashboard", href: dashboardHref, icon: LayoutDashboard },
    { label: "Profile", href: "/profile", icon: User },
  ];

  // ২. প্রোডাকশন-গ্রেড লগআউট ফাংশন
  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        // ক্যাশ রিমুভ ও পেজ রিফ্রেশ/রিডাইরেক্ট
        queryClient.removeQueries({ queryKey: ["user"] });
        queryClient.clear();
        setIsOpen(false);
        router.push("/login");
        router.refresh();
      },
      onError: (error: any) => {
        const errorMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Something Went Wrong";
        toast.error(errorMsg);
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur shadow-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-primary flex items-center gap-2"
        >
          HousingManagement
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Profile & Mobile Trigger */}
        <div className="flex items-center gap-3">
          {/* Desktop User / Auth Buttons */}
          <div className="hidden lg:block">
            {isLoading ? (
              /* ডেটা ফেচ হওয়ার সময়ের স্কেলিটন */
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            ) : isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <Avatar className="h-10 w-10 cursor-pointer border-2 border-primary/20 transition hover:border-primary">
                    <AvatarImage src={profileImage} alt={displayName} />
                    <AvatarFallback className="bg-muted text-foreground font-bold">
                      {avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-60 rounded-xl p-2 shadow-xl border-border"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal px-3 py-2">
                      <p className="font-bold text-foreground">{displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {displayEmail}
                      </p>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="bg-border" />

                  <DropdownMenuGroup>
                    {userMenuItems.map((item) => (
                      <DropdownMenuItem
                        key={item.href}
                        onClick={() => router.push(item.href)}
                        className="rounded-lg px-3 py-2.5 cursor-pointer focus:bg-accent focus:text-accent-foreground flex items-center font-medium text-foreground"
                      >
                        <item.icon className="mr-2.5 h-4 w-4 text-muted-foreground" />
                        {item.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="bg-border" />

                  <DropdownMenuItem
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                    className="rounded-lg px-3 py-2.5 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive font-medium flex items-center"
                  >
                    {isLoggingOut ? (
                      <Loader2 className="mr-2.5 h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="mr-2.5 h-4 w-4" />
                    )}
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Login
                </Link>
                <Link href="/register"></Link>
              </div>
            )}
          </div>

          {/* Mobile Drawer (Sheet) */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <Menu className="h-6 w-6" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[300px] sm:w-[350px] p-0 flex flex-col h-full border-l-border"
            >
              <div className="p-6 pb-4 border-b border-border">
                <SheetHeader className="text-left">
                  <SheetTitle className="text-2xl font-extrabold text-primary">
                    HousingManagement
                  </SheetTitle>
                </SheetHeader>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-base font-semibold text-muted-foreground hover:text-foreground hover:bg-accent px-4 py-2.5 rounded-lg transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-border p-6 bg-background">
                {isLoading ? (
                  /* মোবাইল ভিউ লোডিং স্কেলিটন */
                  <div className="flex items-center gap-3 px-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                ) : isLoggedIn ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage src={profileImage} alt={displayName} />
                        <AvatarFallback className="bg-muted text-foreground font-bold">
                          {avatarFallback}
                        </AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <p className="font-bold text-sm text-foreground truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {displayEmail}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-1">
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          {item.label}
                        </Link>
                      ))}

                      <button
                        type="button"
                        disabled={isLoggingOut}
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors text-left disabled:opacity-50"
                      >
                        {isLoggingOut ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <LogOut className="h-4 w-4" />
                        )}
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="block"
                    >
                      <Button
                        variant="outline"
                        className="w-full rounded-lg font-semibold py-5"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="block"
                    ></Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
