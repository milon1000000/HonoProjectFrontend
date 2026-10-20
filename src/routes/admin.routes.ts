const prefix = "/admin";

export const adminRoutes = [
  {
    title: "Management",
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
        title: "Landlord Approval",
        url: `${prefix}/landloard`,
      },
       {
        title: "All Users",
        url: `${prefix}/all-users`,
      },
      {
        title: "All Booking",
        url: `${prefix}/all-booking`,
      },
      {
        title: "All Payments",
        url: `${prefix}/all-payments`,
      },
    ],
  },
];