import React, { useState, useEffect } from 'react';
import {
  Package,
  Tag,
  AlertTriangle,
  Star,
  Plus,
  Search,
  ChevronDown,
  LayoutGrid,
  List,
  Heart,
  Eye,
  Edit2,
  Trash2,
  X,
  Upload,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Sparkline } from '../components/Sparkline';
import { apiClient, MOCK_PRODUCTS } from '../services/api';

export const Products: React.FC = () => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [sortBy, setSortBy] = useState('Latest');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'electronics',
    price: 0,
    stock: 20,
    description: '',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, statusFilter, sortBy]);

  const fetchProducts = async () => {
    try {
      const res = await apiClient.get('/products', {
        params: {
          category: categoryFilter,
          status: statusFilter,
          sortBy,
          search,
        },
      });
      if (res.data?.success && res.data?.data?.products) {
        setProducts(res.data.data.products);
      }
    } catch (err) {
      // Keeps mock products
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `SE-PRD-${Math.floor(100 + Math.random() * 900)}`,
      category: 'accessories',
      price: 25000,
      stock: 30,
      description: 'High quality premium product from ShopEasy collection.',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      category: p.category.toLowerCase(),
      price: p.price || Math.round((p.discountedPriceKobo || p.priceKobo) / 100),
      stock: p.stock,
      description: p.description || '',
      images: p.images || [],
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiClient.delete(`/products/${id}`);
    } catch (e) {
      // ignore
    }
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await apiClient.put(`/products/${editingProduct._id}`, formData);
      } else {
        await apiClient.post('/products', formData);
      }
      fetchProducts();
    } catch (err) {
      // Optimistic update in mock
      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct._id ? { ...p, ...formData } : p))
        );
      } else {
        const newP = {
          _id: `prod-${Date.now()}`,
          ...formData,
          rating: 4.5,
          reviewCount: 0,
          salesCount: 0,
          isActive: true,
          isFeatured: false,
        };
        setProducts((prev: any) => [newP, ...prev]);
      }
    }
    setModalOpen(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const form = new FormData();
    form.append('image', file);
    form.append('folder', 'shopeasy/products');

    try {
      const res = await apiClient.post('/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success && res.data?.data?.url) {
        setFormData((prev) => ({
          ...prev,
          images: [res.data.data.url, ...prev.images],
        }));
      }
    } catch (err) {
      // Local preview fallback
      const objectUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        images: [objectUrl, ...prev.images],
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (categoryFilter !== 'All Categories' && p.category?.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }
    if (statusFilter === 'Active' && !p.isActive) return false;
    if (statusFilter === 'Out of Stock' && p.stock > 0) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ===================== PAGE HEADER ===================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#15152D] tracking-tight">Products</h1>
          <p className="text-xs text-[#77778D] font-medium mt-0.5">
            Manage your store products, prices and inventory.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#5135ED] hover:bg-[#3925C5] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-[#5135ED]/20 flex items-center space-x-1.5 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* ===================== 4 METRICS CARDS ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EEEAFE] text-[#5135ED] flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Total Products</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">156</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>8.3%</span>
              </p>
            </div>
          </div>
          <Sparkline color="purple" />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E7F8F0] text-[#10B981] flex items-center justify-center shrink-0">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Active Products</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">142</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>7.1%</span>
              </p>
            </div>
          </div>
          <Sparkline color="green" />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8E7] text-[#F59E0B] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Out of Stock</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">14</h3>
              <p className="text-[11px] font-bold text-[#E94B59] flex items-center mt-0.5">
                <ArrowDownRight className="w-3 h-3 mr-0.5" />
                <span>2.1%</span>
              </p>
            </div>
          </div>
          <Sparkline color="orange" />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF3FF] text-[#3B82F6] flex items-center justify-center shrink-0">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Featured Products</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">24</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>12.5%</span>
              </p>
            </div>
          </div>
          <Sparkline color="blue" />
        </div>
      </div>

      {/* ===================== FILTER & SEARCH BAR ===================== */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E7F0] shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#77778D] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F7F7FC] text-[#15152D] text-xs rounded-xl pl-10 pr-4 py-2.5 border border-[#E8E7F0] focus:outline-none focus:border-[#5135ED]"
          />
        </form>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#F7F7FC] border border-[#E8E7F0] rounded-xl px-3 py-2 text-[#15152D] font-semibold focus:outline-none"
          >
            <option>All Categories</option>
            <option>Accessories</option>
            <option>Shoes</option>
            <option>Fashion</option>
            <option>Beauty</option>
            <option>Home</option>
            <option>Electronics</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F7F7FC] border border-[#E8E7F0] rounded-xl px-3 py-2 text-[#15152D] font-semibold focus:outline-none"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Out of Stock</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#F7F7FC] border border-[#E8E7F0] rounded-xl px-3 py-2 text-[#15152D] font-semibold focus:outline-none"
          >
            <option>Sort by: Latest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-[#F7F7FC] p-1 rounded-xl border border-[#E8E7F0]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-[#5135ED] text-white' : 'text-[#77778D]'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg ${viewMode === 'table' ? 'bg-[#5135ED] text-white' : 'text-[#77778D]'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ===================== PRODUCTS GRID ===================== */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4">
          {filteredProducts.map((product) => {
            const priceNaira = product.price || Math.round((product.discountedPriceKobo || product.regularPriceKobo || 2500000) / 100);
            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl p-3.5 border border-[#E8E7F0] shadow-soft hover:shadow-card transition-all flex flex-col justify-between group relative"
              >
                {/* Heart wishlist indicator */}
                <button className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-[#77778D] hover:text-red-500 shadow-xs">
                  <Heart className="w-3.5 h-3.5" />
                </button>

                {/* Product Image */}
                <div className="w-full h-36 bg-[#F7F7FC] rounded-xl flex items-center justify-center p-2 mb-3 overflow-hidden">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Details */}
                <div>
                  <h4 className="text-xs font-bold text-[#15152D] truncate" title={product.name}>
                    {product.name}
                  </h4>
                  <p className="text-sm font-extrabold text-[#5135ED] mt-0.5">
                    ₦{priceNaira.toLocaleString()}
                  </p>

                  <div className="flex items-center justify-between text-[11px] mt-2 pb-3 border-b border-[#E8E7F0]">
                    <span className="text-[#F59E0B] font-bold flex items-center">
                      ★ {product.rating || 4.5} <span className="text-[#77778D] font-normal ml-0.5">({product.reviewCount || 120})</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${product.stock > 0 ? 'bg-[#E7F8F0] text-[#19A76B]' : 'bg-[#FEECEE] text-[#E94B59]'}`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-2.5 text-xs font-semibold text-[#77778D]">
                  <button
                    onClick={() => handleOpenEdit(product)}
                    className="hover:text-[#5135ED] flex items-center space-x-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleOpenEdit(product)}
                    className="hover:text-[#5135ED] flex items-center space-x-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="hover:text-[#E94B59] flex items-center space-x-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-[#E8E7F0] shadow-soft overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7FC] text-[#77778D] font-bold border-b border-[#E8E7F0]">
              <tr>
                <th className="p-3.5">Product</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E7F0]">
              {filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/50">
                  <td className="p-3.5 flex items-center space-x-3">
                    <img src={p.images?.[0]} alt={p.name} className="w-9 h-9 rounded-lg object-contain bg-[#F7F7FC] p-1" />
                    <span className="font-bold text-[#15152D]">{p.name}</span>
                  </td>
                  <td className="p-3.5 text-[#77778D]">{p.sku}</td>
                  <td className="p-3.5 capitalize">{p.category}</td>
                  <td className="p-3.5 font-bold text-[#5135ED]">₦{(p.price || 25000).toLocaleString()}</td>
                  <td className="p-3.5">{p.stock}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button onClick={() => handleOpenEdit(p)} className="text-[#5135ED] font-semibold">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-500 font-semibold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===================== ADD / EDIT PRODUCT MODAL ===================== */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E7F0] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E7F0] mb-4">
              <h3 className="font-extrabold text-base text-[#15152D]">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#77778D] hover:text-[#15152D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[#15152D] mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Wireless Noise-Cancelling Headphones"
                  className="w-full bg-[#F7F7FC] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0] focus:outline-none focus:border-[#5135ED]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#15152D] mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-[#F7F7FC] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0]"
                  />
                </div>
                <div>
                  <label className="block text-[#15152D] mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#F7F7FC] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0]"
                  >
                    <option value="accessories">Accessories</option>
                    <option value="shoes">Shoes</option>
                    <option value="fashion">Fashion</option>
                    <option value="beauty">Beauty</option>
                    <option value="home">Home</option>
                    <option value="electronics">Electronics</option>
                    <option value="phones">Phones</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#15152D] mb-1">Price (₦)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-[#F7F7FC] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0]"
                  />
                </div>
                <div>
                  <label className="block text-[#15152D] mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-[#F7F7FC] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#15152D] mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#F7F7FC] rounded-xl p-3 border border-[#E8E7F0]"
                />
              </div>

              {/* Cloudinary Image Upload Section */}
              <div>
                <label className="block text-[#15152D] mb-1.5">Product Image (Cloudinary)</label>
                <div className="flex items-center space-x-3">
                  <img
                    src={formData.images[0]}
                    alt="Preview"
                    className="w-14 h-14 rounded-xl object-contain bg-[#F7F7FC] border border-[#E8E7F0] p-1"
                  />
                  <label className="cursor-pointer bg-[#EEEAFE] hover:bg-[#5135ED]/15 text-[#5135ED] px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'Uploading to Cloudinary...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E8E7F0]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E8E7F0] text-[#77778D] font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#5135ED] text-white font-bold hover:bg-[#3925C5] shadow-md shadow-[#5135ED]/20"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
