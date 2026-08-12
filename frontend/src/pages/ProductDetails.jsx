import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import api from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError('Failed to fetch product details.',err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (product) {
      addToCart(product);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Skeleton className="aspect-3/4 w-full rounded-none" />
          <div className="space-y-4 pt-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-[20px] font-bold text-[#111111]">{error || 'Product not found'}</h2>
        <Link to="/" className="mt-6 inline-block">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> BACK TO COLLECTION
          </Button>
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0 || product.stock === null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/" className="mb-8 inline-flex items-center text-[13px] font-semibold tracking-wider text-[#707070] hover:text-[#111111] uppercase">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Collection
      </Link>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-16">
        {/* Large Editorial Image */}
        <div className="overflow-hidden bg-neutral-100 aspect-3/4">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[14px] text-[#707070] uppercase">
              No Image Available
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-between py-2">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-[28px] sm:text-[36px] font-extrabold tracking-tight text-[#111111] uppercase leading-tight font-['Plus_Jakarta_Sans']">
                {product.name}
              </h1>
            </div>

            <div className="mt-3 flex items-center gap-4">
              <span className="text-[20px] sm:text-[24px] font-bold text-[#111111]">
                ₹{product.price != null ? product.price.toFixed(2) : '0.00'}
              </span>
              {isOutOfStock ? (
                <Badge variant="destructive">OUT OF STOCK</Badge>
              ) : (
                <span className="text-[12px] font-semibold text-emerald-700 tracking-wider uppercase">
                  IN STOCK ({product.stock})
                </span>
              )}
            </div>

            <div className="mt-8 border-t border-neutral-200 pt-6">
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#111111]">Description</h3>
              <p className="mt-3 text-[15px] text-[#707070] leading-relaxed">
                {product.description || 'Minimalist fashion piece crafted with premium detailing for modern everyday wear.'}
              </p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-neutral-100">
            <Button
              size="lg"
              className="w-full gap-2 text-[14px] h-12"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4" /> ADD TO CART
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;