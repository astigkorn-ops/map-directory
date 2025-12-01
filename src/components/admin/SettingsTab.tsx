import { Sun, Moon, Settings, Users, RefreshCw } from "lucide-react";
import type { AppSettings } from "./types";

interface SettingsTabProps {
  settings: AppSettings;
  themeMode: "light" | "dark";
  onSaveTheme: (mode: "light" | "dark") => void;
}

export default function SettingsTab({ settings, themeMode, onSaveTheme }: SettingsTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
          <Sun className="text-yellow-500" size={24} />
          Theme Settings
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Color Mode</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => onSaveTheme("light")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  themeMode === "light"
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                data-testid="button-theme-light"
              >
                <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                  <Sun size={24} className="text-yellow-500" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Light Mode</p>
                  <p className="text-sm text-gray-600">Bright and clean interface</p>
                </div>
              </button>

              <button
                onClick={() => onSaveTheme("dark")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  themeMode === "dark"
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                data-testid="button-theme-dark"
              >
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Moon size={24} className="text-indigo-300" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Dark Mode</p>
                  <p className="text-sm text-gray-600">Reduced eye strain in low light</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
          <Settings className="text-blue-500" size={24} />
          Application Configuration
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Application Name
            </label>
            <input
              type="text"
              defaultValue={settings.app_config?.appName || "MDRRMO Pio Duran Dashboard"}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              data-testid="input-app-name"
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg">
              <RefreshCw className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-900">Offline Sync</p>
              <p className="text-sm text-gray-600">Coming soon in future updates</p>
            </div>
            <div className="ml-auto">
              <div className="relative inline-block w-12 h-6">
                <input type="checkbox" className="opacity-0 w-0 h-0 peer" disabled />
                <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition peer-checked:bg-blue-500 peer-disabled:bg-gray-200"></span>
                <span className="absolute h-4 w-4 bg-white rounded-full left-1 top-1 transition peer-checked:translate-x-6 peer-disabled:bg-gray-300"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
          <Users className="text-purple-500" size={24} />
          Role-Based Access Control
        </h2>

        <div className="space-y-4">
          <p className="text-gray-600">
            Configure user roles and permissions for different access levels
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {settings.roles &&
              Object.entries(settings.roles).map(([role, permissions]) => (
                <div
                  key={role}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  data-testid={`card-role-${role}`}
                >
                  <h4 className="font-bold text-gray-900 capitalize mb-3">{role}</h4>
                  <div className="space-y-2">
                    {(permissions as string[]).length > 0 ? (
                      (permissions as string[]).map((perm) => (
                        <span
                          key={perm}
                          className="inline-block px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium mr-1 mb-1"
                        >
                          {perm.replace(/_/g, " ")}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No permissions assigned</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
