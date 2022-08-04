import React, { useState } from "react";
import Load from "../assets/img/load.gif";
import { SOCKET_PATH } from "../config";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { set_profile } from "../store/profile/profileSlice";

import axios from "axios";

const Signin = () => {
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [state, setState] = useState("signin");

  const signIn = async () => {
    try {
      const res = await axios.post(`${SOCKET_PATH}/auth/signin`, {
        username,
        password,
      }) as any;
      setMessage("Successfully signed in")
      console.log(res.data);
      dispatch(set_profile({
        user_id: res.data.id,
        id: res.data.id,
        username: res.data.username,
        access_token: res.data.access_token,
      }));
    } catch (err) {
      // console.log("HERE",err.response.data.err)
      setMessage(err.response.data.error || err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    try {
      const res = await axios.post(`${SOCKET_PATH}/auth/signup`, {
        username,
        password,
      });

      setMessage("Successfully signed up loggin in...")
      setTimeout(()=> signIn(),1000);
    } catch (err) {
      setMessage(err.response.data.error || err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = () => {
    setLoading(true);

    setMessage("")
    if (state === "signin") {
      signIn();
    } else {
      signUp();
    }
  }

  return (
    <div className="h-full dead-center">
      {loading ? (
        <img src={Load} alt="loading" />
      ) : (
        <form onSubmit={onSubmit} className="bg-white p-3 rounded md:w-1/4">
        {/* <div "> */}
          <div className="text-center">
            <h1 className="text-2xl">{state=="signin" ? "Sign In" : "Sign Up"}</h1>
          </div>
          {message && <div className="text-center my-2">{message}</div>}
          <input
            className="border border-gray-400 rounded w-full px-3 py-1 my-2"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="border border-gray-400 rounded w-full px-3 py-1 mb-2"
            placeholder="Enter password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="block bg-green-500 hover:bg-green-600 w-full text-white rounded h-10 mt-4 mb-1"
            // onClick={signIn}
          >
            {state=="signin" ? "Sign In" : "Sign Up"}
          </button>
          <div>
            {state == "signin" ? (
              <p className="text-center">
                Don't have an account?{" "}
                <a
                  className="underline font-bold mt-2 cursor-pointer hover:scale-105"
                  onClick={() => setState("signup")}
                >
                  Sign up
                </a>
              </p>
            ) : (
              <p className="text-center">
                Already have an account?{" "}
                <a
                  className="underline font-bold mt-2 cursor-pointer hover:scale-105"
                  onClick={() => setState("signin")}
                >
                  Sign in
                </a>
              </p>
            )}
          </div>
        {/* </div> */}
        </form>
      )}
    </div>
  );
};

export default Signin;
