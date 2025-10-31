"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

export default function ResultPage() {
  const { refId } = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!refId) return;

    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/ref/${refId}`);
        setBooking(res.data.booking); // ✅ fixed
      } catch (err) {
        console.error("❌ Failed to fetch booking:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [refId]);

  if (loading) return <p>Loading booking details...</p>;
  if (!booking) return <p>No booking found for reference {refId}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">🎉 Booking Confirmed!</h1>
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md text-center">
        <p className="text-lg mb-2">Reference ID: <strong>{booking.refId}</strong></p>
        <p>Name: {booking.fullName}</p>
        <p>Email: {booking.email}</p>
        <p>Experience: {booking.experienceName}</p>
        <p>Date: {booking.date}</p>
        <p>Time: {booking.time}</p>
        <p>Quantity: {booking.qty}</p>
        <p className="font-semibold mt-2">Total: ₹{booking.totalPrice}</p>
      </div>
    </div>
  );
}
