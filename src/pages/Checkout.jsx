import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { MapPin, Tag, X } from "lucide-react";
import Button from "@/components/common/Button";
import useCart from "@/hooks/useCart";
import { useAddresses } from "@/hooks/useAddress.js";
import { usePlaceOrder, useValidateCoupon } from "@/hooks/useOrders";
import { ROUTES } from "@/constants/routes";
import { formatPrice } from "@/utils/productHelpers";
import { notify } from "@/utils/toast";
import { cn } from "@/utils/cn";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, count, totalAmount, isLoading: cartLoading } = useCart();
  const { data: addresses = [], isLoading: addrLoading } = useAddresses();
  const placeOrder = usePlaceOrder();
  const validate = useValidateCoupon();

  const [addressId, setAddressId] = useState(null);
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null); // { code, discount }

  // default address-a auto select
  useEffect(() => {
    if (addressId || !addresses.length) return;
    const def = addresses.find((a) => a.isDefault) ?? addresses[0];
    setAddressId(def._id);
  }, [addresses, addressId]);

  if (cartLoading || addrLoading) {
    return <div className="py-20 text-center font-body text-muted">Loading checkout...</div>;
  }

  if (items.length === 0) return <Navigate to={ROUTES.CART} replace />;

  const discount = coupon?.discount ?? 0;
  const payable = Math.max(0, totalAmount - discount);
  const hasUnavailable = items.some((i) => !i.available);

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    validate.mutate(
      { code, cartTotal: totalAmount }, // CHECK: field names
      {
        onSuccess: (data) => {
          // CHECK: backend response la discount epdi varudhu
          const amount = data?.discount ?? data?.discountAmount ?? 0;
          setCoupon({ code, discount: amount });
          notify.success("Coupon applied");
        },
      }
    );
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponInput("");
  };

  const handlePlaceOrder = () => {
    if (!addressId) return notify.error("Please select a delivery address.");
    if (hasUnavailable) return notify.error("Remove unavailable items from your cart.");

    placeOrder.mutate(
      {
        addressId, // CHECK: field names
        paymentMethod: "cod",
        ...(coupon && { couponCode: coupon.code }),
      },
      {
        onSuccess: (order) => {
          notify.success("Order placed successfully");
          navigate(ROUTES.ORDER_SUCCESS, { state: { order }, replace: true });
        },
      }
    );
  };

  const busy = placeOrder.isPending;

  return (
    <div className="bg-canvas">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="font-heading text-3xl font-semibold text-display">Checkout</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem]">
          <div className="space-y-8">
            {/* Address */}
            <section aria-labelledby="addr-heading">
              <div className="flex items-center justify-between">
                <h2 id="addr-heading" className="font-heading text-xl font-semibold text-display">
                  Delivery address
                </h2>
                <Link
                  to={ROUTES.PROFILE_ADDRESSES}
                  className="font-body text-sm text-terracotta hover:underline"
                >
                  {addresses.length ? "Manage" : "Add address"}
                </Link>
              </div>

              {addresses.length === 0 ? (
                <p className="mt-4 rounded-2xl border border-dashed border-line-card p-6 font-body text-sm text-muted">
                  You haven't added an address yet. Add one to place your order.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {addresses.map((a) => {
                    const selected = a._id === addressId;
                    return (
                      <li key={a._id}>
                        <label
                          className={cn(
                            "flex cursor-pointer gap-3 rounded-2xl border bg-card p-4 transition-colors",
                            selected ? "border-terracotta ring-2 ring-terracotta/20" : "border-line-card"
                          )}
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={selected}
                            onChange={() => setAddressId(a._id)}
                            className="mt-1"
                          />
                          <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                          <div className="font-body text-sm text-display">
                            <p className="font-medium">
                              {a.name ?? a.fullName}{" "}
                              {a.phone && <span className="text-muted">· {a.phone}</span>}
                            </p>
                            {/* CHECK: un address field names */}
                            <p className="mt-1 text-muted">
                              {[a.addressLine1 ?? a.line1 ?? a.street, a.city, a.state, a.pincode]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          </div>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {/* Payment */}
            <section aria-labelledby="pay-heading">
              <h2 id="pay-heading" className="font-heading text-xl font-semibold text-display">
                Payment
              </h2>
              <label className="mt-4 flex items-center gap-3 rounded-2xl border border-terracotta bg-card p-4 ring-2 ring-terracotta/20">
                <input type="radio" checked readOnly />
                <span className="font-body text-sm text-display">Cash on delivery</span>
              </label>
            </section>

            {/* Items */}
            <section aria-labelledby="items-heading">
              <h2 id="items-heading" className="font-heading text-xl font-semibold text-display">
                Items ({count})
              </h2>
              <ul className="mt-4 divide-y divide-line-card rounded-2xl border border-line-card bg-card">
                {items.map((item) => (
                  <li
                    key={item.product._id}
                    className="flex items-center justify-between gap-4 p-4 font-body text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-display">{item.product.name}</p>
                      <p className="text-muted">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-display">{formatPrice(item.subtotal)}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-2xl border border-line-card bg-cream-soft/95 p-6 lg:sticky lg:top-28">
            <h2 className="font-heading text-xl font-semibold text-display">Order summary</h2>

            {/* Coupon */}
            <div className="mt-5">
              {coupon ? (
                <div className="flex items-center justify-between rounded-xl border border-success/30 bg-success/5 px-3 py-2 font-body text-sm text-success">
                  <span className="flex items-center gap-2">
                    <Tag aria-hidden="true" className="h-4 w-4" />
                    {coupon.code} applied
                  </span>
                  <button type="button" aria-label="Remove coupon" onClick={removeCoupon}>
                    <X aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code"
                    aria-label="Coupon code"
                    className="h-11 min-w-0 flex-1 rounded-xl border border-line-card bg-card px-3 font-body text-sm uppercase outline-none focus:border-terracotta"
                  />
                  <Button
                    variant="outline"
                    onClick={applyCoupon}
                    disabled={validate.isPending || !couponInput.trim()}
                    className="px-4"
                  >
                    {validate.isPending ? "..." : "Apply"}
                  </Button>
                </div>
              )}
            </div>

            <dl className="mt-5 space-y-3 font-body text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="text-display">{formatPrice(totalAmount)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <dt>Coupon discount</dt>
                  <dd>-{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-line-card pt-3 text-base font-semibold">
                <dt className="text-display">Total</dt>
                <dd className="text-display">{formatPrice(payable)}</dd>
              </div>
            </dl>

            <Button
              onClick={handlePlaceOrder}
              disabled={busy || !addresses.length || hasUnavailable}
              className="mt-6 w-full py-3 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Placing order..." : "Place order"}
            </Button>
          </aside>
        </div>
      </div>
    </div>
  );
}