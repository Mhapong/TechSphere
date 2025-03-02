const isProd = process.env.NODE_ENV === "production";

const config = {
  isProd,
  apiUrlPrefix: isProd
    ? "https://w11-admin.pupasoft.com/api"
    : "http://localhost:1337/api",
};

export default config;

// const apiUrl =
//   process.env.REACT_APP_STATUS === "production"
//     ? process.env.REACT_APP_PRODUCTION_URL
//     : process.env.REACT_APP_DEVELOP_URL;

// const conf = {
//   apiUrlPrefix: `${apiUrl}/api`,
//   loginEndpoint: "/auth/local",
//   jwtUserEndpoint: "/users/me",
//   jwtSessionStorageKey: "auth.jwt",
//   apiUrl,
// };

// export default conf;
