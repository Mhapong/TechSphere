import React, { useState, useContext, useEffect } from "react";
import { useSetState } from "react-use";
import { AuthContext } from "../../context/Auth.context.js";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const initialState = {
  username: "",
  password: "",
};

export default function Login() {
  const { state: ContextState, login } = useContext(AuthContext);
  const { isLoginPending, isLoggedIn, loginError } = ContextState;
  const [state, setState] = useSetState(initialState);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loginError) {
      toast.error(`${loginError}`, {
        position: "bottom-left",
        duration: 5000,
        style: {
          fontSize: "1.1rem",
          padding: "20px",
          fontWeight: "bold",
          textAlign: "center",
          borderRadius: "10px",
          color: "red",
        },
      });
    }
    if (isLoggedIn && !hasLoggedIn) {
      toast.success(`Welcome. Login Successfully`, {
        position: "bottom-left",
        duration: 5000,
        style: {
          fontSize: "1.1rem",
          padding: "20px",
          fontWeight: "bold",
          textAlign: "center",
          borderRadius: "10px",
          color: "green",
        },
      });
      setHasLoggedIn(true);
    }
  }, [loginError, isLoggedIn, hasLoggedIn]);

  const onSubmit = (e) => {
    e.preventDefault();
    const { username, password } = state;
    if (!username || !password) {
      toast.error("Please enter both username and password.", {
        position: "bottom-left",
        duration: 4000,
      });
      return;
    }
    login(username, password, navigate);
    setState({ username: "", password: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div class="absolute inset-0 z-0">
        <img
          src="https://source.unsplash.com/random/1920x1080"
          alt=""
          class="w-full h-full object-cover filter blur-lg brightness-50"
        />
      </div>
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full z-10 max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
          Welcome Back!
        </h1>
        <p className="text-gray-500 text-center mb-8">Login to your account</p>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              value={state.username}
              onChange={(e) => setState({ username: e.target.value })}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={state.password}
              onChange={(e) => setState({ password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>
        {isLoginPending && (
          <p className="text-blue-500 mt-4 text-center">Please wait...</p>
        )}
        {isLoggedIn && (
          <p className="text-green-500 mt-4 text-center">Login successful!</p>
        )}
        {loginError && (
          <p className="text-red-500 mt-4 text-center">{loginError.message}</p>
        )}
        <div className="text-center mt-6">
          <a href="#" className="text-sm text-blue-500 hover:underline">
            Forgot Password?
          </a>
        </div>
        <div className="text-center mt-2">
          <a href="/sign-up" className="text-sm text-blue-500 hover:underline">
            Don't have an account? Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
