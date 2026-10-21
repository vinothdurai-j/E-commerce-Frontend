export default function ProductCard({ product }) {
  return (
    <div className="rounded-xl border border-line bg-card p-4 shadow-soft">
      <h3 className="font-heading text-display">{product.name}</h3>
      <p className="text-body">{product.price}</p>
    </div>
  );
}