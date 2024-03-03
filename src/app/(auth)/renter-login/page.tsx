"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Toast from "@/components/Toast";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [errors, setError] = useState<LoginErrorType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [authState, setAuthState] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event:any) => {
    event.preventDefault();
    setLoading(true);
    axios
      .post("/api/auth/renter/login", authState)
      .then((res) => {
        setLoading(false);
        const response = res.data;
        console.log("The response is ", response);
        if (response.status == 200) {
          console.log("The renter signed in", response);

          signIn("credentials", {
            email: authState.email,
            password: authState.password,
            redirect: false,
          });

          router.replace("/renter/dashboard");
        } else if (response.status == 400) {
          setError(response?.errors);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("Error is", err);
      });
  };
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Toast />
      <div className="w-[500px] shadow-md rounded-lg p-5">
        <h1 className="text-2xl font-bold">Renter Login</h1>
        <p className="mt-2 text-base text-gray-600">
          Dont have an account?
          <Link
            href="/renter-signup"
            title=""
            className="font-medium text-black transition-all duration-200 hover:underline ml-2"
          >
            Sign Up
          </Link>
        </p>
        <p>Welcome back</p>
        <form onSubmit={handleSubmit}>
          <div className="mt-5">
            <label className="block">Email</label>
            <input
              type="text"
              placeholder="Enter your email"
              className="w-full outline-red-300 p-2 h-10 rounded-md border"
              onChange={(e) =>
                setAuthState({ ...authState, email: e.target.value })
              }
            />
            <span className="text-red-500 font-bold">{errors?.email}</span>
          </div>
          <div className="mt-5">
            <label className="block">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full outline-red-300 p-2 h-10 rounded-md border"
              onChange={(e) =>
                setAuthState({ ...authState, password: e.target.value })
              }
            />
            <span className="text-red-500 font-bold">{errors?.password}</span>
          </div>
          <div className="mt-5">
            <button
              type="submit"
              className="w-full bg-red-400 rounded-lg p-2 text-white"
            >
              {loading ? "Processing.." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
