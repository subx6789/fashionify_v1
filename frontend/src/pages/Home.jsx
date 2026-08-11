import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import api from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/products');
        setProducts(res.data || []);
      } catch (err) {
        setError('Failed to load products',err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen pb-20">
      {/* Clean White Minimalist Hero Section */}
      <section className="bg-white border-b border-neutral-100 py-16 sm:py-24 flex items-center justify-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-[12px] font-bold tracking-[0.25em] uppercase text-[#707070] mb-3">
            SPRING / SUMMER 2026
          </span>
          <h1 className="text-[32px] sm:text-[48px] md:text-[56px] font-extrabold tracking-tight leading-[1.1] uppercase text-[#111111] font-['Plus_Jakarta_Sans']">
            STYLE THAT MOVES WITH YOU.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[14px] sm:text-[16px] text-[#707070] font-normal leading-relaxed">
            Minimalist essentials refined for the modern wardrobe. Editorial tailoring meets everyday ease.
          </p>
          <div className="mt-8">
            <a href="#collection">
              <Button size="lg" className="bg-[#111111] text-white hover:bg-neutral-800 gap-2 font-bold tracking-wider">
                EXPLORE COLLECTION <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Collection Grid Section */}
      <section id="collection" className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-neutral-200 pb-4">
          <div>
            <h2 className="text-[22px] sm:text-[28px] font-bold tracking-tight text-[#111111] uppercase font-['Plus_Jakarta_Sans']">
              LATEST COLLECTION
            </h2>
            <p className="text-[14px] text-[#707070] mt-0.5">Curated pieces for effortless styling.</p>
          </div>
          <span className="text-[13px] font-semibold text-[#707070] hidden sm:block">
            {products.length} ITEMS
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex flex-col space-y-3">
                <Skeleton className="aspect-3/4 w-full rounded-none" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mt-10 p-8 text-center border border-neutral-200">
            <p className="text-[15px] text-[#E53935]">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              RETRY
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="mt-16 flex flex-col items-center justify-center p-16 text-center border border-dashed border-neutral-200">
            <ShoppingBag className="h-10 w-10 text-[#707070]" />
            <h3 className="mt-4 text-[16px] font-bold uppercase text-[#111111]">No items available</h3>
            <p className="mt-1 text-[14px] text-[#707070]">Check back soon for our next drop.</p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 sm:gap-x-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;