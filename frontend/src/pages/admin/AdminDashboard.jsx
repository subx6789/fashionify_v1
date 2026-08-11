import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Package, ShoppingBag, Clock, CheckCircle2, Plus, ArrowRight, Calendar } from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [productsCount, setProductsCount] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // TODO: Call GET /api/products and GET /api/orders
        const [productsRes, ordersRes] = await Promise.allSettled([
          api.get('/products'),
          api.get('/orders'),
        ]);

        if (productsRes.status === 'fulfilled' && productsRes.value?.data) {
          setProductsCount(productsRes.value.data.length);
        }
        if (ordersRes.status === 'fulfilled' && ordersRes.value?.data) {
          setOrders(ordersRes.value.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard statistics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Derived statistics from GET /api/orders
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'PLACED' || o.status === 'SHIPPED').length;
  const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED').length;
  const recentOrders = orders.slice(0, 5);

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
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#111111] sm:text-3xl uppercase font-['Plus_Jakarta_Sans']">
            Dashboard
          </h1>
          <p className="text-sm text-[#707070] mt-1">Welcome to the Fashionify admin panel.</p>
        </div>

        {/* Statistic Cards Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-neutral-200 shadow-none bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#707070]">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-[#111111]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-[#111111]">
                {loading ? '—' : productsCount !== null ? productsCount : '—'}
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 shadow-none bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#707070]">
                Total Orders
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-[#111111]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-[#111111]">
                {loading ? '—' : totalOrders}
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 shadow-none bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#707070]">
                Pending Orders
              </CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-[#111111]">
                {loading ? '—' : pendingOrders}
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 shadow-none bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#707070]">
                Delivered Orders
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-[#111111]">
                {loading ? '—' : deliveredOrders}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/products">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            </Link>
            <Link to="/admin/orders">
              <Button size="sm" variant="outline" className="gap-2">
                <ShoppingBag className="h-4 w-4" /> View Orders
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold uppercase tracking-wider text-[#111111] font-['Plus_Jakarta_Sans']">
              Recent Orders
            </h2>
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-[#707070] hover:text-[#111111]">
                View All Orders <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="rounded-none border border-neutral-200 bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-[#707070] text-xs">
                      Loading recent orders...
                    </TableCell>
                  </TableRow>
                ) : recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-[#707070] text-xs">
                      No orders yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-semibold text-xs">#{order.id}</TableCell>
                      <TableCell className="text-xs">
                        {order.user?.name || order.user?.email || 'Customer'}
                      </TableCell>
                      <TableCell className="text-xs font-bold">
                        ₹{order.totalAmount != null ? order.totalAmount.toFixed(2) : '0.00'}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
