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
          <DialogTitle className="text-2xl font-playfair text-gray-900 flex items-center gap-3">
            <User className="text-yellow-600" size={28} />
            Briefing de Oportunidade
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-playfair text-lg text-gray-900 mb-3">{opportunity.patientName}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Procedimento:</span>
                <p className="font-semibold text-gray-900">{opportunity.procedure}</p>
              </div>
              <div>
                <span className="text-gray-600">Agendamento:</span>
                <p className="font-semibold text-gray-900">{formatDateTime(opportunity.scheduledTime)}</p>
              </div>
              <div>
                <span className="text-gray-600">Valor Estimado:</span>
                <p className="font-semibold text-yellow-600 text-lg">{formatCurrency(opportunity.estimatedValue)}</p>
              </div>
              <div>
                <span className="text-gray-600">Temperatura:</span>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3].map((star) => (
                    <div
                      key={star}
                      className={`w-3 h-3 rounded-full ${
                        star <= opportunity.temperature ? 'bg-yellow-600' : 'bg-gray-200'
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
              <User className="text-gray-600" size={18} />
              <h4 className="font-semibold text-gray-900">Resumo da Conversa</h4>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed bg-white p-4 rounded-lg border">
              {opportunity.resumo_conversa}
            </p>
          </div>

          <Separator />

          {/* Perfil do Paciente */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="text-gray-600" size={18} />
              <h4 className="font-semibold text-gray-900">Perfil do Paciente</h4>
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
              <Heart className="text-red-600" size={18} />
              <h4 className="font-semibold text-gray-900">Pontos de Dor Identificados</h4>
            </div>
            <ul className="space-y-2">
              {opportunity.pontos_de_dor.map((ponto, index) => (
                <li key={index} className="text-gray-600 text-sm flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  {ponto}
                </li>
              ))}
            </ul>
          </div>

          {/* Desejos e Referências */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="text-green-600" size={18} />
              <h4 className="font-semibold text-gray-900">Desejos e Referências</h4>
            </div>
            <ul className="space-y-2">
              {opportunity.desejos_e_referencias.map((desejo, index) => (
                <li key={index} className="text-gray-600 text-sm flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  {desejo}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Abordagem Recomendada - DESTAQUE */}
          <div className="bg-gradient-to-r from-yellow-50 to-green-50 p-6 rounded-xl border-2 border-yellow-300">
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-yellow-600" size={20} />
              <h4 className="font-playfair text-xl font-semibold text-gray-900">Abordagem Recomendada</h4>
            </div>
            <p className="text-gray-900 leading-relaxed font-medium">
              {opportunity.abordagem_recomendada}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};