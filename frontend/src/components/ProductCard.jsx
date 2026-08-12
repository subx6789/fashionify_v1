import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOutOfStock = product?.stock === 0 || product?.stock === null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  return (
    <div className="group relative flex flex-col">
      {/* Editorial Large Aspect Image */}
      <Link to={`/product/${product?.id}`} className="block overflow-hidden bg-neutral-100 aspect-3/4 relative">
        {product?.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[#707070] uppercase font-medium tracking-widest">
            No Image
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute top-3 left-3 bg-[#111111] px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
            Sold Out
          </div>
        )}

        {/* Quick Add Overlay on Hover */}
        {!isOutOfStock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-0 inset-x-0 bg-[#111111] text-white py-3 text-[13px] font-semibold uppercase tracking-wider opacity-0 transition-opacity duration-200 group-hover:opacity-100 hidden md:flex items-center justify-center gap-1"
          >
            <Plus className="h-4 w-4" /> Quick Add
          </button>
        )}
      </Link>

      {/* Product Information */}
      <div className="mt-3 flex flex-col flex-1 justify-between">
        <div>
          <Link to={`/product/${product?.id}`} className="block">
            <h3 className="text-[13px] sm:text-[14px] font-medium text-[#111111] hover:underline leading-snug truncate">
              {product?.name || 'Unnamed Product'}
            </h3>
          </Link>
          <p className="mt-0.5 text-[12px] text-[#707070] line-clamp-1">
            {product?.description}
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-[14px] sm:text-[15px] font-semibold text-[#111111]">
            ₹{product?.price != null ? product.price.toFixed(2) : '0.00'}
          </span>
          <button
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="md:hidden text-[12px] font-semibold text-[#111111] underline uppercase tracking-wider"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
