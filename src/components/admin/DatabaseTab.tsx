import { useRef } from "react";
import {
  Database,
  Upload,
  Layers,
  Eye,
  Trash2,
  Map,
  RefreshCw,
} from "lucide-react";
import type { DBInfo, SpatialFile } from "./types";

interface DatabaseTabProps {
  dbInfo: DBInfo | null;
  spatialFiles: SpatialFile[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  activeLayers: number[];
  toggleLayer: (id: number) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  uploadingFile: boolean;
  onFileDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteFile: (id: number) => void;
  onUpdateFileCategory: (id: number, category: string) => void;
}

export default function DatabaseTab({
  dbInfo,
  spatialFiles,
  selectedCategory,
  setSelectedCategory,
  activeLayers,
  toggleLayer,
  isDragging,
  setIsDragging,
  uploadingFile,
  onFileDrop,
  onFileSelect,
  onDeleteFile,
  onUpdateFileCategory,
}: DatabaseTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFiles =
    selectedCategory === "all"
      ? spatialFiles
      : spatialFiles.filter((f) => f.category === selectedCategory);

  const categories = ["all", ...new Set(spatialFiles.map((f) => f.category))];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
            <Database className="text-green-500" size={24} />
            Database Information
          </h2>

          {dbInfo ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <span className="font-semibold text-gray-700">PostgreSQL Version</span>
                <span className="font-mono text-sm text-green-700 bg-green-100 px-3 py-1 rounded">
                  {dbInfo.version}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <span className="font-semibold text-gray-700">Total Tables</span>
                <span className="font-mono text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded">
                  {dbInfo.tableCount}
                </span>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-700 block mb-3">Tables:</span>
                <div className="flex flex-wrap gap-2">
                  {dbInfo.tables.map((table) => (
                    <span
                      key={table}
                      className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs rounded-lg font-mono shadow-sm"
                    >
                      {table}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500">
              <RefreshCw className="animate-spin mr-2" size={20} />
              Loading database info...
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
            <Upload className="text-indigo-500" size={24} />
            Upload Spatial Files
          </h2>

          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onFileDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileSelect}
              accept=".kml,.geojson,.json,.csv"
              multiple
              className="hidden"
              data-testid="input-file-upload"
            />

            <div className="flex flex-col items-center">
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <p className="font-semibold text-gray-700 mb-1">
                {isDragging ? "Drop files here" : "Drag & drop spatial files"}
              </p>
              <p className="text-sm text-gray-500 mb-4">KML, GeoJSON, or CSV files</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFile}
                className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                data-testid="button-browse-files"
              >
                {uploadingFile ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Browse Files
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Layers className="text-purple-500" size={24} />
            Spatial Files ({spatialFiles.length})
          </h2>

          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                  selectedCategory === cat
                    ? "bg-purple-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                data-testid={`button-category-${cat}`}
              >
                {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredFiles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Layers className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No spatial files uploaded yet</p>
            <p className="text-sm">Upload KML, GeoJSON, or CSV files to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Layer</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">File Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Category</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Size</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleLayer(file.id)}
                        className={`p-2 rounded-lg transition ${
                          activeLayers.includes(file.id)
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                        data-testid={`button-toggle-layer-${file.id}`}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <div className="max-w-xs truncate" title={file.original_name}>
                        {file.original_name}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                          file.file_type === "kml"
                            ? "bg-green-100 text-green-800"
                            : file.file_type === "geojson"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {file.file_type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={file.category}
                        onChange={(e) => onUpdateFileCategory(file.id, e.target.value)}
                        className="px-2.5 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        data-testid={`select-category-${file.id}`}
                      >
                        <option value="uncategorized">Uncategorized</option>
                        <option value="evacuation">Evacuation</option>
                        <option value="hazard">Hazard Zones</option>
                        <option value="boundaries">Boundaries</option>
                        <option value="infrastructure">Infrastructure</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {file.file_size > 1024
                        ? `${(file.file_size / 1024).toFixed(1)} KB`
                        : `${file.file_size} B`}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onDeleteFile(file.id)}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                        title="Delete"
                        data-testid={`button-delete-file-${file.id}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {activeLayers.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
            <Map className="text-indigo-500" size={24} />
            Map Preview
          </h2>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg h-64 flex items-center justify-center border border-gray-200">
            <div className="text-center">
              <Map className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">
                {activeLayers.length} layer{activeLayers.length > 1 ? "s" : ""} selected for
                preview
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Interactive map preview would appear here
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
