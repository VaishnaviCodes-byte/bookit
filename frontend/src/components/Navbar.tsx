"use client";

import { useState } from "react";

export default function Navbar() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search query:", query);
    // later: router.push(`/search?q=${query}`)
  };

  return (
    <header className="w-full bg-white shadow-sm py-3 px-6 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="../logo.png" alt="logo" className="w-18 h-8" />
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex items-center gap-2 w-full max-w-md">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search experiences"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-400"
        />
        <button
          type="submit"
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-2 rounded-md transition"
        >
          Search
        </button>
      </form>
    </header>
  );
}
