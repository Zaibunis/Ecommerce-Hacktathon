export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;
  discountPercent?: number;
  isNew?: boolean;
  colors?: string[];
  sizes?: string[];
};
