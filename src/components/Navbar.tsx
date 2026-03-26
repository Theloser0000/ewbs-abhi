import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Menu, X, LogIn, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAdmin, logout } = useAuth();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/materials', label: 'Materials' },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex flex-col items-start leading-tight">
          <span className="flex items-center gap-2 font-serif text-lg text-foreground">
            <BookOpen className="h-5 w-5 text-primary" />
            StudyShare
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            East West Business School
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button
                variant={location.pathname === link.to ? 'secondary' : 'ghost'}
                size="sm"
              >
                {link.label}
              </Button>
            </Link>
          ))}
          {isAdmin ? (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-muted-foreground">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <LogIn className="h-4 w-4" />
                Admin Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-card px-4 pb-4 pt-2 md:hidden animate-fade-in">
          {links.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
              <Button
                variant={location.pathname === link.to ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                {link.label}
              </Button>
            </Link>
          ))}
          {isAdmin ? (
            <Button variant="ghost" className="w-full justify-start gap-1.5 text-muted-foreground" onClick={() => { handleLogout(); setMobileOpen(false); }}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-1.5">
                <LogIn className="h-4 w-4" />
                Admin Login
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
