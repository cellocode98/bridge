"use client";

import { useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion, AnimatePresence } from "framer-motion";

interface VolunteerCalendarProps {
  opportunities: {
    date: string; // YYYY-MM-DD
    title: string;
    organization: string;
  }[];
}

// parse date string YYYY-MM-DD as local date
function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function VolunteerCalendar({ opportunities }: VolunteerCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [eventsForDay, setEventsForDay] = useState<{ title: string; organization: string }[]>([]);

  // map all opportunity dates to local dates
  const markedDates = useMemo(
    () => opportunities.map((op) => parseLocalDate(op.date).toDateString()),
    [opportunities]
  );

  const tileClassName = ({ date }: { date: Date }) => {
    return markedDates.includes(date.toDateString())
      ? "bg-blue-500 text-white rounded-full"
      : "";
  };

  const handleDateClick = (date: Date) => {
    const events = opportunities.filter(
      (op) => parseLocalDate(op.date).toDateString() === date.toDateString()
    );
    setSelectedDate(date);
    setEventsForDay(events);
  };

  return (
    <div className="relative w-full text-gray-700">
      <Calendar
        tileClassName={tileClassName}
        onClickDay={handleDateClick}
        className="rounded-3xl border-none shadow-md w-full bg-white/70 backdrop-blur-lg p-4 text-gray-700"
      />

      {/* Modal Popup for events on selected date */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-3xl z-10"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 w-80">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Opportunities on {selectedDate.toDateString()}
              </h3>
              {eventsForDay.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {eventsForDay.map((e, i) => (
                    <li
                      key={i}
                      className="p-2 bg-blue-100 rounded-lg text-gray-800 text-sm"
                    >
                      <span className="font-medium">{e.title}</span>
                      <div className="text-xs text-gray-600">{e.organization}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-sm">No opportunities found.</p>
              )}
              <button
                onClick={() => setSelectedDate(null)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
