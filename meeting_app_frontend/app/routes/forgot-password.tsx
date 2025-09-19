import { FormEvent, useState } from "react";
import { AuthAPI } from "~/utils/api";
import { Button, TextInput } from "~/components/Forms";
import type { ApiError } from "~/utils/api";

/**
 * PUBLIC_INTERFACE
 * ForgotPassword route - trigger password reset email.
 */
export default function ForgotPasswordRoute() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await AuthAPI.forgot(email);
      setOk(true);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message ?? "Failed to send reset email");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-blue-500/10 to-gray-50">
      <div className="w-full max-w-md card">
        <h1 className="text-xl font-semibold text-gray-900">Reset your password</h1>
        <p className="text-sm text-gray-600">Enter your email to receive a reset link</p>
        {ok ? (
          <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            If an account exists for {email}, a reset link has been sent.
          </div>
        ) : null}
        {error ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        ) : null}
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <TextInput id="email" label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.currentTarget.value)} required />
          <div className="flex items-center justify-between">
            <a className="text-sm text-blue-700 hover:underline" href="/signin">Back to sign in</a>
          </div>
          <Button type="submit" variant="primary">Send reset link</Button>
        </form>
      </div>
    </div>
  );
}
