import { Link, NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { CATEGORIES, SHOP_LINKS, OFFER_LINKS, categoryPath } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

const trigger =
  "flex items-center gap-1 py-3 text-sm font-medium text-display transition-colors duration-200 hover:text-terracotta";

const panel =
  "invisible absolute top-full z-50 translate-y-1 rounded-xl border border-line bg-card opacity-0 shadow-soft transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100";

function SimpleDropdown({ label, links }) {
  return (
    <div className="group relative">
      <button type="button" className={trigger}>
        {label}
        <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
      </button>
      <div className={cn(panel, "left-0 min-w-56 p-2")}>

        
        {links.map((l) => (
          <Link
            key={l.label}
            to={l.to}
            className="block rounded-lg px-3 py-2 text-sm text-body hover:bg-stage hover:text-terracotta"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function DesktopNav() {
  return (
    <nav className="relative mx-auto hidden max-w-7xl items-center gap-8 px-6 lg:flex">
      <NavLink
        to={ROUTES.HOME}
        end
        className={({ isActive }) =>
          cn(trigger, isActive && "text-terracotta")
        }
      >
        Homess
      </NavLink>

      <SimpleDropdown label="Shop" links={SHOP_LINKS} />

      {/* Mega menu: panel relative nav-ku full width */}
      <div className="group">
        <button type="button" className={trigger}>
          Categories
          <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
        </button>
        <div className={cn(panel, "left-0 right-0 p-6")}>
          <div className="grid grid-cols-7 gap-6">
            {CATEGORIES.map((cat) => (
              <div key={cat.slug}>
                <Link
                  to={categoryPath(cat.slug)}
                  className="font-heading text-base font-semibold text-display hover:text-terracotta"
                >
                  {cat.name}
                </Link>
                <ul className="mt-3 space-y-2">
                  {cat.items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        to={categoryPath(cat.slug, item.slug)}
                        className="text-sm text-body hover:text-terracotta"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SimpleDropdown label="Offers & Deals" links={OFFER_LINKS} />
    </nav>
  );
}