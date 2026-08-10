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

        <div className="rounded-none border border-neutral-200 bg-white overflow-hidden shadow-none">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Update Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-[#707070]">
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-[#707070]">
                    No customer orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-semibold text-xs sm:text-sm">#{order.id}</TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5">
                        <UserIcon className="h-4 w-4 text-neutral-400" />
                        <span>{order.user?.name || order.user?.email || 'Customer'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-xs sm:text-sm">
                      ${order.totalAmount != null ? order.totalAmount.toFixed(2) : '0.00'}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-[#707070]">
                        <Calendar className="h-3.5 w-3.5" />
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={order.status || 'PLACED'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="w-35 ml-auto text-xs"
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
