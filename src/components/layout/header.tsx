'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LogOut, LogIn, Key } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
// import { Button } from '../ui';
import { ThemeSwitch } from '@/components/elements/theme-switch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
// import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { UserStatus } from '../elements/userpopover';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  
  const pathname = usePathname();
  // const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Close menu when path changes
  useEffect(() => {
    closeMenu();
  }, [pathname]);

  // Handle logout
  const handleLogout = () => {
    // dispatch(logout());
    closeMenu();
  };

  

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
        >
          NextAuth
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
         

        
        </nav>

        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <UserStatus />
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <Link
              href="/"
              className={cn(
                'flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-primary',
                pathname === '/' ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Home
            </Link>

            {session ? (
              <>
                <Link
                  href="/profile"
                  className={cn(
                    'flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-primary',
                    pathname === '/profile' ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <Button
                  variant="ghost"
                  className="flex items-center justify-start gap-2 py-2 h-9 text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={cn(
                    'flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-primary',
                    pathname === '/login' ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/auth/register"
                  className={cn(
                    'flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-primary',
                    pathname === '/register' ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <User className="h-4 w-4" />
                  <span>Register</span>
                </Link>
                <Link
                  href="/auth/forgot-password"
                  className={cn(
                    'flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-primary',
                    pathname === '/forgot-password' ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <Key className="h-4 w-4" />
                  <span>Forgot Password</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}