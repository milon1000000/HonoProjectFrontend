const prefix = "/user";

export const tenantRoutes = [
  {
    title: "Bookings & Rentals",
    items: [
       {
        title: "Home",
        url: `/`,
      },
      {
        title: "My Bookings",
        url: `${prefix}/my-booking`,
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
