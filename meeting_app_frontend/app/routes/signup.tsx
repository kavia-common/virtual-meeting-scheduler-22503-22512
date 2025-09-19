import { FormEvent, useState } from "react";
import { AuthAPI, setToken } from "~/utils/api";
import { Button, TextInput } from "~/components/Forms";
import type { ApiError } from "~/utils/api";

/**
 * PUBLIC_INTERFACE
 * SignUp route - create a new user account.
 */
export default function SignUpRoute() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await AuthAPI.signUp({ name, email, password });
      setToken(res.token);
      window.location.href = "/dashboard";
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message ?? "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-blue-500/10 to-gray-50">
      <div className="w-full max-w-md card">
        <h1 className="text-xl font-semibold text-gray-900">Create your account</h1>
        <p className="text-sm text-gray-600">Join Virtual Meeting Scheduler</p>

        {error ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <TextInput id="name" label="Name" placeholder="Your name" value={name} onChange={(e) => setName(e.currentTarget.value)} required />
          <TextInput id="email" label="Email" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} required />
          <TextInput id="password" label="Password" placeholder="********" type="password" value={password} onChange={(e) => setPwd(e.currentTarget.value)} required />
          <div className="flex items-center justify-between">
            <a className="text-sm text-blue-700 hover:underline" href="/signin">Already have an account?</a>
          </div>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </Button>
        </form>
      </div>
    </div>
  );
}
