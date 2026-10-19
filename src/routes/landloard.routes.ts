const prefix = "/landlord";

export const landloardRoutes = [
  {
    title: "Management",
    items: [
      {
        title: "Dashboard",
        url: `${prefix}`,
      },
      {
        title: "Home",
        url: "/",
      },
      {
        title: "Create Property",
        url: `${prefix}/create-property`,
      },
    ],
  },
];
