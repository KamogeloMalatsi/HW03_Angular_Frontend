export interface BrandReport {
  brandName: string;
  count: number;
}

export interface ProductTypeReport {
  productTypeName: string;
  count: number;
}

export interface Product {
  name: string;
  price: number;
}

export interface Brand {
  brandName: string;
  products: Product[];
}

export interface ActiveProduct {
  productTypeName: string;
  brands: Brand[];
}
