import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AgendaConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentType?: "conciera" | "google";
  isGoogleConnected?: boolean;
  onSave: (type: "conciera" | "google") => Promise<void>;
  onGoogleConnect: () => void;
}

export const AgendaConfigDialog = ({
  isOpen,
  onClose,
  currentType = "conciera",
  isGoogleConnected = false,
  onSave,
  onGoogleConnect,
}: AgendaConfigDialogProps) => {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<"conciera" | "google">(currentType);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelectedType(currentType);
  }, [currentType, isOpen]);

  const handleSave = async () => {
    if (selectedType === "google" && !isGoogleConnected) {
      toast({
        title: "Atenção",
        description: "Por favor, conecte com o Google Calendar primeiro",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      await onSave(selectedType);
      toast({
        title: "Sucesso",
        description: `Agenda base configurada para ${selectedType === "conciera" ? "Conciera" : "Google Calendar"}!`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar configuração de agenda",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Agenda Base</DialogTitle>
          <DialogDescription>
            Escolha qual agenda será usada para o auto-agendamento
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <RadioGroup value={selectedType} onValueChange={(value) => setSelectedType(value as "conciera" | "google")}>
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
              <RadioGroupItem value="conciera" id="conciera" />
              <Label htmlFor="conciera" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-medium">Agenda Conciera</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Use a agenda nativa do Conciera
                </p>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
              <RadioGroupItem value="google" id="google" disabled={!isGoogleConnected} />
              <Label htmlFor="google" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Google Calendar</span>
                  {isGoogleConnected && (
                    <Badge variant="outline" className="ml-auto">
                      <Check className="w-3 h-3 mr-1" />
                      Conectado
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Sincronize com seu Google Calendar
                </p>
              </Label>
            </div>
          </RadioGroup>

          {selectedType === "google" && !isGoogleConnected && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100 mb-3">
                Para usar o Google Calendar, você precisa conectar sua conta primeiro
              </p>
              <Button 
                onClick={onGoogleConnect}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Conectar com Google
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving || (selectedType === "google" && !isGoogleConnected)}>
            {saving ? "Salvando..." : "Salvar Configuração"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};