import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
          <ShoppingBag className="h-10 w-10 text-neutral-400" />
        </div>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-neutral-900">Your cart is empty</h2>
        <p className="mt-2 text-sm text-neutral-500">Looks like you haven't added anything to your cart yet.</p>
        <div className="mt-6">
          <Link to="/">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Shopping Cart</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item, index) => {
            const product = item.product || {};
            const quantity = item.quantity || 1;
            const itemPrice = product.price || 0;

            return (
              <Card key={product.id || index} className="overflow-hidden border-neutral-200">
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-neutral-100 border border-neutral-200">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-neutral-400">No Img</div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">{product.name || 'Product'}</h3>
                      <p className="text-sm font-bold text-neutral-900 mt-1">₹{itemPrice.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-neutral-300 rounded-md">
                      <button
                        className="px-2 py-1 hover:bg-neutral-100 transition-colors"
                        onClick={() => decreaseQuantity(product.id)}
                      >
                        <Minus className="h-3.5 w-3.5 text-neutral-600" />
                      </button>
                      <span className="px-3 py-1 text-sm font-medium">{quantity}</span>
                      <button
                        className="px-2 py-1 hover:bg-neutral-100 transition-colors"
                        onClick={() => increaseQuantity(product.id)}
                      >
                        <Plus className="h-3.5 w-3.5 text-neutral-600" />
                      </button>
                    </div>

                    <span className="font-bold text-neutral-900 min-w-17.5 text-right">
                      ₹{(itemPrice * quantity).toFixed(2)}
                    </span>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-neutral-400 hover:text-red-600"
                      onClick={() => removeFromCart(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <Card className="border-neutral-200 p-6">
            <h2 className="text-lg font-bold text-neutral-900">Order Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="text-green-500 font-bold">FREE</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-bold text-neutral-900 pt-2">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <Button size="lg" className="w-full mt-6 gap-2" onClick={() => navigate('/checkout')}>
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
