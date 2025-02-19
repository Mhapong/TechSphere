module.exports = {
  routes: [
    {
      method: "GET",
      path: "/counts",
      handler: "count.getCounts",
      config: {
        auth: false,
      },
    },
  ],
};
