import { useEffect, useState } from "react";
import { AppShell } from "~/components/Layout";
import { MeetingsAPI, type Meeting } from "~/utils/api";
import { useAuth } from "~/utils/session.client";

/**
 * PUBLIC_INTERFACE
 * Meetings list route.
 */
export default function MeetingsIndexRoute() {
  const { user, initializing, signOut } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MeetingsAPI.list()
      .then(setMeetings)
      .finally(() => setLoading(false));
  }, []);

  if (initializing) return null;
  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/signin";
    return null;
  }

  return (
    <AppShell user={user} onSignOut={signOut}>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Meetings</h1>
        <a href="/meetings/new" className="btn-primary">Schedule Meeting</a>
      </div>
      <div className="mt-6 card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-600">
            <tr>
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Start</th>
              <th className="py-2 pr-4">End</th>
              <th className="py-2 pr-4">Participants</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td className="py-6 text-gray-500" colSpan={5}>Loading...</td></tr>
            ) : meetings.length === 0 ? (
              <tr><td className="py-6 text-gray-500" colSpan={5}>No meetings yet.</td></tr>
            ) : (
              meetings.map((m) => (
                <tr key={m.id} className="align-top">
                  <td className="py-3 pr-4">
                    <a className="font-medium text-blue-700 hover:underline" href={`/meetings/${m.id}`}>{m.title}</a>
                    <div className="text-xs text-gray-500">{m.location || m.link || "—"}</div>
                  </td>
                  <td className="py-3 pr-4">{new Date(m.startTime).toLocaleString()}</td>
                  <td className="py-3 pr-4">{new Date(m.endTime).toLocaleString()}</td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {m.participants?.slice(0, 4).map((p, idx) => (
                        <span key={idx} className="badge">{p.email}</span>
                      ))}
                      {m.participants && m.participants.length > 4 ? (
                        <span className="text-xs text-gray-500">+{m.participants.length - 4} more</span>
                      ) : null}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex gap-2">
                      <a className="btn-ghost" href={`/meetings/${m.id}`}>View</a>
                      <a className="btn-ghost" href={`/meetings/${m.id}/edit`}>Edit</a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
