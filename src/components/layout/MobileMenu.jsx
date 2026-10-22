import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";
import {
  CATEGORIES,
  SHOP_LINKS,
  OFFER_LINKS,
  INFO_LINKS,
  categoryPath,
} from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

function Accordion({ label, children, nested }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={nested ? "" : "border-b border-line"}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center justify-between py-3 text-left font-medium text-display",
          nested ? "text-sm" : "text-base"
        )}
      >
        {label}
        <ChevronDown size={16} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="pb-2 pl-3">{children}</div>}
    </div>
  );
}

export default function MobileMenu({ open, onClose }) {
  const link = "block py-2 text-sm text-body hover:text-terracotta";

  return (
    <div className={cn("fixed inset-0 z-50 lg:hidden", !open && "pointer-events-none")}>
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-display/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
      />
      <aside
        className={cn(
          "absolute left-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto bg-canvas p-4 shadow-soft transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="font-heading text-2xl font-semibold text-display">SHILOH</span>
          <button aria-label="Close menu" onClick={onClose} className="p-2 text-display">
            <X size={22} />
          </button>
        </div>

        <Link to={ROUTES.HOME} onClick={onClose} className="block border-b border-line py-3 font-medium text-display">
          Home
        </Link>

        <Accordion label="Shop">
          {SHOP_LINKS.map((l) => (
            <Link key={l.label} to={l.to} onClick={onClose} className={link}>
              {l.label}
            </Link>
          ))}
        </Accordion>

        <Accordion label="Categories">
          {CATEGORIES.map((cat) => (
            <Accordion key={cat.slug} label={cat.name} nested>
              <Link to={categoryPath(cat.slug)} onClick={onClose} className={cn(link, "font-medium")}>
                View all {cat.name}
              </Link>
              {cat.items.map((i) => (
                <Link
                  key={i.slug}
                  to={categoryPath(cat.slug, i.slug)}
                  onClick={onClose}
                  className={link}
                >
                  {i.name}
                </Link>
              ))}
            </Accordion>
          ))}
        </Accordion>

        <Accordion label="Offers & Deals">
          {OFFER_LINKS.map((l) => (
            <Link key={l.label} to={l.to} onClick={onClose} className={link}>
              {l.label}
            </Link>
          ))}
        </Accordion>

        <Accordion label="Help & Support">
          {INFO_LINKS.map((l) => (
            <Link key={l.label} to={l.to} onClick={onClose} className={link}>
              {l.label}
            </Link>
          ))}
        </Accordion>

        <div className="mt-4 flex gap-3">
          <Link to={ROUTES.LOGIN} onClick={onClose} className="flex-1 rounded-full bg-pill py-2 text-center text-sm text-inverse">
            Login
          </Link>
          <Link to={ROUTES.REGISTER} onClick={onClose} className="flex-1 rounded-full border border-line-card py-2 text-center text-sm text-display">
            Register
          </Link>
        </div>
      </aside>
    </div>
  );
}