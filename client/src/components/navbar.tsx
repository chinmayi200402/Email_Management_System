import { signOut, auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Mail, BarChart3, LogOut, User, Settings } from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();
  const [location] = useLocation();

  const handleLogout = async () => {
    try {
      if (!auth) {
        console.warn("Authentication service not available");
        return;
      }
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Mail className="text-white text-sm" />
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">Email Management</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/">
                <a className={`${location === '/' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`} data-testid="link-dashboard">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Dashboard
                </a>
              </Link>
              <Link href="/profile">
                <a className={`${location === '/profile' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`} data-testid="link-profile">
                  <Settings className="mr-2 h-4 w-4" />
                  Profile
                </a>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="text-gray-600 text-sm" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700" data-testid="text-user-email">
                {user?.email}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
