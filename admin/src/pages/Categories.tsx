import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  PauseCircle,
  Package,
  Plus,
  Search,
  LayoutGrid,
  List,
  Eye,
  Edit2,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
  ArrowUpRight,
} from 'lucide-react';
import { Sparkline } from '../components/Sparkline';
import { apiClient, MOCK_CATEGORIES } from '../services/api';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [sortBy, setSortBy] = useState('Latest');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get('/categories');
      if (res.data?.success && res.data?.data?.categories) {
        setCategories(res.data.data.categories);
      }
    } catch (err) {
      // Keep mock categories
    }
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: 'Explore our latest collection',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingCategory(c);
    setFormData({
      name: c.name,
      description: c.description || '',
      image: c.image,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await apiClient.delete(`/categories/${id}`);
    } catch (e) {
      // ignore
    }
    setCategories((prev) => prev.filter((c) => c._id !== id));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await apiClient.put(`/categories/${editingCategory._id}`, formData);
      } else {
        await apiClient.post('/categories', formData);
      }
      fetchCategories();
    } catch (err) {
      if (editingCategory) {
        setCategories((prev) =>
          prev.map((c) => (c._id === editingCategory._id ? { ...c, ...formData } : c))
        );
      } else {
        const newC = {
          _id: `cat-${Date.now()}`,
          ...formData,
          slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
          productCount: 0,
          isActive: true,
        };
        setCategories((prev: any) => [...prev, newC]);
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
    form.append('folder', 'shopeasy/categories');

    try {
      const res = await apiClient.post('/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success && res.data?.data?.url) {
        setFormData((prev) => ({ ...prev, image: res.data.data.url }));
      }
    } catch (err) {
      const objectUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: objectUrl }));
    } finally {
      setIsUploading(false);
    }
  };

  const filteredCategories = categories.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter === 'Active' && !c.isActive) return false;
    if (statusFilter === 'Inactive' && c.isActive) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ===================== PAGE HEADER ===================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#15152D] tracking-tight">Categories</h1>
          <p className="text-xs text-[#77778D] font-medium mt-0.5">
            Manage your product categories.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#5135ED] hover:bg-[#3925C5] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-[#5135ED]/20 flex items-center space-x-1.5 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* ===================== 4 METRICS CARDS ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EEEAFE] text-[#5135ED] flex items-center justify-center shrink-0">
              <Grid className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Total Categories</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">8</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>0%</span>
              </p>
            </div>
          </div>
          <Sparkline color="purple" />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E7F8F0] text-[#10B981] flex items-center justify-center shrink-0">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Active Categories</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">7</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>0%</span>
              </p>
            </div>
          </div>
          <Sparkline color="green" />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8E7] text-[#F59E0B] flex items-center justify-center shrink-0">
              <PauseCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Inactive Categories</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">1</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>0%</span>
              </p>
            </div>
          </div>
          <Sparkline color="orange" />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF3FF] text-[#3B82F6] flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Total Products</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">856</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>12.5%</span>
              </p>
            </div>
          </div>
          <Sparkline color="blue" />
        </div>
      </div>

      {/* ===================== FILTER BAR ===================== */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E7F0] shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#77778D] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F7F7FC] text-[#15152D] text-xs rounded-xl pl-10 pr-4 py-2.5 border border-[#E8E7F0] focus:outline-none focus:border-[#5135ED]"
          />
        </div>

        <div className="flex items-center space-x-2.5 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F7F7FC] border border-[#E8E7F0] rounded-xl px-3 py-2 text-[#15152D] font-semibold focus:outline-none"
          >
            <option>All Statuses</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#F7F7FC] border border-[#E8E7F0] rounded-xl px-3 py-2 text-[#15152D] font-semibold focus:outline-none"
          >
            <option>Sort by: Latest</option>
            <option>Name A-Z</option>
            <option>Products: High to Low</option>
          </select>

          <div className="flex items-center bg-[#F7F7FC] p-1 rounded-xl border border-[#E8E7F0]">
            <button className="p-1.5 rounded-lg bg-[#5135ED] text-white">
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 rounded-lg text-[#77778D]">
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ===================== CATEGORIES 4-COL GRID ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredCategories.map((cat) => (
          <div
            key={cat._id}
            className="bg-white rounded-2xl p-4 border border-[#E8E7F0] shadow-soft hover:shadow-card transition-all flex flex-col justify-between group relative"
          >
            {/* Active Status Badge */}
            <div className="flex justify-end mb-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${cat.isActive ? 'bg-[#E7F8F0] text-[#19A76B]' : 'bg-[#FEECEE] text-[#E94B59]'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current mr-1" />
                {cat.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Category Image */}
            <div className="w-full h-36 bg-[#F7F7FC] rounded-2xl flex items-center justify-center p-2 mb-3 overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Title & Count */}
            <div className="text-center mb-3">
              <h4 className="font-extrabold text-sm text-[#15152D]">{cat.name}</h4>
              <p className="text-xs text-[#77778D] font-medium mt-0.5">
                {cat.productCount}+ Products
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E8E7F0] text-xs font-semibold text-[#77778D]">
              <button onClick={() => handleOpenEdit(cat)} className="hover:text-[#5135ED] flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </button>
              <button onClick={() => handleOpenEdit(cat)} className="hover:text-[#5135ED] flex items-center space-x-1">
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button onClick={() => handleDelete(cat._id)} className="hover:text-[#E94B59] flex items-center space-x-1">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
              <button className="hover:text-[#15152D] p-1">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="p-4 bg-white rounded-2xl border border-[#E8E7F0] flex items-center justify-between text-xs text-[#77778D] font-semibold">
        <p>Showing 1 – {filteredCategories.length} of {categories.length} categories</p>
        <div className="flex items-center space-x-1">
          <button className="p-1.5 rounded-lg border border-[#E8E7F0] hover:bg-gray-50">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-[#5135ED] text-white font-bold">1</button>
          <button className="p-1.5 rounded-lg border border-[#E8E7F0] hover:bg-gray-50">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ===================== ADD / EDIT CATEGORY MODAL ===================== */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8E7F0]">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E8E7F0] mb-4">
              <h3 className="font-extrabold text-base text-[#15152D]">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#77778D] hover:text-[#15152D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[#15152D] mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Smart Watches"
                  className="w-full bg-[#F7F7FC] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0]"
                />
              </div>

              <div>
                <label className="block text-[#15152D] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#F7F7FC] rounded-xl p-3 border border-[#E8E7F0]"
                />
              </div>

              {/* Cloudinary Upload */}
              <div>
                <label className="block text-[#15152D] mb-1.5">Category Image (Cloudinary)</label>
                <div className="flex items-center space-x-3">
                  <img src={formData.image} alt="Preview" className="w-12 h-12 rounded-xl object-contain bg-[#F7F7FC] border border-[#E8E7F0] p-1" />
                  <label className="cursor-pointer bg-[#EEEAFE] hover:bg-[#5135ED]/15 text-[#5135ED] px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E8E7F0]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E8E7F0] text-[#77778D] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#5135ED] text-white font-bold hover:bg-[#3925C5]"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
