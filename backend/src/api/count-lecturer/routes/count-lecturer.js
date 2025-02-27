module.exports = {
  routes: [
    {
      method: "GET",
      path: "/count-lecturer/:id",
      handler: "count-lecturer.getCounts",
      config: {
        auth: false,
      },
    },
  ],
};
