'use client';

const events = [
  { day: '28', month: 'AUG', title: 'Team Offsite', time: '9:00 AM – 6:00 PM', location: 'Office Campus' },
  { day: '05', month: 'SEP', title: 'Annual Townhall', time: '3:00 PM – 5:00 PM', location: 'Main Cafeteria / Zoom' },
  { day: '01', month: 'DEC', title: 'Q3 Review Starts', time: 'All Day' },
];

const holidays = [
  { day: '25', month: 'DEC', weekday: 'Monday', name: 'Christmas Day' },
  { day: '01', month: 'JAN', weekday: 'Friday', name: "New Year's Day" },
];

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      <div className="bg-white border-b border-gray-200 shadow-sm px-4 sm:px-8 py-6 sm:py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Calendar</h1>
        <p className="text-base text-gray-600">Upcoming company events and holidays</p>
      </div>
      <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.title} className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex flex-col items-center justify-center shrink-0 leading-none">
                  <span className="text-[10px] font-semibold text-blue-600">{event.month}</span>
                  <span className="text-base font-bold text-blue-700">{event.day}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-500">{event.time}</p>
                  {event.location ? <p className="text-xs text-gray-400">{event.location}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Upcoming Holidays</h2>
          <div className="space-y-4">
            {holidays.map((holiday) => (
              <div key={holiday.name} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-50 flex flex-col items-center justify-center shrink-0 leading-none">
                  <span className="text-[10px] font-semibold text-orange-600">{holiday.month}</span>
                  <span className="text-base font-bold text-orange-700">{holiday.day}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{holiday.name}</p>
                  <p className="text-xs text-gray-500">{holiday.weekday}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
