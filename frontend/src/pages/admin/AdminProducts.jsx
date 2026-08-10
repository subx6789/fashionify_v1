import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import api from '../../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Form fields matching ProductRequest exactly: name, description, price, imageUrl, stock
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    stock: '',
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // TODO: Call GET /api/products
      const res = await api.get('/products');
      setProducts(res.data || []);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAddDialog = () => {
    setSelectedProductId(null);
    setFormData({ name: '', description: '', price: '', imageUrl: '', stock: '' });
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (product) => {
    setSelectedProductId(product.id);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price ?? '',
      imageUrl: product.imageUrl || '',
      stock: product.stock ?? '',
    });
    setDialogOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0.0,
      imageUrl: formData.imageUrl,
      stock: parseInt(formData.stock, 10) || 0,
    };

    try {
      if (selectedProductId) {
        // TODO: Call PUT /api/products/{id} with payload
        await api.put(`/products/${selectedProductId}`, payload);
      } else {
        // TODO: Call POST /api/products with payload
        await api.post('/products', payload);
      }
      setDialogOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Failed to save product', err);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProductId) return;
    try {
      // TODO: Call DELETE /api/products/{id}
      await api.delete(`/products/${selectedProductId}`);
      setDeleteDialogOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#111111] sm:text-3xl uppercase font-['Plus_Jakarta_Sans']">
              Products
            </h1>
            <p className="text-sm text-[#707070] mt-1">Manage your Fashionify products.</p>
          </div>
          <Button onClick={handleOpenAddDialog} className="gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>

        {/* Products Table */}
        <div className="rounded-none border border-neutral-200 bg-white overflow-hidden shadow-none">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-[#707070]">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-[#707070]">
                    No products found. Click "Add Product" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="h-10 w-10 bg-neutral-100 overflow-hidden border border-neutral-200 shrink-0">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-5 w-5 m-2 text-neutral-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-xs sm:text-sm">{product.name}</TableCell>
                    <TableCell className="text-xs sm:text-sm font-semibold">${product.price?.toFixed(2)}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{product.stock}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenEditDialog(product)}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedProductId(product.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add / Edit Product Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>{selectedProductId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {selectedProductId ? 'Update product details below.' : 'Fill in the product details below.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProduct} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Product</Button>
            </DialogFooter>
          </form>
        </Dialog>

        {/* Delete Confirmation Alert Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This product will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
