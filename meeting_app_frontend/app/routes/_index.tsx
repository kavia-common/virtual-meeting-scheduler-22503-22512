import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    window.location.href = token ? "/dashboard" : "/signin";
  }, []);
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <div className="mx-auto h-14 w-14 rounded-lg bg-blue-600 text-white grid place-items-center text-xl font-bold">VM</div>
        <h1 className="mt-4 text-2xl font-semibold text-gray-900">Virtual Meeting Scheduler</h1>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
