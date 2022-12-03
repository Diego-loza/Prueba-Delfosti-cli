export interface Producto {
  _id: string,
  name: string,
  category: {
    name: string,
    slug: string
  },
  brand: {
    name: string,
    slug: string
  },
  slug: string,
  status: number
}
