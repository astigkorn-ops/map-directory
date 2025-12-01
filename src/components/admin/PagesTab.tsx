import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Map,
  FileText,
  RefreshCw,
  X,
  Search,
} from "lucide-react";
import type { Page, MapPage, MapPageFormData, PagesSubTab } from "./types";

interface PagesTabProps {
  pages: Page[];
  mapPages: MapPage[];
  pagesSubTab: PagesSubTab;
  setPagesSubTab: (tab: PagesSubTab) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  onEditPage: (page: Page) => void;
  onCreateMapPage: () => void;
  onEditMapPage: (page: MapPage) => void;
  onDeleteMapPage: (id: number) => void;
  onTogglePublish: (page: MapPage) => void;
  editingPage: string | null;
  editTitle: string;
  setEditTitle: (title: string) => void;
  editContent: string;
  setEditContent: (content: string) => void;
  onSavePage: () => void;
  onCancelEdit: () => void;
  saving: boolean;
  showMapPageForm: boolean;
  setShowMapPageForm: (show: boolean) => void;
  editingMapPage: MapPage | null;
  mapPageForm: MapPageFormData;
  setMapPageForm: (form: MapPageFormData) => void;
  onSaveMapPage: () => void;
}

export default function PagesTab({
  pages,
  mapPages,
  pagesSubTab,
  setPagesSubTab,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onEditPage,
  onCreateMapPage,
  onEditMapPage,
  onDeleteMapPage,
  onTogglePublish,
  editingPage,
  editTitle,
  setEditTitle,
  editContent,
  setEditContent,
  onSavePage,
  onCancelEdit,
  saving,
  showMapPageForm,
  setShowMapPageForm,
  editingMapPage,
  mapPageForm,
  setMapPageForm,
  onSaveMapPage,
}: PagesTabProps) {
  const sortedMapPages = [...mapPages]
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortBy as keyof MapPage] > b[sortBy as keyof MapPage] ? 1 : -1;
      } else {
        return a[sortBy as keyof MapPage] < b[sortBy as keyof MapPage] ? 1 : -1;
      }
    })
    .filter(
      (page) =>
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (page.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={() => setPagesSubTab("map")}
          className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
            pagesSubTab === "map"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
          }`}
          data-testid="button-map-pages-tab"
        >
          <Map size={16} />
          Map Pages
        </button>
        <button
          onClick={() => setPagesSubTab("system")}
          className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
            pagesSubTab === "system"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
          }`}
          data-testid="button-system-pages-tab"
        >
          <FileText size={16} />
          System Pages
        </button>
      </div>

      {pagesSubTab === "map" && (
        <>
          {showMapPageForm ? (
            <MapPageForm
              editingMapPage={editingMapPage}
              mapPageForm={mapPageForm}
              setMapPageForm={setMapPageForm}
              onSave={onSaveMapPage}
              onCancel={() => setShowMapPageForm(false)}
              saving={saving}
            />
          ) : (
            <>
              <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Map Pages</h2>
                  <p className="text-gray-600">Manage your interactive map pages</p>
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Search map pages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      data-testid="input-search-map-pages"
                    />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    data-testid="select-sort-by"
                  >
                    <option value="title">Title</option>
                    <option value="created_at">Created Date</option>
                    <option value="updated_at">Updated Date</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    data-testid="button-toggle-sort"
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </button>
                  <button
                    onClick={onCreateMapPage}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                    data-testid="button-create-map-page"
                  >
                    <Plus size={18} />
                    Create Map Page
                  </button>
                </div>
              </div>

              {sortedMapPages.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-12 text-center">
                  <Map className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No map pages found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Create your first interactive map page to get started"}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={onCreateMapPage}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                      data-testid="button-create-first-map-page"
                    >
                      Create Map Page
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedMapPages.map((page) => (
                    <div
                      key={page.id}
                      className={`bg-white rounded-xl shadow-sm border ${
                        page.is_published ? "border-green-200" : "border-gray-200"
                      } overflow-hidden hover:shadow-md transition-shadow`}
                      data-testid={`card-map-page-${page.id}`}
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-lg truncate">
                              {page.title}
                            </h3>
                            <p className="text-sm text-gray-500 font-mono">/maps/{page.slug}</p>
                          </div>
                          <span
                            className={`ml-2 px-2.5 py-1 text-xs rounded-full font-medium ${
                              page.is_published
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {page.is_published ? "Published" : "Draft"}
                          </span>
                        </div>
                        {page.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {page.description}
                          </p>
                        )}
                        <div className="flex gap-2 text-xs text-gray-500 mb-4">
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            Lat: {Number(page.center_lat).toFixed(4)}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            Lng: {Number(page.center_lng).toFixed(4)}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            Zoom: {page.zoom_level}
                          </span>
                        </div>
                        <div className="flex gap-2 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => onTogglePublish(page)}
                            className={`p-2 rounded-lg transition flex items-center justify-center ${
                              page.is_published
                                ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                                : "bg-green-100 hover:bg-green-200 text-green-700"
                            }`}
                            title={page.is_published ? "Unpublish" : "Publish"}
                            data-testid={`button-toggle-publish-${page.id}`}
                          >
                            {page.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button
                            onClick={() => onEditMapPage(page)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition flex items-center justify-center"
                            title="Edit"
                            data-testid={`button-edit-map-page-${page.id}`}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => onDeleteMapPage(page.id)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition flex items-center justify-center"
                            title="Delete"
                            data-testid={`button-delete-map-page-${page.id}`}
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
        </>
      )}

      {pagesSubTab === "system" && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
            <FileText className="text-blue-500" size={24} />
            System Pages
          </h2>

          {editingPage ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  data-testid="input-page-title"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content (HTML)
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  data-testid="textarea-page-content"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onSavePage}
                  disabled={saving}
                  className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  data-testid="button-save-page"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="animate-spin" size={18} />
                      Saving...
                    </>
                  ) : (
                    "Save Page"
                  )}
                </button>
                <button
                  onClick={onCancelEdit}
                  className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                  data-testid="button-cancel-edit"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Title</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Updated</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                          {page.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{page.title}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(page.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => onEditPage(page)}
                          className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition"
                          title="Edit"
                          data-testid={`button-edit-system-page-${page.type}`}
                        >
                          <Edit2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MapPageForm({
  editingMapPage,
  mapPageForm,
  setMapPageForm,
  onSave,
  onCancel,
  saving,
}: {
  editingMapPage: MapPage | null;
  mapPageForm: MapPageFormData;
  setMapPageForm: (form: MapPageFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-white/50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          {editingMapPage ? "Edit Map Page" : "Create New Map Page"}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
          data-testid="button-close-form"
        >
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Slug *</label>
          <input
            type="text"
            value={mapPageForm.slug}
            onChange={(e) =>
              setMapPageForm({
                ...mapPageForm,
                slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
              })
            }
            placeholder="evacuation-routes"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            data-testid="input-map-page-slug"
          />
          <p className="mt-1 text-xs text-gray-500">Used in URLs (e.g., /maps/evacuation-routes)</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            value={mapPageForm.title}
            onChange={(e) => setMapPageForm({ ...mapPageForm, title: e.target.value })}
            placeholder="Evacuation Routes Map"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            data-testid="input-map-page-title"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            value={mapPageForm.description}
            onChange={(e) => setMapPageForm({ ...mapPageForm, description: e.target.value })}
            rows={3}
            placeholder="Brief description of this map page..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            data-testid="textarea-map-page-description"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Center Latitude</label>
          <input
            type="number"
            step="0.0001"
            value={mapPageForm.center_lat}
            onChange={(e) =>
              setMapPageForm({ ...mapPageForm, center_lat: parseFloat(e.target.value) || 0 })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            data-testid="input-center-lat"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Center Longitude</label>
          <input
            type="number"
            step="0.0001"
            value={mapPageForm.center_lng}
            onChange={(e) =>
              setMapPageForm({ ...mapPageForm, center_lng: parseFloat(e.target.value) || 0 })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            data-testid="input-center-lng"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Zoom Level</label>
          <input
            type="number"
            min="1"
            max="20"
            value={mapPageForm.zoom_level}
            onChange={(e) =>
              setMapPageForm({ ...mapPageForm, zoom_level: parseInt(e.target.value) || 12 })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            data-testid="input-zoom-level"
          />
        </div>

        <div className="flex items-center pt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={mapPageForm.is_published}
              onChange={(e) => setMapPageForm({ ...mapPageForm, is_published: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              data-testid="checkbox-publish"
            />
            <span className="text-sm font-semibold text-gray-700">Publish this page</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={onSave}
          disabled={saving}
          className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          data-testid="button-save-map-page"
        >
          {saving ? (
            <>
              <RefreshCw className="animate-spin" size={18} />
              Saving...
            </>
          ) : (
            "Save Page"
          )}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
          data-testid="button-cancel-map-page"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
