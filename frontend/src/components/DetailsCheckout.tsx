"use client";
import React from "react";

export default function DetailsCheckout({
  price,
  qty,
  onQtyChange,
  onConfirm,
  total,
  disabled
}: {
  price: number;
  qty: number;
  onQtyChange: (n: number) => void;
  onConfirm: () => void;
  total: number;
  disabled: boolean;
}) {
  return (
    <aside className="w-full md:w-96 p-4 bg-gray-50 rounded-xl shadow">
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm text-gray-500">Starts at</div>
        <div className="text-lg font-semibold">₹{price}</div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-sm">Quantity</div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border rounded-md" onClick={() => onQtyChange(Math.max(1, qty - 1))}>−</button>
          <div className="px-3">{qty}</div>
          <button className="px-3 py-1 border rounded-md" onClick={() => onQtyChange(qty + 1)}>+</button>
        </div>
      </div>

      <div className="border-t pt-3 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <div>Subtotal</div>
          <div>₹{price * qty}</div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <div>Taxes</div>
          <div>₹{Math.round((price * qty) * 0.05)}</div>
        </div>
        <div className="flex justify-between text-base font-semibold mt-2">
          <div>Total</div>
          <div>₹{total}</div>
        </div>
      </div>

      <button
        className={`mt-4 w-full py-2 rounded-md ${disabled ? "bg-gray-300 cursor-not-allowed" : "bg-yellow-400 hover:bg-yellow-500"}`}
        onClick={onConfirm}
        disabled={disabled}
      >
        Confirm
      </button>
    </aside>
  );
}
