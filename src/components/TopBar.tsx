import { User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface TopBarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export default function TopBar({ activeView, onNavigate }: TopBarProps) {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    onNavigate('panorama');
  };

  return (
    <div className="h-16 bg-[#1a1a2e] flex items-center justify-between px-8 shadow-lg">
      <h1 className="text-white text-xl font-bold tracking-wider">
        MDRRMO PIO DURAN MAP DIRECTORY
      </h1>
      
      {user ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
            <User className="w-5 h-5 text-white" />
            <span className="text-white text-sm font-medium truncate max-w-[200px]">{user.email}</span>
          </div>
          
          <button
            onClick={() => onNavigate('admin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeView === 'admin'
                ? 'bg-white text-[#1a1a2e] shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Admin Panel</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/80 text-white font-medium text-sm hover:bg-red-500 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      ) : (
        <button
          onClick={() => onNavigate('login')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 text-white font-medium text-sm hover:bg-white/30 transition-all"
        >
          <User className="w-5 h-5" />
          <span className="hidden sm:inline">Login</span>
        </button>
      )}
    </div>
  );
}
