import { useMemo } from "react";

// Placeholder images. Real images ready aanadhum import pannittu inga maathunga.
const img = (text) =>
  `https://placehold.co/600x600/f6f6f6/8a6f5a?text=${encodeURIComponent(text)}`;

// Dummy data. API ready aanadhum idhai remove pannidalaam.
const DUMMY_BEST_SELLERS = [
  { id: "bs-1", name: "Urban Trekker Boots", category: "Hiking Collection", price: 120, originalPrice: 150, rating: 4.8, images: [img("Urban Trekker")] },
  { id: "bs-2", name: "Classic Leather Loafers", category: "Men's Formal", price: 95, originalPrice: 120, rating: 4.6, images: [img("Leather Loafers")] },
  { id: "bs-3", name: "Sporty Runner X1", category: "Running Gear", price: 85, originalPrice: 110, rating: 4.7, images: [img("Runner X1")] },
  { id: "bs-4", name: "Canvas Low-Tops", category: "Casual Wear", price: 60, originalPrice: 75, rating: 4.4, images: [img("Canvas Low-Tops")] },
  { id: "bs-5", name: "Trail Blazer Sneakers", category: "Hiking Collection", price: 110, originalPrice: 140, rating: 4.5, images: [img("Trail Blazer")] },
  { id: "bs-6", name: "Suede Chelsea Boots", category: "Men's Formal", price: 130, originalPrice: 160, rating: 4.9, images: [img("Chelsea Boots")] },
];

/**
 * Best sellers hook. Ippo dummy data return pannum.
 * Return shape useQuery maadhiri irukku, so API vandhaalum Home.jsx maaradhu.
 *
 * API ready aanadhum ithai ippadi maathunga:
 *
 *   import { useQuery } from "@tanstack/react-query";
 *   import getAllProducts from "@/service/products/getAllProducts";
 *
 *   export function useBestSellers() {
 *     return useQuery({
 *       queryKey: ["products", "best-sellers"],
 *       queryFn: () => getAllProducts({ sort: "bestseller", limit: 8 }),
 *     });
 *   }
 */
export function useBestSellers() {
  const data = useMemo(() => DUMMY_BEST_SELLERS, []);
  return { data, isLoading: false, isError: false };
}

export default useBestSellers;