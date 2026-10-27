import { Link } from "react-router-dom";
import heroImg from "@/assets/images/Hero-1.png";
import ServiceBenefits from "@/components/home/ServiceBenefits";
import HeroFloatingCollage from "@/components/home/Herofloatingcollage";
import ShopByCategory from "@/components/home/ShopByCategory";
import CollectionBanner from "@/components/home/CollectionBanner";
import BestSellers from "@/components/home/BestSellers";
import Button from "@/components/common/Button";
import { ROUTES } from "@/constants/routes";
import { useBestSellers } from "@/hooks/useBestSellers";
import { useWishlist } from "@/hooks/useWishlist";

export default function Home() {
  const { data, isLoading } = useBestSellers();
  const { ids, toggle } = useWishlist();

  // Array-ah thaan irukkalam, illa { products | data | items } kulla irukkalam
  const products = Array.isArray(data)
    ? data
    : data?.products ?? data?.data ?? data?.items ?? [];

  return (
    <>
      <section className="relative isolate flex min-h-[calc(100svh-8rem)] w-full flex-col overflow-hidden">
        <img
          src={heroImg}
          alt="Handcrafted footwear"
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[75%_bottom] lg:object-center"
        />
        <div className="absolute inset-0 -z-10 bg-canvas/30" />

        <div className="hidden md:block">
          <HeroFloatingCollage />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-4 pb-6 pt-10 sm:px-6 sm:pt-16 lg:pb-40">
          <div>
            <h1 className="font-heading text-4xl leading-tight text-display sm:text-5xl lg:text-7xl">
              Upgrade Your Style
              <span className="mt-2 block text-3xl sm:text-4xl lg:text-6xl">
                Shop The Latest Trends
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-base text-body">
              Discover premium-quality products, unbeatable prices, and a
              seamless shopping experience.
            </p>

            <Link to={ROUTES.PRODUCTS} className="mt-8 inline-block">
              <Button>Shop Now</Button>
            </Link>
          </div>
        </div>

        <div className="z-10 mx-auto w-full max-w-7xl px-4 pb-6 sm:px-6 lg:absolute lg:inset-x-0 lg:bottom-8 lg:pb-0">
          <ServiceBenefits />
        </div>
      </section>

      <ShopByCategory />

    

      <CollectionBanner />
        <BestSellers
        products={products}
        isLoading={isLoading}
        wishlistIds={ids}
        onToggleWishlist={toggle}
      />
    </>
  );
}


//    <div>
//            <section className="bg-hero min-h-screen px-6 py-16">
//       <h1 className="font-heading text-5xl text-display">Walk in Comfort</h1>
//       <p className="mt-2 text-muted">Handcrafted footwear</p>
// <h1 className="font-heading text-5xl text-display p-10">Home</h1>
//       <button className="mt-6 rounded-full bg-pill px-4 py-2 text-inverse transition hover:bg-terracotta">
//         Shop Now
//       </button>
//     </section>
//     </div>

//    <div>
//            <section className="bg-hero min-h-screen px-6 py-16">
//       <h1 className="font-heading text-5xl text-display">Walk in Comfort</h1>
//       <p className="mt-2 text-muted">Handcrafted footwear</p>
// <h1 className="font-heading text-5xl text-display p-10">Home</h1>
//       <button className="mt-6 rounded-full bg-pill px-4 py-2 text-inverse transition hover:bg-terracotta">
//         Shop Now
//       </button>
//     </section>
//     </div>