import React, { useEffect, useActionState } from "react";
import { useSetState } from "react-use";
import conf from "../conf/main";
import ax, { axData } from "../conf/ax";

export const AuthContext = React.createContext(null);

const initialState = {
  isLoggedIn: false,
  user: null,
  isLoginPending: false,
  loginError: null,
};

const updateJwt = (jwt) => {
  axData.jwt = jwt;
  if (jwt) {
    sessionStorage.setItem(conf.jwtSessionStorageKey, jwt);
  } else {
    sessionStorage.removeItem(conf.jwtSessionStorageKey);
  }
};

export const ContextProvider = (props) => {
  const [state, setState] = useSetState(initialState);

  const setLoginPending = (isLoginPending) => setState({ isLoginPending });
  const setLoginSuccess = (isLoggedIn, user) => setState({ isLoggedIn, user });
  const setLoginError = (loginError) => setState({ loginError });

  const handleLoginResult = async (error, result) => {
    setLoginPending(false);

    if (result && result.user) {
      if (result.jwt) {
        updateJwt(result.jwt);
      }
      const userRole = await fetchRole(result.jwt);
      const userProfile = await fetchProfile(result.jwt);
      setLoginSuccess(true, { ...result.user, userRole, userProfile });
    } else if (error) {
      setLoginError(error);
    }
  };

  useEffect(() => {
    setLoginPending(true);
    loadPersistedJwt(handleLoginResult);
  }, []);

  const login = (username, password, Navigate) => {
    setLoginPending(true);
    setLoginSuccess(false);
    setLoginError(null);

    fetchLogin(username, password, handleLoginResult, Navigate);
  };

  const logout = () => {
    setLoginPending(false);
    updateJwt(null);
    setLoginSuccess(false);
    setLoginError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

const fetchRole = async (jwt) => {
  try {
    const response = await ax.get(`/users/me?populate=role`);
    if (response.data) {
      return response.data.role?.name || "No role";
    }
  } catch (error) {
    console.error("Failed to fetch role:", error);
    return "guest";
  }
};

const fetchProfile = async (jwt) => {
  try {
    const response = await ax.get(`/users/me?populate=profile_picture`);
    if (response.data) {
      return response.data.profile_picture[0] || "No profile_picture";
    }
  } catch (error) {
    console.error("Failed to fetch profile_picture:", error);
  }
};

const fetchLogin = async (username, password, callback, Navigate) => {
  try {
    const response = await ax.post(conf.loginEndpoint, {
      identifier: username,
      password,
    });
    if (response.data.jwt && response.data.user.id > 0) {
      callback(null, response.data);
      Navigate("/");
    } else {
      callback(new Error("Invalid username and password"));
    }
  } catch (e) {
    callback(new Error("Fail to initiate login"));
  }
};

const loadPersistedJwt = async (callback) => {
  try {
    const persistedJwt = sessionStorage.getItem(conf.jwtSessionStorageKey);
    if (persistedJwt) {
      axData.jwt = persistedJwt;
      const response = await ax.get(conf.jwtUserEndpoint);
      if (response.data.id > 0) {
        callback(null, { user: response.data });
      } else {
        callback(null);
      }
    }
  } catch (e) {
    console.log(e);
    callback(new Error("Fail to initiate auto login"));
  }
};
