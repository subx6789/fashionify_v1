import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Calendar, User as UserIcon } from 'lucide-react';
import api from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // TODO: Call GET /api/orders
      const res = await api.get('/orders');
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // TODO: Call PUT /api/orders/{id}/status with { status: newStatus }
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#111111] sm:text-3xl uppercase font-['Plus_Jakarta_Sans']">
            Orders
          </h1>
          <p className="text-sm text-[#707070] mt-1">Manage customer orders.</p>
        </div>

        <div className="rounded-md border border-neutral-200 bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-neutral-50/80">
              <TableRow className="border-b border-neutral-200">
                <TableHead className="w-20 font-bold text-xs text-[#111111] uppercase tracking-wider py-3.5">Order ID</TableHead>
                <TableHead className="font-bold text-xs text-[#111111] uppercase tracking-wider py-3.5">Customer & Shipping</TableHead>
                <TableHead className="font-bold text-xs text-[#111111] uppercase tracking-wider py-3.5">Items Ordered</TableHead>
                <TableHead className="font-bold text-xs text-[#111111] uppercase tracking-wider py-3.5">Total</TableHead>
                <TableHead className="font-bold text-xs text-[#111111] uppercase tracking-wider py-3.5">Status</TableHead>
                <TableHead className="font-bold text-xs text-[#111111] uppercase tracking-wider py-3.5">Date</TableHead>
                <TableHead className="font-bold text-xs text-[#111111] uppercase tracking-wider py-3.5 text-right">Update Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-[#707070]">
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-[#707070]">
                    No customer orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-neutral-50/50 transition-colors border-b border-neutral-100 last:border-0">
                    <TableCell className="font-bold text-xs sm:text-sm text-neutral-900 align-top py-4">
                      #{order.id}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm max-w-55 align-top py-4">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5 font-bold text-neutral-900 truncate" title={order.userName || order.userEmail}>
                          <UserIcon className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                          <span className="truncate">{order.userName || order.userEmail || `User #${order.userId}`}</span>
                        </div>
                        {order.userEmail && (
                          <p className="text-[11px] text-neutral-500 truncate" title={order.userEmail}>{order.userEmail}</p>
                        )}
                        {order.phone && (
                          <p className="text-[11px] text-neutral-600 font-medium pt-0.5">📞 {order.phone}</p>
                        )}
                        {order.address && (
                          <p className="text-[11px] text-neutral-500 leading-snug pt-0.5 wrap-break-word max-w-50" title={order.address}>
                            📍 {order.address}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs max-w-70 min-w-55 align-top py-4">
                      <div className="max-h-48 overflow-y-auto pr-1 space-y-2">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-2.5 bg-neutral-50/70 p-1.5 rounded-md border border-neutral-100 min-w-0">
                              {item.productImageUrl ? (
                                <img
                                  src={item.productImageUrl}
                                  alt={item.productName}
                                  className="h-10 w-10 object-cover rounded-md bg-neutral-200 shrink-0 border border-neutral-200"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[9px] text-neutral-400 shrink-0">
                                  No Img
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-neutral-900 text-[12px] truncate" title={item.productName}>
                                  {item.productName || `Product #${item.productId}`}
                                </p>
                                <p className="text-[11px] text-neutral-500">
                                  Qty: {item.quantity} × <span className="font-semibold text-neutral-700">₹{item.price?.toFixed(2)}</span>
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className="text-neutral-400 italic">No item details</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-black text-sm sm:text-base text-neutral-900 align-top py-4">
                      ₹{order.totalAmount != null ? order.totalAmount.toFixed(2) : '0.00'}
                    </TableCell>
                    <TableCell className="align-top py-4">
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell className="align-top py-4">
                      <div className="flex items-center gap-1 text-xs text-[#707070]">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right align-top py-4">
                      <Select
                        value={order.status || 'PLACED'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="w-36 ml-auto text-xs font-semibold"
                      >
                        <option value="PLACED">PLACED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
