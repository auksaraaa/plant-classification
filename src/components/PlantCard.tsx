import { Link } from "react-router-dom";
import type { Plant } from "@/data/plants";

const PlantCard = ({ plant }: { plant: Plant }) => (
  <Link
    to={`/plant/${plant.id}`}
    className="group block rounded-lg sm:rounded-xl overflow-hidden bg-card plant-card-shadow transition-all duration-300 hover:plant-card-shadow-hover hover:-translate-y-1 active:translate-y-0"
  >
    <div className="aspect-square overflow-hidden bg-accent">
      <img
        src={plant.image}
        alt={plant.name}
        loading="lazy"
        width={400}
        height={400}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>
    <div className="p-3 sm:p-4">
      <span className="text-[10px] sm:text-xs font-medium text-primary bg-accent px-2 py-1 rounded-full inline-block">
        {plant.category}
      </span>
      <h3 className="mt-2 font-semibold text-foreground text-sm sm:text-base leading-snug">{plant.name}</h3>
      <p className="text-[10px] sm:text-xs text-muted-foreground italic">{plant.scientificName}</p>
      <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2">{plant.shortDescription}</p>
    </div>
  </Link>
);

export default PlantCard;
