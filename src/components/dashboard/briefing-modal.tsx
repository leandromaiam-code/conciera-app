import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Heart, Lightbulb, Target } from "lucide-react";
import { OpportunityBrief } from "@/types/opportunity";

interface BriefingModalProps {
  opportunity: OpportunityBrief | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BriefingModal = ({
  opportunity,
  open,
  onOpenChange
}: BriefingModalProps) => {
  if (!opportunity) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair text-onyx flex items-center gap-3">
            <User className="text-dourado" size={28} />
            Briefing de Oportunidade
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="bg-dourado/5 p-4 rounded-lg border border-dourado/20">
            <h3 className="font-playfair text-lg text-onyx mb-3">{opportunity.patientName}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-grafite">Procedimento:</span>
                <p className="font-semibold text-onyx">{opportunity.procedure}</p>
              </div>
              <div>
                <span className="text-grafite">Agendamento:</span>
                <p className="font-semibold text-onyx">{formatDateTime(opportunity.scheduledTime)}</p>
              </div>
              <div>
                <span className="text-grafite">Valor Estimado:</span>
                <p className="font-semibold text-dourado text-lg">{formatCurrency(opportunity.estimatedValue)}</p>
              </div>
              <div>
                <span className="text-grafite">Temperatura:</span>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3].map((star) => (
                    <div
                      key={star}
                      className={`w-3 h-3 rounded-full ${
                        star <= opportunity.temperature ? 'bg-dourado' : 'bg-cinza-borda'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Resumo da Conversa */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="text-grafite" size={18} />
              <h4 className="font-semibold text-onyx">Resumo da Conversa</h4>
            </div>
            <p className="text-grafite text-sm leading-relaxed bg-branco-puro p-4 rounded-lg border">
              {opportunity.resumo_conversa}
            </p>
          </div>

          <Separator />

          {/* Perfil do Paciente */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="text-grafite" size={18} />
              <h4 className="font-semibold text-onyx">Perfil do Paciente</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {opportunity.perfil_paciente.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Pontos de Dor */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Heart className="text-erro" size={18} />
              <h4 className="font-semibold text-onyx">Pontos de Dor Identificados</h4>
            </div>
            <ul className="space-y-2">
              {opportunity.pontos_de_dor.map((ponto, index) => (
                <li key={index} className="text-grafite text-sm flex items-start gap-2">
                  <span className="text-erro mt-1">•</span>
                  {ponto}
                </li>
              ))}
            </ul>
          </div>

          {/* Desejos e Referências */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="text-esmeralda" size={18} />
              <h4 className="font-semibold text-onyx">Desejos e Referências</h4>
            </div>
            <ul className="space-y-2">
              {opportunity.desejos_e_referencias.map((desejo, index) => (
                <li key={index} className="text-grafite text-sm flex items-start gap-2">
                  <span className="text-esmeralda mt-1">•</span>
                  {desejo}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Abordagem Recomendada - DESTAQUE */}
          <div className="bg-gradient-to-r from-dourado/10 to-esmeralda/10 p-6 rounded-xl border-2 border-dourado/30">
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-dourado" size={20} />
              <h4 className="font-playfair text-xl font-semibold text-onyx">Abordagem Recomendada</h4>
            </div>
            <p className="text-onyx leading-relaxed font-medium">
              {opportunity.abordagem_recomendada}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};