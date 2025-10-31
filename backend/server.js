// backend/server.js
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomBytes } from "crypto"; // ✅ for refId generation

// ✅ Fix __dirname and __filename in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ✅ File paths
const DATA_DIR = path.join(__dirname, "data");
const EXPERIENCES_FILE = path.join(DATA_DIR, "experiences.json");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

// ✅ Helper functions
function readExperiences() {
  const raw = fs.readFileSync(EXPERIENCES_FILE, "utf-8");
  return JSON.parse(raw);
}

function readBookings() {
  try {
    return JSON.parse(fs.readFileSync(BOOKINGS_FILE, "utf-8"));
  } catch (e) {
    return [];
  }
}

function writeBookings(bookings) {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf-8");
}

// ✅ Generate short booking reference (like "HUF56&SO")
function generateRefId() {
  return randomBytes(4).toString("hex").toUpperCase().slice(0, 8);
}

// ✅ Get all experiences
app.get("/experiences", (req, res) => {
  const exps = readExperiences();
  res.json(exps);
});

// ✅ Get single experience with slot availability
app.get("/experiences/:id", (req, res) => {
  const id = Number(req.params.id);
  const exps = readExperiences();
  const exp = exps.find((x) => x.id === id);

  if (!exp) {
    return res.status(404).json({ message: "Experience not found" });
  }

  const bookings = readBookings();
  const slotsWithRemaining = exp.slots.map((slot) => {
    const already = bookings
      .filter((b) => b.slotId === slot.id)
      .reduce((sum, b) => sum + b.qty, 0);

    return { ...slot, remaining: Math.max(0, slot.capacity - already) };
  });

  res.json({ ...exp, slots: slotsWithRemaining });
});

// ✅ Create new booking
app.post("/bookings", (req, res) => {
  console.log("📦 Received booking:", req.body); 
  const { slotId, experienceId, fullName, email, phone, qty } = req.body || {};

  if (!slotId || !experienceId || !fullName || !email || !qty) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const exps = readExperiences();
  const exp = exps.find((x) => x.id === Number(experienceId));
  if (!exp) return res.status(404).json({ error: "Experience not found" });

  const slot = exp.slots.find((s) => s.id === Number(slotId));
  if (!slot) return res.status(404).json({ error: "Slot not found" });

  const bookings = readBookings();
  const alreadyBooked = bookings
    .filter((b) => b.slotId === slot.id)
    .reduce((s, b) => s + b.qty, 0);

  const remaining = slot.capacity - alreadyBooked;
  if (qty > remaining) {
    return res.status(400).json({ error: "Not enough seats available", remaining });
  }

  const refId = generateRefId(); // ✅ Unique confirmation ID

  const newBooking = {
    id: Date.now(),
    refId,
    experienceId: Number(experienceId),
    slotId: Number(slotId),
    fullName,
    email,
    phone: phone || null,
    qty: Number(qty),
    experienceName: exp.title,
    date: slot.date,
    time: slot.time,
    subtotal: exp.price * qty,
    taxes: Math.round(exp.price * qty * 0.06),
    totalPrice: Math.round(exp.price * qty * 1.06),
    createdAt: new Date().toISOString(),
  };

  bookings.push(newBooking);
  writeBookings(bookings);

  res.json({ success: true, refId }); // ✅ Return only refId
});

// ✅ Get single booking by numeric ID (optional)
app.get("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  const bookings = readBookings();
  const booking = bookings.find((b) => b.id === id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  res.json({ booking });
});

// ✅ Get booking by refId (for confirmation page)
app.get("/bookings/ref/:refId", (req, res) => {
  const { refId } = req.params;
  const bookings = readBookings();
  const booking = bookings.find((b) => b.refId === refId);
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  res.json({ booking });
});


// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
