import { useEffect, useMemo, useState } from "react";
import { AppShell } from "~/components/Layout";
import { Button } from "~/components/Forms";
import { MeetingsAPI, type Meeting } from "~/utils/api";
import { useAuth } from "~/utils/session.client";

/**
 * PUBLIC_INTERFACE
 * Dashboard shows quick stats and the upcoming meetings list.
 */
export default function DashboardRoute() {
  const { user, initializing, signOut } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MeetingsAPI.list()
      .then(setMeetings)
      .finally(() => setLoading(false));
  }, []);

  const upcoming = useMemo(
    () =>
      meetings
        .slice()
        .sort((a, b) => +new Date(a.startTime) - +new Date(b.startTime))
        .slice(0, 5),
    [meetings]
  );

  if (initializing) return null;

  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/signin";
    return null;
  }

  return (
    <AppShell user={user} onSignOut={signOut}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="card">
          <div className="text-sm text-gray-500">Upcoming</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">{meetings.length}</div>
          <div className="mt-4">
            <a href="/meetings" className="text-sm text-blue-700 hover:underline">View all meetings</a>
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500">Schedule</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">Create a meeting</div>
          <div className="mt-4">
            <a href="/meetings/new" className="btn-primary">New Meeting</a>
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500">Calendar</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">Month View</div>
          <div className="mt-4">
            <a href="/calendar" className="btn-ghost">Open Calendar</a>
          </div>
        </div>
      </div>

      <div className="mt-8 card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Next meetings</h2>
          <a href="/meetings" className="text-sm text-blue-700 hover:underline">See all</a>
        </div>
        <div className="mt-4 divide-y">
          {loading ? (
            <div className="py-6 text-gray-500">Loading...</div>
          ) : upcoming.length === 0 ? (
            <div className="py-6 text-gray-500">No upcoming meetings.</div>
          ) : (
            upcoming.map((m) => (
              <div key={m.id} className="py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{m.title}</div>
                  <div className="text-sm text-gray-600">{new Date(m.startTime).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={`/meetings/${m.id}`} className="btn-ghost">Details</a>
                  <JoinButton id={m.id} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}

function JoinButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  async function join() {
    setLoading(true);
    try {
      const res = await MeetingsAPI.join(id);
      if (res.joinUrl) window.open(res.joinUrl, "_blank");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Button variant="secondary" onClick={join} disabled={loading}>
      {loading ? "Joining..." : "Join"}
    </Button>
  );
}
