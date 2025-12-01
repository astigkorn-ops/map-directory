import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Map,
  RefreshCw,
  X,
} from "lucide-react";
import type { MapConfig, MapConfigFormData } from "./types";

interface MapConfigTabProps {
  mapConfigs: MapConfig[];
  showMapConfigForm: boolean;
  setShowMapConfigForm: (show: boolean) => void;
  editingMapConfig: MapConfig | null;
  mapConfigForm: MapConfigFormData;
  setMapConfigForm: (form: MapConfigFormData) => void;
  onCreateMapConfig: () => void;
  onEditMapConfig: (config: MapConfig) => void;
  onSaveMapConfig: () => void;
  onDeleteMapConfig: (id: number) => void;
  onToggleMapConfigActive: (config: MapConfig) => void;
  saving: boolean;
}

export default function MapConfigTab({
  mapConfigs,
  showMapConfigForm,
  setShowMapConfigForm,
  editingMapConfig,
  mapConfigForm,
  setMapConfigForm,
  onCreateMapConfig,
  onEditMapConfig,
  onSaveMapConfig,
  onDeleteMapConfig,
  onToggleMapConfigActive,
  saving,
}: MapConfigTabProps) {
  return (
    <div className="space-y-6">
      {showMapConfigForm ? (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-white/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              {editingMapConfig ? "Edit Map Configuration" : "Create Map Configuration"}
            </h3>
            <button
              onClick={() => setShowMapConfigForm(false)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              data-testid="button-close-config-form"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Configuration Name *
              </label>
              <input
                type="text"
                value={mapConfigForm.config_name}
                onChange={(e) =>
                  setMapConfigForm({ ...mapConfigForm, config_name: e.target.value })
                }
                placeholder="Default Map Config"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                data-testid="input-config-name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={mapConfigForm.description}
                onChange={(e) =>
                  setMapConfigForm({ ...mapConfigForm, description: e.target.value })
                }
                placeholder="Configuration description..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                data-testid="input-config-description"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Default Center Latitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={mapConfigForm.default_center_lat}
                onChange={(e) =>
                  setMapConfigForm({
                    ...mapConfigForm,
                    default_center_lat: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                data-testid="input-default-lat"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Default Center Longitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={mapConfigForm.default_center_lng}
                onChange={(e) =>
                  setMapConfigForm({
                    ...mapConfigForm,
                    default_center_lng: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                data-testid="input-default-lng"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Default Zoom</label>
              <input
                type="number"
                min="1"
                max="20"
                value={mapConfigForm.default_zoom}
                onChange={(e) =>
                  setMapConfigForm({
                    ...mapConfigForm,
                    default_zoom: parseInt(e.target.value) || 14,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                data-testid="input-default-zoom"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Min Zoom / Max Zoom
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={mapConfigForm.min_zoom}
                  onChange={(e) =>
                    setMapConfigForm({
                      ...mapConfigForm,
                      min_zoom: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  data-testid="input-min-zoom"
                />
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={mapConfigForm.max_zoom}
                  onChange={(e) =>
                    setMapConfigForm({
                      ...mapConfigForm,
                      max_zoom: parseInt(e.target.value) || 19,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  data-testid="input-max-zoom"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reference Circle Radius (meters)
              </label>
              <input
                type="number"
                value={mapConfigForm.reference_circle_radius}
                onChange={(e) =>
                  setMapConfigForm({
                    ...mapConfigForm,
                    reference_circle_radius: parseInt(e.target.value) || 1000,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                data-testid="input-circle-radius"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reference Circle Color
              </label>
              <input
                type="color"
                value={mapConfigForm.reference_circle_color}
                onChange={(e) =>
                  setMapConfigForm({
                    ...mapConfigForm,
                    reference_circle_color: e.target.value,
                  })
                }
                className="w-full h-12 px-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                data-testid="input-circle-color"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max File Size (MB)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={mapConfigForm.max_file_size_mb}
                onChange={(e) =>
                  setMapConfigForm({
                    ...mapConfigForm,
                    max_file_size_mb: parseInt(e.target.value) || 10,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                data-testid="input-max-file-size"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tile Layer URL</label>
              <input
                type="text"
                value={mapConfigForm.tile_layer_url}
                onChange={(e) =>
                  setMapConfigForm({ ...mapConfigForm, tile_layer_url: e.target.value })
                }
                placeholder="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono text-sm"
                data-testid="input-tile-url"
              />
            </div>

            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={mapConfigForm.enable_location_marker}
                  onChange={(e) =>
                    setMapConfigForm({
                      ...mapConfigForm,
                      enable_location_marker: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  data-testid="checkbox-location-marker"
                />
                <span className="text-sm font-semibold text-gray-700">Enable Location Marker</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={mapConfigForm.enable_reference_circle}
                  onChange={(e) =>
                    setMapConfigForm({
                      ...mapConfigForm,
                      enable_reference_circle: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  data-testid="checkbox-reference-circle"
                />
                <span className="text-sm font-semibold text-gray-700">Enable Reference Circle</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={mapConfigForm.is_active}
                  onChange={(e) =>
                    setMapConfigForm({ ...mapConfigForm, is_active: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  data-testid="checkbox-active-config"
                />
                <span className="text-sm font-semibold text-gray-700">Set as Active Config</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={onSaveMapConfig}
              disabled={saving}
              className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              data-testid="button-save-config"
            >
              {saving ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  Saving...
                </>
              ) : (
                "Save Configuration"
              )}
            </button>
            <button
              onClick={() => setShowMapConfigForm(false)}
              className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              data-testid="button-cancel-config"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Map Configuration</h2>
              <p className="text-gray-600">
                Configure settings for the Interactive Map component
              </p>
            </div>
            <button
              onClick={onCreateMapConfig}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              data-testid="button-create-config"
            >
              <Plus size={18} />
              Create Config
            </button>
          </div>

          {mapConfigs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-12 text-center">
              <Map className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No map configurations yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first map configuration to customize the interactive map
              </p>
              <button
                onClick={onCreateMapConfig}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                data-testid="button-create-first-config"
              >
                Create Configuration
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="space-y-4">
                {mapConfigs.map((config) => (
                  <div
                    key={config.id}
                    className={`border rounded-xl p-5 transition-all ${
                      config.is_active
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    data-testid={`card-config-${config.id}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-gray-900 text-lg">{config.config_name}</h3>
                          {config.is_active && (
                            <span className="px-2.5 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
                              Active
                            </span>
                          )}
                        </div>
                        {config.description && (
                          <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onToggleMapConfigActive(config)}
                          className={`p-2 rounded-lg transition ${
                            config.is_active
                              ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                              : "bg-green-100 hover:bg-green-200 text-green-700"
                          }`}
                          title={config.is_active ? "Deactivate" : "Activate"}
                          data-testid={`button-toggle-config-${config.id}`}
                        >
                          {config.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => onEditMapConfig(config)}
                          className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition"
                          title="Edit"
                          data-testid={`button-edit-config-${config.id}`}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteMapConfig(config.id)}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                          title="Delete"
                          data-testid={`button-delete-config-${config.id}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-gray-500 text-xs mb-1">Center</p>
                        <p className="font-semibold text-gray-900">
                          {Number(config.default_center_lat).toFixed(4)},{" "}
                          {Number(config.default_center_lng).toFixed(4)}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-gray-500 text-xs mb-1">Zoom</p>
                        <p className="font-semibold text-gray-900">
                          {config.default_zoom} ({config.min_zoom}-{config.max_zoom})
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-gray-500 text-xs mb-1">Circle Radius</p>
                        <p className="font-semibold text-gray-900">
                          {config.reference_circle_radius}m
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-gray-500 text-xs mb-1">Max File Size</p>
                        <p className="font-semibold text-gray-900">{config.max_file_size_mb} MB</p>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-3 text-xs">
                      {config.enable_location_marker && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          Location Marker
                        </span>
                      )}
                      {config.enable_reference_circle && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                          Reference Circle
                        </span>
                      )}
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {(config.allowed_file_types || []).join(", ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
