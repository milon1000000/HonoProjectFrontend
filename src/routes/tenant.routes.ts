const prefix = "/user";

export const tenantRoutes = [
  {
    title: "Bookings & Rentals",
    items: [
      {
        title: "Dashboard",
        url: `${prefix}`,
      },
      {
        title: "Home",
        url: `/`,
      },
      {
        title: "My Bookings",
        url: `${prefix}/my-booking`,
      },
      {
        title: "My Payments",
        url: `${prefix}/my-payments`,
      },
    ],
  },
];
