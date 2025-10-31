"use client";

import { useEffect, useState } from "react";
import ExperienceCard from "@/components/ExperienceCard";
import { api } from "@/lib/api";

interface Experience {
  id: number;
  title: string;
  location: string;
  imageUrl: string;
  price: number;
  description: string;
}

export default function Home() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filtered, setFiltered] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api
      .get("/experiences")
      .then((res) => {
        setExperiences(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Handle search locally in Home since Navbar no longer passes props
  useEffect(() => {
    if (!query) {
      setFiltered(experiences);
      return;
    }
    const q = query.toLowerCase();
    const results = experiences.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
    );
    setFiltered(results);
  }, [query, experiences]);

  return (
    <div className="min-h-screen bg-white">
      {/* ✅ Search bar is now handled here below Navbar */}
      

      <main className="max-w-6xl mx-auto px-6 pb-12">
        {loading ? (
          <p className="text-center text-gray-500">Loading experiences...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500">No experiences found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((exp) => (
              <ExperienceCard key={exp.id} {...exp} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
