import { FormEvent, useState } from "react";
import { AuthAPI, setToken } from "~/utils/api";
import { Button, TextInput } from "~/components/Forms";
import type { ApiError } from "~/utils/api";

/**
 * PUBLIC_INTERFACE
 * SignIn route - allows users to sign in with email/password.
 */
export default function SignInRoute() {
  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await AuthAPI.signIn(email, password);
      setToken(res.token);
      window.location.href = "/dashboard";
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message ?? "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-blue-500/10 to-gray-50">
      <div className="w-full max-w-md card">
        <h1 className="text-xl font-semibold text-gray-900">Welcome back</h1>
        <p className="text-sm text-gray-600">Sign in to your account</p>

        {error ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <TextInput
            id="email"
            label="Email"
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
          />
          <TextInput
            id="password"
            label="Password"
            placeholder="********"
            type="password"
            value={password}
            onChange={(e) => setPwd(e.currentTarget.value)}
            required
          />
          <div className="flex items-center justify-between">
            <a className="text-sm text-blue-700 hover:underline" href="/forgot-password">Forgot password?</a>
            <a className="text-sm text-gray-600 hover:underline" href="/signup">Create account</a>
          </div>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
