"use client";
import React from "react";

export interface Slot {
  id: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  capacity: number;  
  remaining?: number; // computed on backend
}

export default function SlotSelector({
  slots,
  selectedDate,
  onSelectSlot,
  selectedSlotId,
}: {
  slots: Slot[];
  selectedDate: string | null;
  selectedSlotId?: number | null;
  onSelectSlot: (slotId: number) => void;
}) {
  // show times for selected date sorted
  const times = (slots || []).filter((s) => (selectedDate ? s.date === selectedDate : true));

  // group by date for date buttons
  const uniqueDates = Array.from(new Set(slots.map((s) => s.date)));

  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-medium mb-2">Choose date</div>
        <div className="flex gap-2 flex-wrap">
          {uniqueDates.map((d) => {
            const isSelected = d === selectedDate;
            return (
              <button
                key={d}
                onClick={() => onSelectSlot(-1) /* clear selection when date changed */}
                className={`px-3 py-1 rounded-md border ${isSelected ? "bg-yellow-400" : "bg-white"} text-sm`}
                onMouseDown={(e)=>e.preventDefault()}
                // use data-attr to communicate date selection to parent by calling onSelectSlot with -1 and parent should set date
              >
                {new Date(d).toLocaleDateString()}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-sm font-medium mb-2">Choose time</div>
        <div className="flex gap-2 flex-wrap">
          {times.map((t) => {
            const disabled = t.remaining === 0;
            const isSelected = selectedSlotId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => !disabled && onSelectSlot(t.id)}
                className={`px-3 py-2 rounded-md border text-sm ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-400" : (isSelected ? "bg-black text-white" : "bg-white")}`}
              >
                <div className="text-sm font-medium">{t.time}</div>
                <div className="text-xs text-gray-500">{disabled ? "Sold out" : `${t.remaining ?? t.capacity} left`}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
