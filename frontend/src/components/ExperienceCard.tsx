import Link from "next/link";

interface ExperienceCardProps {
  id: number;
  title: string;
  location: string;
  imageUrl: string;
  price: number;
  description: string;
}

export default function ExperienceCard({
  id,
  title,
  location,
  imageUrl,
  price,
  description,
}: ExperienceCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {location}
          </span>
          <span className="text-sm font-medium text-gray-500">Kayaking</span>
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-medium text-gray-800">From ₹{price}</span>
          <Link href={`/experiences/${id}`}>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-3 py-2 rounded-md text-sm">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
