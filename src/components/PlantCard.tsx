import { Link } from "react-router-dom";
import type { Plant } from "@/data/plants";

const PlantCard = ({ plant }: { plant: Plant }) => (
  <Link
    to={`/plant/${plant.id}`}
    className="group block rounded-xl overflow-hidden bg-card plant-card-shadow transition-all duration-300 hover:plant-card-shadow-hover hover:-translate-y-1"
  >
    <div className="aspect-square overflow-hidden">
      <img
        src={plant.image}
        alt={plant.name}
        loading="lazy"
        width={400}
        height={400}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>
    <div className="p-4">
      <span className="text-xs font-medium text-primary bg-accent px-2 py-1 rounded-full">
        {plant.category}
      </span>
      <h3 className="mt-2 font-semibold text-foreground">{plant.name}</h3>
      <p className="text-xs text-muted-foreground italic">{plant.scientificName}</p>
      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{plant.shortDescription}</p>
    </div>
  </Link>
);

export default PlantCard;
