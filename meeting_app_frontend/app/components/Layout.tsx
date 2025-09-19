import { NavLink } from "@remix-run/react";
import { ReactNode } from "react";

/**
 * PUBLIC_INTERFACE
 * AppShell provides the sidebar + header layout for authenticated routes.
 */
export function AppShell({ user, onSignOut, children }: { user: { name?: string; email?: string } | null; onSignOut: () => void; children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 border-r border-gray-200 bg-white">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-md bg-blue-600 flex items-center justify-center text-white font-semibold">VM</div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Virtual Meetings</div>
              <div className="text-xs text-gray-500">Ocean Professional</div>
            </div>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          <SidebarLink to="/dashboard" label="Dashboard" icon="🏠" />
          <SidebarLink to="/meetings" label="Meetings" icon="📅" />
          <SidebarLink to="/calendar" label="Calendar" icon="🗓️" />
          <SidebarLink to="/meetings/new" label="Schedule" icon="➕" />
        </nav>
        <div className="mt-auto p-4 text-xs text-gray-500">
          <div className="mb-2">Signed in as</div>
          <div className="font-medium text-gray-800">{user?.name ?? user?.email ?? "User"}</div>
          <button onClick={onSignOut} className="mt-3 btn-ghost w-full">Sign out</button>
        </div>
      </aside>
      <main className="flex-1">
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-900">Virtual Meeting Scheduler</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="hidden sm:inline text-gray-600">Ocean Professional</span>
              <span className="badge">v1.0</span>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-6 py-6">{children}</div>
      </main>
    </div>
  );
}

function SidebarLink({ to, label, icon }: { to: string; label: string; icon?: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "sidebar-link",
          isActive ? "sidebar-link-active" : "",
        ].join(" ")
      }
      end
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}
