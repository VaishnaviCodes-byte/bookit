"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import SlotSelector from "@/components/SlotSelector";
import DetailsCheckout from "@/components/DetailsCheckout";
import Link from "next/link";

interface Slot {
  id: number;
  date: string;
  time: string;
  capacity?: number;
  remaining?: number;
}

interface Experience {
  id: number;
  title: string;
  location: string;
  imageUrl: string;
  price: number;
  description: string;
  about?: string;
  slots: Slot[];
}

export default function DetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [exp, setExp] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [qty, setQty] = useState<number>(1);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/experiences/${id}`)
      .then((res) => {
        setExp(res.data);
        // default date to first slot date
        if (res.data.slots && res.data.slots.length) {
          setSelectedDate(res.data.slots[0].date);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const slots = exp?.slots || [];

  // compute available slots for UI
  const availableSlotsForDate = useMemo(() => slots.filter(s => s.date === selectedDate), [slots, selectedDate]);

  // total price
  const total = exp ? Math.round(exp.price * qty * 1.05) : 0; // includes 5% tax

  const handleSelectSlot = (slotId: number) => {
    if (slotId === -1) {
      // -1 used as clear selection when date button clicked
      setSelectedSlotId(null);
      return;
    }
    setSelectedSlotId(slotId);
  };

  const handleConfirm = async () => {
    if (!exp || !selectedSlotId) {
      alert("Please select a time slot.");
      return;
    }
    const slot = slots.find(s => s.id === selectedSlotId);
    if (!slot) return;

    // check remaining before posting
    if ((slot.remaining ?? slot.capacity ?? 0) < qty) {
      alert("Not enough seats available for this slot.");
      return;
    }

    setConfirming(true);
    try {
      const payload = {
        experienceId: exp.id,
        slotId: selectedSlotId,
        fullName: "Test User",
        email: "test@example.com",
        phone: null,
        qty
      };
      const res = await api.post("/bookings", payload);
      if (res.data?.success) {
        // navigate to result page (you may implement a dedicated result route)
        router.push(`/checkout/${exp.id}?date=${selectedDate}&time=${slot.time}&qty=${qty}`);
      } else {
        alert("Booking failed: " + (res.data?.error || "Unknown"));
      }
    } catch (err: any) {
      console.error(err);
      alert("Booking failed: " + (err?.response?.data?.error || err.message || "Network error"));
    } finally {
      setConfirming(false);
    }
  };
  

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!exp) return <div className="min-h-screen flex items-center justify-center">Not found</div>;

  // unique dates
  const uniqueDates = Array.from(new Set(slots.map(s => s.date)));

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Link href="/" className="text-gray-600 mb-4 inline-block">← Details</Link>

          <img src={exp.imageUrl} className="w-full h-80 object-cover rounded-xl shadow" />

          <h1 className="text-3xl font-semibold mt-6">{exp.title}</h1>
          <p className="text-gray-600 mt-2">{exp.location}</p>

          <p className="mt-6 text-gray-700">{exp.description}</p>

          <div className="mt-8">
            <div className="text-sm font-medium mb-2">Choose date</div>
            <div className="flex gap-2 mb-4">
              {uniqueDates.map(d => {
                const selected = d === selectedDate;
                return (
                  <button
                    key={d}
                    onClick={() => { setSelectedDate(d); setSelectedSlotId(null); }}
                    className={`px-3 py-2 rounded-md border ${selected ? "bg-yellow-400" : "bg-white"}`}
                  >
                    {new Date(d).toLocaleDateString()}
                  </button>
                );
              })}
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Choose time</div>
              <div className="flex gap-2 flex-wrap">
                {availableSlotsForDate.map(s => {
                  const disabled = (s.remaining ?? s.capacity ?? 0) <= 0;
                  const selected = selectedSlotId === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => !disabled && setSelectedSlotId(s.id)}
                      className={`px-3 py-2 rounded-md border ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : (selected ? "bg-black text-white" : "bg-white")}`}
                    >
                      <div className="text-sm font-medium">{s.time}</div>
                      <div className="text-xs text-gray-500">{disabled ? "Sold out" : `${s.remaining ?? s.capacity} left`}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm font-medium mb-2">About</div>
              <div className="p-3 bg-gray-50 rounded">{exp.about || "Details about the experience."}</div>
            </div>
          </div>
        </div>

        <div>
          <DetailsCheckout
            price={exp.price}
            qty={qty}
            onQtyChange={(n) => setQty(n)}
            onConfirm={handleConfirm}
            total={total}
            disabled={confirming || !selectedSlotId}
          />
        </div>
      </div>
    </div>
  );
}
