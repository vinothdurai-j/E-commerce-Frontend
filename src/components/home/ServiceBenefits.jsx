import {
  FreeShippingIcon,
  QualityIcon,
  SecurePaymentIcon,
  SupportIcon,
} from "./ServiceIcons";

const BENEFITS = [
  { title: "Free Shipping", description: "Shipping's on us — always", icon: FreeShippingIcon },
  { title: "Quality Assured", description: "Quality is our priority", icon: QualityIcon },
  { title: "Secure Payment", description: "Payment security at its finest", icon: SecurePaymentIcon },
  { title: "24/7 Support", description: "Always here for you, 24/7", icon: SupportIcon },
];

export default function ServiceBenefits({ className = "" }) {
  return (
    <section aria-label="Our service benefits" className={className}>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {BENEFITS.map(({ title, description, icon: Icon }) => (
          <li
            key={title}
            className="group flex items-center gap-4 rounded-xl bg-linear-to-br from-cream to-cream-soft px-5 py-4 transition duration-300 hover:-translate-y-0.5 hover:from-stage hover:to-cream"
          >
            <Icon className="h-12 w-12 shrink-0 text-clay transition-colors duration-300 group-hover:text-terracotta" />
            <div className="min-w-0">
              <h3 className="truncate font-body text-base font-medium text-clay transition-colors duration-300 group-hover:text-terracotta">
                {title}
              </h3>
              <p className="mt-0.5 text-sm leading-snug text-muted">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}