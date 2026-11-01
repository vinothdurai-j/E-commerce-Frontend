import { Link, useLocation, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Button from "@/components/common/Button";
import { useOrder, normalizeOrder } from "@/hooks/useOrders";
import { ROUTES } from "@/constants/routes";
import { formatPrice } from "@/utils/productHelpers";

export default function OrderSuccess() {
  const { id } = useParams(); // route la :id irundha mattum
  const { state } = useLocation();

  const fromState = state?.order ? normalizeOrder(state.order) : null;
  const { data: fetched } = useOrder(id, { enabled: !fromState });
  const order = fromState ?? fetched ?? null;

  const label = order
    ? order.orderNumber ?? `#${String(order._id ?? "").slice(-8).toUpperCase()}`
    : null;
  const total = order?.totalAmount ?? order?.total;

  return (
    <div className="bg-canvas">
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:py-24">
        <CheckCircle2 aria-hidden="true" className="mx-auto h-16 w-16 text-success" />

        <h1 className="mt-6 font-heading text-3xl font-semibold text-display">
          Thank you for your order!
        </h1>
        <p className="mt-3 font-body text-muted">
          Your order has been placed successfully. We’ll let you know once it ships.
        </p>

        {order && (
          <dl className="mx-auto mt-8 max-w-sm space-y-3 rounded-2xl border border-line-card bg-card p-5 text-left font-body text-sm">
            {label && (
              <div className="flex justify-between">
                <dt className="text-muted">Order</dt>
                <dd className="font-medium text-display">{label}</dd>
              </div>
            )}
            {order.items?.length > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted">Items</dt>
                <dd className="text-display">{order.items.length}</dd>
              </div>
            )}
            {total != null && (
              <div className="flex justify-between border-t border-line-card pt-3 font-semibold">
                <dt className="text-display">Total</dt>
                <dd className="text-display">{formatPrice(total)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Payment</dt>
              <dd className="text-display">Cash on delivery</dd>
            </div>
          </dl>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to={ROUTES.ORDERS}>
            <Button className="px-8 py-3">View my orders</Button>
          </Link>
          <Link to={ROUTES.PRODUCTS}>
            <Button variant="outline" className="px-8 py-3">Continue shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}