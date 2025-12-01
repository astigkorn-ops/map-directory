import { useRef } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Image,
  RefreshCw,
  X,
  Upload,
  Search,
} from "lucide-react";
import type { Panorama, PanoramaFormData } from "./types";

interface PanoramasTabProps {
  panoramas: Panorama[];
  showPanoramaForm: boolean;
  setShowPanoramaForm: (show: boolean) => void;
  editingPanorama: Panorama | null;
  panoramaForm: PanoramaFormData;
  setPanoramaForm: (form: PanoramaFormData) => void;
  onCreatePanorama: () => void;
  onEditPanorama: (panorama: Panorama) => void;
  onSavePanorama: () => void;
  onDeletePanorama: (id: number) => void;
  onTogglePanorama: (panorama: Panorama) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  panoramaUploading: boolean;
  saving: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
}

export default function PanoramasTab({
  panoramas,
  showPanoramaForm,
  setShowPanoramaForm,
  editingPanorama,
  panoramaForm,
  setPanoramaForm,
  onCreatePanorama,
  onEditPanorama,
  onSavePanorama,
  onDeletePanorama,
  onTogglePanorama,
  onFileSelect,
  panoramaUploading,
  saving,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: PanoramasTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sortedPanoramas = [...panoramas]
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortBy as keyof Panorama] > b[sortBy as keyof Panorama] ? 1 : -1;
      } else {
        return a[sortBy as keyof Panorama] < b[sortBy as keyof Panorama] ? 1 : -1;
      }
    })
    .filter(
      (panorama) =>
        panorama.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (panorama.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="space-y-6">
      {showPanoramaForm ? (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-white/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              {editingPanorama ? "Edit Panorama" : "Add New Panorama"}
            </h3>
            <button
              onClick={() => setShowPanoramaForm(false)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              data-testid="button-close-panorama-form"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                value={panoramaForm.name}
                onChange={(e) => setPanoramaForm({ ...panoramaForm, name: e.target.value })}
                placeholder="Municipal Hall 360"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                data-testid="input-panorama-name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Order Index</label>
              <input
                type="number"
                value={panoramaForm.order_index}
                onChange={(e) =>
                  setPanoramaForm({ ...panoramaForm, order_index: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                data-testid="input-panorama-order"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={panoramaForm.description}
                onChange={(e) =>
                  setPanoramaForm({ ...panoramaForm, description: e.target.value })
                }
                rows={3}
                placeholder="Brief description of this panorama..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                data-testid="textarea-panorama-description"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Panorama Image
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileSelect}
                accept="image/*"
                className="hidden"
                data-testid="input-panorama-file"
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  value={panoramaForm.image_url}
                  onChange={(e) => setPanoramaForm({ ...panoramaForm, image_url: e.target.value })}
                  placeholder="Image URL or upload a file..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono text-sm"
                  data-testid="input-panorama-url"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={panoramaUploading}
                  className="px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                  data-testid="button-upload-panorama"
                >
                  {panoramaUploading ? (
                    <RefreshCw className="animate-spin" size={18} />
                  ) : (
                    <Upload size={18} />
                  )}
                  Upload
                </button>
              </div>
              {panoramaForm.image_url && (
                <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={panoramaForm.image_url}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={panoramaForm.is_active}
                  onChange={(e) =>
                    setPanoramaForm({ ...panoramaForm, is_active: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  data-testid="checkbox-panorama-active"
                />
                <span className="text-sm font-semibold text-gray-700">Active (visible in gallery)</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={onSavePanorama}
              disabled={saving}
              className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              data-testid="button-save-panorama"
            >
              {saving ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  Saving...
                </>
              ) : (
                "Save Panorama"
              )}
            </button>
            <button
              onClick={() => setShowPanoramaForm(false)}
              className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              data-testid="button-cancel-panorama"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">360 Panorama Management</h2>
              <p className="text-gray-600">Upload and manage panoramic images for the gallery</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search panoramas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  data-testid="input-search-panoramas"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                data-testid="select-panorama-sort"
              >
                <option value="order_index">Order</option>
                <option value="name">Name</option>
                <option value="created_at">Created Date</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                data-testid="button-toggle-panorama-sort"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
              <button
                onClick={onCreatePanorama}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                data-testid="button-create-panorama"
              >
                <Plus size={18} />
                Add Panorama
              </button>
            </div>
          </div>

          {sortedPanoramas.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-12 text-center">
              <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No panoramas found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Add your first 360 panorama to get started"}
              </p>
              {!searchTerm && (
                <button
                  onClick={onCreatePanorama}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  data-testid="button-create-first-panorama"
                >
                  Add Panorama
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedPanoramas.map((panorama) => (
                <div
                  key={panorama.id}
                  className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${
                    panorama.is_active ? "border-green-200" : "border-gray-200"
                  }`}
                  data-testid={`card-panorama-${panorama.id}`}
                >
                  <div className="relative h-40 bg-gray-100">
                    {panorama.thumbnail_url || panorama.image_url ? (
                      <img
                        src={panorama.thumbnail_url || panorama.image_url}
                        alt={panorama.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-full font-medium">
                        #{panorama.order_index}
                      </span>
                      {panorama.is_active && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{panorama.name}</h3>
                    {panorama.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {panorama.description}
                      </p>
                    )}
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => onTogglePanorama(panorama)}
                        className={`p-2 rounded-lg transition flex items-center justify-center ${
                          panorama.is_active
                            ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                            : "bg-green-100 hover:bg-green-200 text-green-700"
                        }`}
                        title={panorama.is_active ? "Hide" : "Show"}
                        data-testid={`button-toggle-panorama-${panorama.id}`}
                      >
                        {panorama.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => onEditPanorama(panorama)}
                        className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition flex items-center justify-center"
                        title="Edit"
                        data-testid={`button-edit-panorama-${panorama.id}`}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDeletePanorama(panorama.id)}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition flex items-center justify-center"
                        title="Delete"
                        data-testid={`button-delete-panorama-${panorama.id}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
