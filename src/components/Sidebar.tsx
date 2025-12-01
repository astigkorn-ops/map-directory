import { ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import React, { useState, useEffect } from 'react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  isBoundaryOpen: boolean;
  onToggleBoundary: () => void;
  refreshTrigger?: number;
}

// Define an interface for the custom button data
interface CustomButton {
  id: string;
  label: string;
  button_id: string;
  folder_id: string;
  is_enabled: boolean;
  order_index: number;
}

export default function Sidebar({ activeView, onNavigate, isBoundaryOpen, onToggleBoundary, refreshTrigger }: SidebarProps) {
  const { user } = useAuth();
  const [customButtons, setCustomButtons] = useState<CustomButton[]>([]);

  useEffect(() => {
    const fetchCustomButtons = async () => {
      try {
        const response = await fetch('/api/sidebar-buttons');
        if (!response.ok) {
          console.error('Failed to fetch custom buttons:', response.status, response.statusText);
          setCustomButtons([]);
          return;
        }
        const result = await response.json();
        if (!result.success) {
          console.error('API returned error:', result.error || 'Unknown error');
          setCustomButtons([]);
          return;
        }
        const data: CustomButton[] = result.buttons || [];
        const enabledButtons = data
          .filter(btn => btn.is_enabled)
          .sort((a, b) => a.order_index - b.order_index);
        setCustomButtons(enabledButtons);
      } catch (error) {
        console.error('Error fetching custom buttons:', error instanceof Error ? error.message : error);
        setCustomButtons([]);
      }
    };

    // Fetch custom buttons for ALL users (not just authenticated users)
    fetchCustomButtons();
  }, [refreshTrigger]);

  const menuItems = [
    { id: 'panorama', label: 'PANORAMA' },
    { id: 'basemap', label: 'BASE MAP' },
    { id: 'elevation', label: 'ELEVATION MAP' },
    { id: 'evacuation', label: 'EVACUATION' },
    { id: 'hazards', label: 'HAZARDS' },
  ];

  const boundaryItems = [
    { id: 'purok', label: 'PUROK' },
    { id: 'barangay', label: 'BARANGAY' },
    { id: 'municipal', label: 'MUNICIPAL' },
  ];

  return (
    <div className="w-64 bg-[#000080] h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-4 flex items-center gap-3 border-b border-blue-600">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
        </div>
        <div className="text-white">
          <div className="font-bold text-sm">MDRRMO</div>
          <div className="text-xs">PIO DURAN</div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            data-testid={`nav-${item.id}`}
            className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all ${
              activeView === item.id
                ? 'bg-white text-[#000080] shadow-lg'
                : 'bg-white/90 text-gray-700 hover:bg-white hover:shadow-md'
            }`}
          >
            {item.label}
          </button>
        ))}

        <div>
          <button
            onClick={onToggleBoundary}
            data-testid="nav-boundary"
            className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-between ${
              isBoundaryOpen
                ? 'bg-white text-[#000080] shadow-lg'
                : 'bg-white/90 text-gray-700 hover:bg-white hover:shadow-md'
            }`}
          >
            BOUNDARY MAP
            <ChevronDown className={`w-4 h-4 transition-transform ${isBoundaryOpen ? 'rotate-180' : ''}`} />
          </button>

          {isBoundaryOpen && (
            <div className="mt-2 ml-4 space-y-2">
              {boundaryItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  data-testid={`nav-${item.id}`}
                  className={`w-full py-2 px-4 rounded-lg font-medium text-xs transition-all ${
                    activeView === item.id
                      ? 'bg-blue-400 text-white shadow'
                      : 'bg-blue-300/50 text-white hover:bg-blue-400/70'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => onNavigate('interactive')}
          data-testid="nav-interactive"
          className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all ${
            activeView === 'interactive'
              ? 'bg-white text-[#000080] shadow-lg'
              : 'bg-white/90 text-gray-700 hover:bg-white hover:shadow-md'
          }`}
        >
          INTERACTIVE
        </button>
      </nav>

      {customButtons.length > 0 && (
        <div className="p-4">
          <div className="space-y-2">
            {customButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => onNavigate(btn.button_id)}
                data-testid={`nav-${btn.button_id}`}
                className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                  activeView === btn.button_id
                    ? 'bg-white text-[#000080] shadow-lg'
                    : 'bg-white/90 text-[#000080] hover:bg-white hover:shadow-md'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
