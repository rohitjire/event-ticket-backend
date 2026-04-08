import { useAuth } from "react-oidc-context";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Home, LogOut, QrCode } from "lucide-react";
import { useRoles } from "@/hooks/use-roles";
import { Link } from "react-router";

const NavBar: React.FC = () => {
  const { user, signoutRedirect } = useAuth();
  const { isOrganizer, isStaff } = useRoles();

  return (
    <div className="bg-gray-950/80 backdrop-blur-md border-b border-gray-800 text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          <div className="flex gap-8 items-center">
            <Link to="/" className="text-lg font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              EventTix
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
                <Home className="h-4 w-4" />
                Home
              </Link>
              {isOrganizer && (
                <Link to="/dashboard/events" className="text-gray-400 hover:text-white transition-colors">
                  Events
                </Link>
              )}
              <Link to="/dashboard/tickets" className="text-gray-400 hover:text-white transition-colors">
                Tickets
              </Link>
              {isStaff && (
                <Link to="/dashboard/validate-qr" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <QrCode className="h-4 w-4" />
                  Validate
                </Link>
              )}
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              <Avatar className="h-8 w-8 border border-gray-700 hover:border-purple-500 transition-colors">
                <AvatarFallback className="bg-gray-800 text-sm">
                  {user?.profile?.preferred_username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-gray-900 border-gray-700 text-white"
              align="end"
            >
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium">
                  {user?.profile?.preferred_username}
                </p>
                <p className="text-xs text-gray-400">{user?.profile?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem
                className="hover:bg-gray-800 cursor-pointer"
                onClick={() => signoutRedirect()}
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
