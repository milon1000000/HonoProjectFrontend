const prefix = "/admin";

export const adminRoutes = [
  {
    title: "Management",
    items: [
      {
        title: "Home",
        url: `/`,
      },
      {
        title: "Landlord Approval",
        url: `${prefix}/landloard`,
      },
      {
        title: "Back to Home",
        url: "/",
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