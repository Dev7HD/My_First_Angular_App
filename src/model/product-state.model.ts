import {Product} from "./product.model";

export interface ProductState{
  products: Product[];
  keyword: string;
  size: number;
  thisPage: number;
  totalPages: number;
  totalSearchPages: number;
  pagesArray: number[];
  totalCountProducts: number;
  totalCurrentProducts: number;
  selectedProduct: Product | null;
  totalAvailable: number;
  totalSelected: number;
}
