import Button from "@/components/common/Button";
import { formatPrice } from "@/utils/productHelpers";

export default function CartSummary({ count, totalAmount, onCheckout, disabled }) {
  return (
    <aside className="h-fit rounded-2xl border border-line-card bg-cream-soft/95 p-6 lg:sticky lg:top-28">
      <h2 className="font-heading text-xl font-semibold text-display">Order summary</h2>

      <dl className="mt-5 space-y-3 font-body text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Items</dt>
          <dd className="text-display">{count}</dd>
        </div>
        <div className="flex justify-between border-t border-line-card pt-3 text-base font-semibold">
          <dt className="text-display">Total</dt>
          <dd className="text-display">{formatPrice(totalAmount)}</dd>
        </div>
      </dl>
      <p className="mt-1 font-body text-xs text-muted">Inclusive of all taxes</p>

      <Button onClick={onCheckout} disabled={disabled} className="mt-6 w-full py-3">
        Proceed to checkout
      </Button>
    </aside>
  );
}