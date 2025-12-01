import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, User, ArrowLeft, LogIn } from "lucide-react";

interface LoginPageProps {
  onLogin?: () => void;
  onNavigate?: (view: string) => void;
}

export default function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [content, setContent] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("Secure Login");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        // Use relative URL to fetch from the backend API
        const res = await fetch("/api/page?type=login");
        if (res.ok) {
          const data = await res.json();
          setTitle(data.page.title);
          setContent(data.page.content);
        } else {
          const errorData = await res.json().catch(() => ({}));
          console.error("Failed to load from database:", errorData);
          setContent(
            "Failed to load login content from database. Please contact administrator.",
          );
        }
      } catch (err) {
        console.error("Error fetching login page from Supabase:", err);
        setContent(
          "Unable to connect to database. Please check your connection and try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Please enter your username");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    // Store remember me preference
    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
      localStorage.setItem("username", username);
    } else {
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("username");
    }
    
    // Navigate to auth page for proper Supabase authentication
    onLogin?.();
    onNavigate?.("login");
  };

  // Load saved username if remember me was checked
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const remember = localStorage.getItem("rememberMe");
    if (savedUsername && remember) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/50">
        <div className="text-center mb-8">
          <div className="mx-auto bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600">Access your secure dashboard</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-8">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading secure content...</p>
          </div>
        ) : (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm whitespace-pre-wrap">
                {content}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 border border-red-200">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.("panorama")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg shadow transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Secure Dashboard. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
