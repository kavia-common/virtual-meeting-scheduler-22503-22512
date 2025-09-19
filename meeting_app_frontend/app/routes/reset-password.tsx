import { FormEvent, useState } from "react";
import { useSearchParams } from "@remix-run/react";
import { AuthAPI } from "~/utils/api";
import { Button, TextInput } from "~/components/Forms";
import type { ApiError } from "~/utils/api";

/**
 * PUBLIC_INTERFACE
 * ResetPassword route - set a new password using token from email.
 */
export default function ResetPasswordRoute() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPwd] = useState("");
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await AuthAPI.reset(token, password);
      setOk(true);
      setTimeout(() => (window.location.href = "/signin"), 1200);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message ?? "Failed to reset password");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-blue-500/10 to-gray-50">
      <div className="w-full max-w-md card">
        <h1 className="text-xl font-semibold text-gray-900">Choose a new password</h1>
        <p className="text-sm text-gray-600">Enter your new password below</p>
        {ok ? (
          <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            Password reset successful. Redirecting to sign in...
          </div>
        ) : null}
        {error ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        ) : null}
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <TextInput id="password" label="New password" type="password" placeholder="********" value={password} onChange={(e) => setPwd(e.currentTarget.value)} required />
          <Button type="submit" variant="primary">Reset password</Button>
        </form>
      </div>
    </div>
  );
}
