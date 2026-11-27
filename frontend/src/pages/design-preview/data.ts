export type Product = {
  name: string
  brand: string
  price: string
  image: string
  tag: string
}

export function imageUrl(id: string, width = 1200) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`
}
