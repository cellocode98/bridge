/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";
import zxcvbn from "zxcvbn";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) setError(error.message);
  };

  const handleEmailAuth = async () => {
    setLoading(true);
    setError("");
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setError(error.message);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordScore = password ? zxcvbn(password).score : 0;
  const passwordStrength = ["Weak", "Fair", "Good", "Strong", "Excellent"];
  const passwordColor = ["red-500", "yellow-500", "green-400", "green-500", "blue-500"];

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-blue-50 to-white">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-purple-300 rounded-full opacity-30 blur-3xl animate-blobSlow"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-pink-300 rounded-full opacity-20 blur-3xl animate-blobSlow animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-yellow-300 rounded-full opacity-25 blur-3xl animate-blobSlow animation-delay-4000"></div>

      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full flex flex-col items-center gap-6 relative z-10"
      >
        <h1 className="text-3xl font-bold text-blue-600">Welcome to Bridge</h1>
        <p className="text-gray-600 text-center">
          {isSignUp
            ? "Create your account and start connecting with meaningful volunteer opportunities."
            : "Sign in to access personalized opportunities and connect with your community."}
        </p>

        {/* Google Login */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 bg-white border border-gray-300 px-6 py-3 rounded-lg shadow hover:shadow-lg transition w-full"
        >
          <img src="/google-logo.svg" alt="Google Logo" className="w-6 h-6" />
          <span className="text-gray-800 font-medium">Sign in with Google</span>
        </motion.button>

        <div className="w-full flex items-center gap-2 my-2">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-400 text-sm">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Email / Password Form */}
        <div className="w-full flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Password strength */}
          {isSignUp && password && (
            <div className="flex justify-between items-center text-sm">
              <span className={`text-${passwordColor[passwordScore]} font-medium`}>
                {passwordStrength[passwordScore]}
              </span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full ml-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full bg-${passwordColor[passwordScore]}`}
                  style={{ width: `${(passwordScore + 1) * 20}%` }}
                ></div>
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEmailAuth}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full font-medium"
          >
            {isSignUp ? "Create Account" : "Sign In"}
          </motion.button>
        </div>

        <p
          className="text-sm text-gray-500 cursor-pointer hover:text-blue-600 transition"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </p>

        <p className="text-xs text-gray-400 text-center">We never share your information.</p>
      </motion.div>
    </div>
  );
}
