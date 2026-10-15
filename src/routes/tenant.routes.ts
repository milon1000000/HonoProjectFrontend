const prefix = "/user";

export const tenantRoutes = [
  {
    title: "Bookings & Rentals",
    items: [
      {
        title: "Overview",
        url: `${prefix}`,
      },
      {
        title: "My Bookings",
        url: `${prefix}`,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "Profile Settings",
        url: "/profile",
      },
    ],
  },
];
