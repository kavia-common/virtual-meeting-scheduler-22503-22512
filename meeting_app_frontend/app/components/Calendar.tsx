import { addDays, endOfMonth, format, isSameDay, startOfMonth, startOfWeek } from "date-fns";
import { Meeting } from "~/utils/api";

/**
 * PUBLIC_INTERFACE
 * MonthCalendar shows a simple month grid and renders meeting badges.
 */
export function MonthCalendar({
  current,
  meetings,
  onSelectDate,
}: {
  current: Date;
  meetings: Meeting[];
  onSelectDate?: (d: Date) => void;
}) {
  const start = startOfWeek(startOfMonth(current), { weekStartsOn: 0 });
  const end = endOfMonth(current);
  const days: Date[] = [];
  for (let d = start; d <= end; d = addDays(d, 1)) {
    days.push(d);
  }

  function meetingsFor(day: Date) {
    return meetings.filter((m) => isSameDay(new Date(m.startTime), day));
  }

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => {
        const list = meetingsFor(day);
        return (
          <button
            key={day.toISOString()}
            className="rounded-md border bg-white p-2 text-left hover:border-blue-400 hover:shadow-sm transition"
            onClick={() => onSelectDate?.(day)}
          >
            <div className="text-xs font-medium text-gray-500">{format(day, "EEE")}</div>
            <div className="text-sm font-semibold text-gray-900">{format(day, "d")}</div>
            <div className="mt-2 space-y-1">
              {list.slice(0, 3).map((m) => (
                <div key={m.id} title={m.title} className="truncate rounded bg-blue-50 px-2 py-1 text-xs text-blue-700 ring-1 ring-blue-200">
                  {format(new Date(m.startTime), "HH:mm")} {m.title}
                </div>
              ))}
              {list.length > 3 ? (
                <div className="text-[11px] text-gray-500">+{list.length - 3} more</div>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
