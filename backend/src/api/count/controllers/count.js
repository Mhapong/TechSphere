module.exports = {
  async getCounts(ctx) {
    try {
      const collections = ["course"];
      const counts = {};

      for (const collection of collections) {
        counts[collection] = await strapi.entityService.count(
          `api::${collection}.${collection}`
        );
      }

      counts["promotion"] = await strapi.entityService.count(
        "api::promotion.promotion",
        {
          filters: { status_promotion: "Activate" },
        }
      );

      counts["confirm-purchase"] = await strapi.entityService.count(
        "api::confirm-purchase.confirm-purchase",
        {
          filters: { status_confirm: "waiting" },
        }
      );

      const userRoles = ["User", "Lecturer"];
      counts.users = {};

      for (const role of userRoles) {
        const roleData = await strapi
          .query("plugin::users-permissions.role")
          .findOne({
            where: { name: role },
            populate: ["users"],
          });

        counts.users[role] = roleData ? roleData.users.length : 0;
      }

      ctx.send({ counts });
    } catch (error) {
      ctx.body = { error: error.message };
    }
  },
};
