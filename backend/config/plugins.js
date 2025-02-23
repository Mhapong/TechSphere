module.exports = ({ env }) => ({
  "users-permissions": {
    config: {
      register: {
        allowedFields: ["first_name", "last_name", "email", "password"],
      },
    },
  },
});
