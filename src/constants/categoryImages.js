/*
 * Thumbnails for the "Shop By Category" carousel, keyed by category slug
 * (slugs come from CATEGORIES in constants/navigation.js).
 *
 * The files in assets/images/categories/ are 520x520 WebP crops generated from
 * the existing hero assets (ft-*.png / ft-chair.jpg) so each card loads
 * ~30 KB instead of 1-2 MB. They are STAND-IN images: replace a file (same
 * name) with a real category photo whenever you have one.
 *
 * `fit: "cover"` is for opaque photos that should fill the card edge-to-edge;
 * everything else is an isolated product shown with `object-contain`.
 * A slug with no entry (e.g. "toys-and-kids") renders a lettered placeholder.
 */
import men from "@/assets/images/ft-jackt2.png";
import women from "@/assets/images/ft-purchase-3.png";
import electronics from "@/assets/images/ft-speker.png";
import home from "@/assets/images/ft-chair.jpg";
import beauty from "@/assets/images/ft-pefume.png";
import sports from "@/assets/images/ft-sunglass.png";

export const CATEGORY_IMAGES = {
  men: { src: men },
  women: { src: women },
  electronics: { src: electronics },
  "home-and-living": { src: home, fit: "cover" },
  "beauty-and-personal-care": { src: beauty },
  "sports-and-fitness": { src: sports },
};
