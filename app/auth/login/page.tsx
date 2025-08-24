"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // 👈 handle redirect manually
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      window.location.href = "/dashboard"; // 👈 redirect here
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      {/* Credentials login */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 bg-white p-6 shadow-md rounded-lg"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="border px-3 py-2 rounded-md"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="border px-3 py-2 rounded-md"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>

      {/* Social logins */}
      <div className="flex flex-col gap-2 w-64">
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Continue with Google
        </button>

        <button
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
        >
          Continue with GitHub
        </button>
      </div>
    </div>
  );
}
