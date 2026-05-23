export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  shortDescription: string;
  image: string;
  category: string;
  reference?: string;
  ecology?: string;
  benefits?: string;
  iucnStatus?: string;
  createdAt?: number;
  updatedAt?: number;
  images?: {
    flower?: string;
    leaf?: string;
    fruit?: string;
    bark?: string;
  };
  characteristics: {
    leaf: string;
    flower: string;
    fruit: string;
    bark: string;
    height: string;
  };
}

export const plants: Plant[] = [];

export const categories = ["ทั้งหมด", "ไม้ดอก", "ไม้ใบ", "สมุนไพร", "ไม้ยืนต้น", "ไม้น้ำ"];
