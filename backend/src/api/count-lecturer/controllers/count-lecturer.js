module.exports = {
  async getCounts(ctx) {
    try {
      const userId = ctx.params.id;
      const counts = {};

      counts["lecturer-review"] = await strapi.entityService.count(
        "api::lecturer-review.lecturer-review",
        {
          filters: { lecturer_review_id: userId },
        }
      );

      counts["course"] = await strapi.entityService.count(
        "api::course.course",
        {
          filters: { lecturer_owner: userId },
        }
      );

      counts["review"] = await strapi.entityService.count(
        "api::review.review",
        {
          filters: { review_id: { lecturer_owner: userId } },
        }
      );

      ctx.send({ counts });
    } catch (error) {
      ctx.body = { error: error.message };
    }
  },
};
