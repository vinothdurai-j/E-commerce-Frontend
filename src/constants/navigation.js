import { ROUTES } from "./routes";

const slugify = (s) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const make = (name, items) => ({
  name,
  slug: slugify(name),
  items: items.map((n) => ({ name: n, slug: slugify(n) })),
});

export const CATEGORIES = [
  make("Men", ["T-Shirts", "Shirts", "Jeans", "Trousers", "Shoes", "Watches", "Accessories"]),
  make("Women", ["Kurtis", "Sarees", "Dresses", "Tops", "Jeans", "Handbags", "Footwear", "Jewellery"]),
  make("Electronics", ["Mobiles", "Laptops", "Headphones", "Smartwatches", "Cameras", "Accessories"]),
  make("Home & Living", ["Furniture", "Lighting", "Kitchen", "Bedding", "Home Decor"]),
  make("Beauty & Personal Care", ["Skincare", "Makeup", "Haircare", "Perfumes", "Grooming"]),
  make("Sports & Fitness", ["Sportswear", "Gym Equipment", "Fitness Accessories"]),
  make("Toys & Kids", ["Kids Clothing", "Toys", "Baby Care", "School Supplies"]),
];

export const SHOP_LINKS = [
  { label: "All Products", to: ROUTES.PRODUCTS },
  { label: "Shop by Brand", to: `${ROUTES.PRODUCTS}?view=brands` },
  { label: "New Arrivals", to: `${ROUTES.PRODUCTS}?tag=new-arrivals` },
  { label: "Best Sellers", to: `${ROUTES.PRODUCTS}?tag=best-sellers` },
  { label: "Trending Products", to: `${ROUTES.PRODUCTS}?tag=trending` },
  { label: "Sale Products", to: `${ROUTES.PRODUCTS}?tag=sale` },
];

export const OFFER_LINKS = [
  { label: "Today's Deals", to: `${ROUTES.OFFERS}?type=todays-deals` },
  { label: "Discount Products", to: `${ROUTES.OFFERS}?type=discounts` },
  { label: "Coupons", to: `${ROUTES.OFFERS}?type=coupons` },
  { label: "Bank Offers", to: `${ROUTES.OFFERS}?type=bank-offers` },
  { label: "Clearance Sale", to: `${ROUTES.OFFERS}?type=clearance` },
];

export const INFO_LINKS = [
  { label: "About Us", to: ROUTES.ABOUT },
  { label: "Contact Us", to: ROUTES.CONTACT },
  { label: "Help Center", to: ROUTES.HELP },
  { label: "FAQs", to: ROUTES.FAQS },
  { label: "Shipping Policy", to: ROUTES.SHIPPING_POLICY },
  { label: "Return Policy", to: ROUTES.RETURN_POLICY },
  { label: "Privacy Policy", to: ROUTES.PRIVACY },
  { label: "Terms & Conditions", to: ROUTES.TERMS },
];

export const categoryPath = (slug, sub) =>
  sub ? `/category/${slug}/${sub}` : `/category/${slug}`;