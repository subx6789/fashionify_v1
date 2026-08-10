import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Calendar, MapPin, Phone } from 'lucide-react';
import api from '../services/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyOrders = async () => {
      setLoading(true);
      setError('');
      try {
        // TODO: Call GET /api/orders/my
        const res = await api.get('/orders/my');
        setOrders(res.data || []);
      } catch (err) {
        // TODO: Handle error
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PLACED':
        return <Badge variant="placed">PLACED</Badge>;
      case 'SHIPPED':
        return <Badge variant="shipped">SHIPPED</Badge>;
      case 'DELIVERED':
        return <Badge variant="delivered">DELIVERED</Badge>;
      case 'CANCELLED':
        return <Badge variant="cancelled">CANCELLED</Badge>;
      default:
        return <Badge variant="outline">{status || 'PENDING'}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-4">
        <Skeleton className="h-8 w-48 mb-6" />
        {[1, 2].map((n) => (
          <Skeleton key={n} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (orders.length === 0 && !loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
          <Package className="h-10 w-10 text-neutral-400" />
        </div>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-neutral-900">You haven't placed any orders yet</h2>
        <p className="mt-2 text-sm text-neutral-500">Explore our catalog and place your first order.</p>
        <div className="mt-6">
          <Link to="/">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-8">My Orders</h1>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="border-neutral-200 overflow-hidden">
            <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6">
              <div>
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base">Order #{order.id}</CardTitle>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex items-center gap-4 text-xs text-neutral-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-500 block">Total Amount</span>
                <span className="text-lg font-bold text-neutral-900">
                  ${order.totalAmount != null ? order.totalAmount.toFixed(2) : '0.00'}
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-600 bg-neutral-50 p-3 rounded-md">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-neutral-400 mt-0.5" />
                  <span><strong>Address:</strong> {order.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-neutral-400" />
                  <span><strong>Phone:</strong> {order.phone}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="divide-y divide-neutral-100">
                {order.items?.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded bg-neutral-100 overflow-hidden shrink-0">
                        {item.product?.imageUrl ? (
                          <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-neutral-400">No img</div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{item.product?.name || 'Product'}</p>
                        <p className="text-xs text-neutral-500">Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-neutral-900">
                      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
