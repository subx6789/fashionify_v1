import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import api from '../services/api';

const Checkout = () => {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { cart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedAddress = address.trim();
    const trimmedPhone = phone.trim();
    const cleanPhone = trimmedPhone.replace(/[^0-9]/g, '');

    if (!trimmedAddress) {
      setError('Please enter a delivery address.');
      return;
    }

    if (cleanPhone.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    setLoading(true);

    // Prepare payload matching backend OrderRequest:
    // { address, phone, items: [{ productId, quantity }] }
    const orderItems = [];
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      if (item.product) {
        orderItems.push({
          productId: item.product.id,
          quantity: item.quantity,
        });
      }
    }

    const orderRequest = {
      address: trimmedAddress,
      phone: cleanPhone,
      items: orderItems,
    };

    try {
      await api.post('/orders', orderRequest);
      clearCart();
      navigate('/my-orders');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Delivery Information */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-neutral-200">
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="rounded-md bg-red-50 p-3 text-xs font-medium text-red-600">
                    {error}
                  </div>
                )}
                {user?.name && (
                  <div className="space-y-1">
                    <Label>Customer Name</Label>
                    <Input value={user.name} disabled className="bg-neutral-50" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Input
                    id="address"
                    placeholder="Street Address, City, State, Pincode"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit phone number"
                    value={phone}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                      setPhone(numericValue);
                    }}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <Card className="border-neutral-200">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="divide-y divide-neutral-100 max-h-60 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={item.product?.id || index} className="py-2 flex justify-between text-sm">
                      <div>
                        <span className="font-medium text-neutral-900">{item.product?.name}</span>
                        <span className="text-neutral-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-semibold text-neutral-900">
                        ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between font-bold text-base text-neutral-900">
                    <span>Total Amount</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-neutral-500">Total amount will be verified and calculated by the backend.</p>
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" size="lg" className="w-full" disabled={loading || cart.length === 0}>
                  {loading ? 'Placing Order...' : 'Place Order'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;