import { Link } from "react-router-dom";
import { PackageSearch, TriangleAlert } from "lucide-react";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import { useMyOrders, useCancelOrder } from "@/hooks/useOrders";
import { ROUTES } from "@/constants/routes";
import { formatPrice } from "@/utils/productHelpers";
import { notify } from "@/utils/toast";
import { cn } from "@/utils/cn";

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-800",
  placed: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

// Statuses where the user can still cancel the order.
// Confirmed orders are NOT cancellable by default; add "confirmed" back if your backend allows it.
const CANCELLABLE = ["pending", "placed"];

const PAYMENT_LABELS = {
  cod: "Cash on delivery",
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "";

const orderLabel = (o) => o.orderNumber ?? `#${String(o._id).slice(-8).toUpperCase()}`;

function OrdersSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-36 animate-pulse rounded-2xl bg-cream motion-reduce:animate-none" />
      ))}
    </div>
  );
}

export default function Orders() {
  const { data: orders = [], isLoading, isError, refetch } = useMyOrders();
  const cancel = useCancelOrder();

  const handleCancel = (id) => {
    notify.confirm("Are you sure you want to cancel this order?", () => {
      cancel.mutate({ id });
    });
  };

  return (
    <div className="bg-canvas">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="font-heading text-3xl font-semibold text-display">My orders</h1>

        <div className="mt-8">
          {isLoading ? (
            <OrdersSkeleton />
          ) : isError ? (
            <EmptyState
              icon={TriangleAlert}
              title="We couldn’t load your orders"
              action={<Button variant="outline" onClick={() => refetch()}>Try again</Button>}
            />
          ) : orders.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No orders yet"
              description="When you place an order, it will show up here."
              action={
                <Link to={ROUTES.PRODUCTS}>
                  <Button variant="outline">Start shopping</Button>
                </Link>
              }
            />
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => {
                // Backend sends `orderStatus`; fall back to `status` just in case.
                const status = String(order.orderStatus ?? order.status ?? "pending").toLowerCase();
                const items = order.items ?? [];
                const total = order.totalAmount ?? order.total ?? 0;
                const canCancel = CANCELLABLE.includes(status);
                const paymentMethod =
                  PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod ?? "";

                return (
                  <li key={order._id} className="rounded-2xl border border-line-card bg-card p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-body text-sm font-semibold text-display">{orderLabel(order)}</p>
                        <p className="font-body text-xs text-muted">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 font-body text-xs font-medium capitalize",
                            STATUS_STYLES[status] ?? "bg-cream text-display"
                          )}
                        >
                          {status}
                        </span>
                        {paymentMethod && (
                          <p className="font-body text-xs capitalize text-muted">
                            {paymentMethod}
                            {order.paymentStatus ? ` · Payment ${order.paymentStatus}` : ""}
                          </p>
                        )}
                      </div>
                    </div>

                    <ul className="mt-4 divide-y divide-line-card border-y border-line-card">
                      {items.map((item, idx) => {
                        const name = item.product?.name ?? item.name ?? "Product";
                        return (
                          <li
                            key={item._id ?? item.product?._id ?? item.product ?? idx}
                            className="flex justify-between gap-4 py-2.5 font-body text-sm"
                          >
                            <span className="min-w-0 truncate text-display">
                              {name} <span className="text-muted">× {item.quantity}</span>
                            </span>
                            <span className="text-display">
                              {formatPrice(item.subtotal ?? item.price * item.quantity)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="font-body text-sm text-muted">
                        Total <span className="ml-1 text-base font-semibold text-display">{formatPrice(total)}</span>
                      </p>
                      {canCancel && (
                        <Button
                          variant="outline"
                          onClick={() => handleCancel(order._id)}
                          disabled={cancel.isPending}
                          className="px-5 py-2"
                        >
                          Cancel order
                        </Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}