import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import CartItem from "@/components/cart/CartItem";       // un folder path-ku match pannunga
import CartSummary from "@/components/cart/CartSummary";
import useCart, { useUpdateQuantity, useRemoveItem, useClearCart } from "@/hooks/useCart";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, count, totalAmount, isLoading } = useCart();

  const update = useUpdateQuantity();
  const remove = useRemoveItem();
  const clear = useClearCart();
  const busy = update.isPending || remove.isPending || clear.isPending;

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Log in to view your cart"
          action={
            <Link to={ROUTES.LOGIN} state={{ from: { pathname: ROUTES.CART } }}>
              <Button>Log in</Button>
            </Link>
          }
        />
      </div>
    );
  }

  if (isLoading) {
    return <div className="py-20 text-center font-body text-muted">Loading your cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          action={
            <Link to={ROUTES.PRODUCTS}>
              <Button variant="outline">Continue shopping</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const hasUnavailable = items.some((i) => !i.available);

  return (
    <div className="bg-canvas">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl font-semibold text-display">
            Your cart <span className="text-lg text-muted">({count})</span>
          </h1>
          <button
            type="button"
            onClick={() => clear.mutate()}
            disabled={busy}
            className="font-body text-sm text-muted underline-offset-4 hover:text-error hover:underline disabled:opacity-40"
          >
            Clear cart
          </button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
          <ul className="space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.product._id}
                item={item}
                busy={busy}
                onUpdate={(payload) => update.mutate(payload)}
                onRemove={(productId) => remove.mutate(productId)}
              />
            ))}
          </ul>

          <CartSummary
            count={count}
            totalAmount={totalAmount}
            disabled={busy || hasUnavailable}
            onCheckout={() => navigate(ROUTES.CHECKOUT)}
          />
        </div>

        {hasUnavailable && (
          <p className="mt-4 font-body text-sm text-error">
            Some items are unavailable. Remove them to continue.
          </p>
        )}
      </div>
    </div>
  );
}