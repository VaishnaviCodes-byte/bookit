"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();

  const [exp, setExp] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    promo: "",
    agree: false,
  });
  const [loading, setLoading] = useState(false);

  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const slotId = searchParams.get("slotId");
  const qty = Number(searchParams.get("qty") || 1);

  useEffect(() => {
    api.get(`/experiences/${id}`).then((res) => setExp(res.data));
  }, [id]);

  const total = exp ? exp.price * qty + 59 : 0;

  const handleSubmit = async () => {
  if (!form.name || !form.email || !form.agree) {
    alert("Please fill all fields and agree to the terms.");
    return;
  }

  if (!exp) {
    alert("Experience not loaded properly.");
    return;
  }

  const slot = exp.slots.find((s: any) => s.id === Number(slotId));

  if (!slot) {
    alert("Selected slot not found.");
    return;
  }

  setLoading(true);
  try {
    const res = await api.post("/bookings", {
      fullName: form.name,
      email: form.email,
      phone: form.phone || "",
      experienceId: exp.id,
      slotId: slot.id,
      qty,
    });

    router.push(`/result/${res.data.refId}`); // ✅ matches backend response
  } catch (error: any) {
    const msg = error.response?.data?.error || "Booking failed. Try again!";
    console.error("❌ Booking failed:", msg);
    alert(msg);
  } finally {
    setLoading(false);
  }
};



  if (!exp) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-5xl mx-auto px-6 py-8 flex gap-8">
        {/* Left section */}
        <div className="flex-1 bg-gray-50 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Checkout</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Full name"
              className="border rounded-lg p-2 w-full"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="border rounded-lg p-2 w-full"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <input
            type="text"
            placeholder="Phone (optional)"
            className="border rounded-lg p-2 w-full mb-4"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Promo code"
              className="border rounded-lg p-2 flex-1"
              onChange={(e) => setForm({ ...form, promo: e.target.value })}
            />
            <button className="bg-black text-white px-4 py-2 rounded-lg">Apply</button>
          </div>

          <label className="flex items-center text-sm text-gray-600 gap-2">
            <input
              type="checkbox"
              onChange={(e) => setForm({ ...form, agree: e.target.checked })}
            />
            I agree to the terms and safety policy
          </label>
        </div>

        {/* Right section */}
        <div className="w-80 bg-gray-50 rounded-xl p-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span>Experience</span> <span>{exp.title}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Date</span> <span>{date}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Time</span> <span>{time}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Qty</span> <span>{qty}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Subtotal</span> <span>₹{exp.price * qty}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Taxes</span> <span>₹59</span>
          </div>
          <hr />
          <div className="flex justify-between font-semibold">
            <span>Total</span> <span>₹{total}</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 rounded"
          >
            {loading ? "Processing..." : "Pay and Confirm"}
          </button>
        </div>
      </main>
    </div>
  );
}
