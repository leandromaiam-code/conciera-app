import { useState, useEffect } from "react";
import { Search, Calendar, BarChart3, MessageSquare, BookOpen, Settings, LayoutDashboard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
  category: string;
}

interface CommandSearchProps {
  onPageChange: (page: string) => void;
}

export const CommandSearch = ({ onPageChange }: CommandSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchItems: SearchItem[] = [
    {
      id: "dashboard",
      title: "Dashboard Omnichannel",
      description: "Visão geral dos canais e métricas",
      icon: LayoutDashboard,
      action: () => onPageChange("dashboard"),
      category: "Navegação"
    },
    {
      id: "agenda",
      title: "Controle de Agendamentos",
      description: "Gerenciar consultas e horários",
      icon: Calendar,
      action: () => onPageChange("agenda"),
      category: "Navegação"
    },
    {
      id: "analytics",
      title: "Analytics e Relatórios",
      description: "Métricas detalhadas e insights",
      icon: BarChart3,
      action: () => onPageChange("analytics"),
      category: "Navegação"
    },
    {
      id: "conversas",
      title: "Histórico de Conversas",
      description: "Todas as interações dos pacientes",
      icon: MessageSquare,
      action: () => onPageChange("conversas"),
      category: "Navegação"
    },
    {
      id: "playbooks",
      title: "Gestão de Playbooks",
      description: "Automações e fluxos de atendimento",
      icon: BookOpen,
      action: () => onPageChange("playbooks"),
      category: "Navegação"
    },
    {
      id: "configuracoes",
      title: "Configurações do Sistema",
      description: "Ajustes de canais e inteligência artificial",
      icon: Settings,
      action: () => onPageChange("configuracoes"),
      category: "Navegação"
    }
  ];

  const filteredItems = searchItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsOpen(true);
      }
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleItemSelect = (item: SearchItem) => {
    item.action();
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="relative w-full max-w-sm justify-start text-muted-foreground transition-elegant hover-elevate"
        >
          <Search className="mr-2 h-4 w-4" />
          <span>Buscar...</span>
          <kbd className="pointer-events-none absolute right-2 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="p-0 shadow-lg max-w-2xl animate-fade-in">
        <div className="border-b border-border">
          <div className="flex items-center px-4">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Digite para buscar páginas, funcionalidades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 bg-transparent p-4 text-base focus-visible:ring-0"
              autoFocus
            />
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {filteredItems.length > 0 ? (
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                Sugestões
              </div>
              {filteredItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemSelect(item)}
                    className="w-full flex items-center gap-3 px-2 py-2.5 text-left rounded-lg hover:bg-accent hover:text-accent-foreground transition-elegant"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-muted">
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                      {item.category}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <div className="text-sm">Nenhum resultado encontrado</div>
              <div className="text-xs mt-1">
                Tente buscar por "dashboard", "agenda" ou "configurações"
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};