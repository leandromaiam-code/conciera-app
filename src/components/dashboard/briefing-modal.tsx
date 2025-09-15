import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Heart, Target, Lightbulb, Clock } from "lucide-react";
import { OpportunityBriefing } from "@/types/briefing-types";

interface BriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  briefing?: OpportunityBriefing;
}

/**
 * Modal de Briefing Inteligente
 * Apresenta insights de IA sobre pacientes e oportunidades
 */
export const BriefingModal = ({ isOpen, onClose, briefing }: BriefingModalProps) => {
  if (!briefing) return null;

  const getTemperaturaColor = (temp: 1 | 2 | 3) => {
    switch (temp) {
      case 3: return "bg-esmeralda text-branco-puro";
      case 2: return "bg-dourado text-onyx";
      case 1: return "bg-grafite text-branco-puro";
    }
  };

  const getTemperaturaLabel = (temp: 1 | 2 | 3) => {
    switch (temp) {
      case 3: return "Lead Quente";
      case 2: return "Lead Morno";
      case 1: return "Lead Frio";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Briefing de Oportunidade</span>
            <Badge className={getTemperaturaColor(briefing.temperatura_lead)}>
              {getTemperaturaLabel(briefing.temperatura_lead)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-lg">
          {/* Paciente Info */}
          <div className="flex items-center gap-md p-md bg-marfim rounded-lg">
            <div className="w-12 h-12 bg-dourado rounded-full flex items-center justify-center">
              <User size={24} className="text-onyx" />
            </div>
            <div>
              <h3 className="font-semibold text-onyx">{briefing.paciente_nome}</h3>
              <p className="text-sm text-grafite">{briefing.procedimento_interesse}</p>
              <div className="flex items-center gap-xxs text-xs text-grafite mt-xxs">
                <Clock size={12} />
                <span>{new Date(briefing.agendamento_datetime).toLocaleString('pt-BR')}</span>
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm text-grafite">Valor Estimado</p>
              <p className="text-xl font-bold text-dourado font-playfair">
                R$ {briefing.valor_estimado.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Abordagem Recomendada - DESTAQUE PRINCIPAL */}
          <div className="bg-gradient-to-br from-dourado/10 to-transparent p-md rounded-lg border border-dourado/30">
            <div className="flex items-center gap-sm mb-sm">
              <Lightbulb className="text-dourado" size={20} />
              <h3 className="font-semibold text-onyx">Abordagem Recomendada</h3>
            </div>
            <div className="text-onyx leading-relaxed bg-branco-puro p-sm rounded border">
              {briefing.abordagem_recomendada}
            </div>
          </div>

          {/* Resumo da Conversa */}
          <div>
            <h3 className="font-semibold text-onyx mb-sm flex items-center gap-sm">
              <Target size={16} className="text-grafite" />
              Resumo da Conversa
            </h3>
            <p className="text-grafite leading-relaxed bg-cinza-fundo-hover p-sm rounded">
              {briefing.resumo_conversa}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {/* Perfil do Paciente */}
            <div>
              <h3 className="font-semibold text-onyx mb-sm flex items-center gap-sm">
                <User size={16} className="text-grafite" />
                Perfil do Paciente
              </h3>
              <div className="space-y-xxs">
                {briefing.perfil_paciente.map((tag, index) => (
                  <Badge key={index} variant="outline" className="mr-xxs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Pontos de Dor */}
            <div>
              <h3 className="font-semibold text-onyx mb-sm flex items-center gap-sm">
                <Heart size={16} className="text-erro" />
                Pontos de Dor
              </h3>
              <ul className="space-y-xxs">
                {briefing.pontos_de_dor.map((ponto, index) => (
                  <li key={index} className="text-sm text-grafite flex items-start gap-xxs">
                    <span className="text-erro mt-1">•</span>
                    <span>{ponto}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Desejos e Referências */}
          <div>
            <h3 className="font-semibold text-onyx mb-sm">Desejos e Referências</h3>
            <div className="bg-esmeralda/5 p-sm rounded border border-esmeralda/20">
              <ul className="space-y-xxs">
                {briefing.desejos_e_referencias.map((desejo, index) => (
                  <li key={index} className="text-sm text-grafite flex items-start gap-xxs">
                    <span className="text-esmeralda mt-1">✓</span>
                    <span>{desejo}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-sm pt-md border-t border-cinza-borda">
            <Button className="flex-1 bg-onyx text-branco-puro hover:bg-grafite">
              Marcar como Preparado
            </Button>
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};