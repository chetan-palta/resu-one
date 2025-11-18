import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileText, LogOut, User } from "lucide-react";

interface HeaderProps {
  user?: { name: string; email: string } | null;
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const [location] = useLocation();

  if (!user) {
    return null;
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" data-testid="link-logo">
            <div className="flex items-center gap-2 cursor-pointer hover-elevate active-elevate-2 px-3 py-2 rounded-md transition-colors">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">ResumeBuilder</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" data-testid="link-dashboard">
              <a
                className={`text-sm font-medium transition-colors hover-elevate px-3 py-2 rounded-md ${
                  location === "/dashboard"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Dashboard
              </a>
            </Link>
            <Link href="/builder/new" data-testid="link-new-resume">
              <a
                className={`text-sm font-medium transition-colors hover-elevate px-3 py-2 rounded-md ${
                  location.startsWith("/builder")
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                New Resume
              </a>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard" data-testid="menu-dashboard">
                <a className="flex items-center w-full cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </a>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="text-destructive focus:text-destructive cursor-pointer"
              data-testid="menu-logout"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
