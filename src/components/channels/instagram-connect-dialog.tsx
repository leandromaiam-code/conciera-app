import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Instagram } from "lucide-react";

interface InstagramConnectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstagramConnectDialog = ({ isOpen, onClose }: InstagramConnectDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-2">
            <Button 
              onClick={onClose} 
              variant="ghost" 
              size="sm"
              className="p-0 h-auto hover:bg-transparent"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <DialogTitle>Conectar Instagram</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center">
              <Instagram className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">Conecte seu Instagram</h3>
            <p className="text-sm text-muted-foreground">
              A integração com Instagram estará disponível em breve. 
              Você poderá gerenciar suas mensagens diretas e automatizar respostas.
            </p>
          </div>

          <Button 
            disabled
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          >
            Login with Instagram (Em breve)
          </Button>

          <div className="text-center">
            <Button 
              onClick={onClose}
              variant="ghost"
              className="text-sm"
            >
              Voltar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
