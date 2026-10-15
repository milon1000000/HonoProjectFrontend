const prefix = "/landlord";

export const landloardRoutes = [
  {
    title: "Management",
    items: [
      {
        title: "Home",
        url: "/",
      },
      {
        title: "Create-Property",
        url: `${prefix}/create-property`,
      },
      {
        title: "My Properties",
        url: `${prefix}/properties`,
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