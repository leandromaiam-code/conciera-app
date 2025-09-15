import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, ChevronDown } from "lucide-react";
import { CommandSearch } from "@/components/ui/command-search";

interface AppHeaderProps {
  pageTitle: string;
  clinicName?: string;
  userName?: string;
  onPageChange: (page: string) => void;
}

export const AppHeader = ({ 
  pageTitle, 
  clinicName = "Clínica Exemplo",
  userName = "Dr. Silva",
  onPageChange
}: AppHeaderProps) => {
  return (
    <header className="fixed top-0 left-20 right-0 h-20 bg-white border-b border-gray-300 z-30 flex items-center justify-between px-16">
      {/* Left Side - Page Title and Search */}
      <div className="flex items-center gap-6">
        <h1 className="text-gray-900 text-3xl font-bold font-serif">{pageTitle}</h1>
        <div className="hidden md:block">
          <CommandSearch onPageChange={onPageChange} />
        </div>
      </div>

      {/* Right Side - Clinic Identity */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
          <Bell size={20} />
        </Button>

        {/* User Profile */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{clinicName}</p>
            <p className="text-xs text-gray-600">{userName}</p>
          </div>
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-yellow-500 text-gray-900 text-sm font-semibold">
              {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <ChevronDown size={16} className="text-gray-600" />
        </div>
      </div>
    </header>
  );
};