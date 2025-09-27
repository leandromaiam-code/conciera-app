import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Search, Filter, Instagram, Globe, Mail, Calendar } from "lucide-react";
import { useState } from "react";
import { VConversasDetalhadas } from "@/types/briefing-types";

const conversas: VConversasDetalhadas[] = [
  {
    v_conversas_detalhadas_id: BigInt(1),
    v_conversas_detalhadas_session_id: "conv-001",
    v_conversas_detalhadas_cliente_id: BigInt(1),
    v_conversas_detalhadas_funcionaria_id: 1,
    v_conversas_detalhadas_canal: "instagram",
    v_conversas_detalhadas_status: "novo",
    v_conversas_detalhadas_ultima_mensagem_preview: "Perfeito! Confirmo o agendamento para amanhã às 14:30. Muito obrigada!",
    v_conversas_detalhadas_timestamp_ultima_mensagem: "2024-01-15T14:30:00Z",
    v_conversas_detalhadas_nome_completo: "Maria Silva",
    v_conversas_detalhadas_cliente_telefone: "(11) 99999-1234",
    v_conversas_detalhadas_funcionaria_nome: "Sofia",
    v_conversas_detalhadas_empresa_nome: "Clínica Exemplo",
    v_conversas_detalhadas_contagem_mensagens: 15,
    v_conversas_detalhadas_created_at: "2024-01-15T14:30:00Z",
    ui_temperatura_lead: 3,
    ui_servico_desejado: "Harmonização Facial"
  },
  {
    v_conversas_detalhadas_id: BigInt(2),
    v_conversas_detalhadas_session_id: "conv-002",
    v_conversas_detalhadas_cliente_id: BigInt(2),
    v_conversas_detalhadas_funcionaria_id: 1,
    v_conversas_detalhadas_canal: "whatsapp",
    v_conversas_detalhadas_status: "em-andamento",
    v_conversas_detalhadas_ultima_mensagem_preview: "Gostaria de saber mais sobre os valores do implante capilar...",
    v_conversas_detalhadas_timestamp_ultima_mensagem: "2024-01-14T16:00:00Z",
    v_conversas_detalhadas_nome_completo: "João Santos",
    v_conversas_detalhadas_cliente_telefone: "(11) 99999-5678",
    v_conversas_detalhadas_funcionaria_nome: "Sofia",
    v_conversas_detalhadas_empresa_nome: "Clínica Exemplo",
    v_conversas_detalhadas_contagem_mensagens: 8,
    v_conversas_detalhadas_created_at: "2024-01-14T16:00:00Z",
    ui_temperatura_lead: 2,
    ui_servico_desejado: "Implante Capilar"
  },
  {
    v_conversas_detalhadas_id: BigInt(3),
    v_conversas_detalhadas_session_id: "conv-003",
    v_conversas_detalhadas_cliente_id: BigInt(3),
    v_conversas_detalhadas_funcionaria_id: 1,
    v_conversas_detalhadas_canal: "email",
    v_conversas_detalhadas_status: "aguardando",
    v_conversas_detalhadas_ultima_mensagem_preview: "Ainda estou pensando... vocês têm desconto para pagamento à vista?",
    v_conversas_detalhadas_timestamp_ultima_mensagem: "2024-01-12T10:30:00Z",
    v_conversas_detalhadas_nome_completo: "Ana Costa",
    v_conversas_detalhadas_cliente_telefone: "(11) 99999-9012",
    v_conversas_detalhadas_funcionaria_nome: "Sofia",
    v_conversas_detalhadas_empresa_nome: "Clínica Exemplo",
    v_conversas_detalhadas_contagem_mensagens: 12,
    v_conversas_detalhadas_created_at: "2024-01-12T10:30:00Z",
    ui_temperatura_lead: 2,
    ui_servico_desejado: "Rinoplastia"
  },
  {
    v_conversas_detalhadas_id: BigInt(4),
    v_conversas_detalhadas_session_id: "conv-004",
    v_conversas_detalhadas_cliente_id: BigInt(4),
    v_conversas_detalhadas_funcionaria_id: 1,
    v_conversas_detalhadas_canal: "whatsapp",
    v_conversas_detalhadas_status: "finalizada",
    v_conversas_detalhadas_ultima_mensagem_preview: "Obrigado pelas informações. Vou pesquisar mais e retorno.",
    v_conversas_detalhadas_timestamp_ultima_mensagem: "2024-01-10T14:15:00Z",
    v_conversas_detalhadas_nome_completo: "Carlos Lima",
    v_conversas_detalhadas_cliente_telefone: "(11) 99999-3456",
    v_conversas_detalhadas_funcionaria_nome: "Sofia",
    v_conversas_detalhadas_empresa_nome: "Clínica Exemplo",
    v_conversas_detalhadas_contagem_mensagens: 5,
    v_conversas_detalhadas_created_at: "2024-01-10T14:15:00Z",
    ui_temperatura_lead: 1,
    ui_servico_desejado: "Lipo HD"
  }
];

const getChannelIcon = (canal: string) => {
  switch (canal) {
    case 'instagram': return Instagram;
    case 'whatsapp': return MessageSquare;
    case 'email': return Mail;
    case 'site': return Globe;
    default: return MessageSquare;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'novo': return 'bg-esmeralda text-white';
    case 'em-andamento': return 'bg-dourado text-onyx';
    case 'aguardando': return 'bg-blue-500 text-white';
    case 'finalizada': return 'bg-red-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const TemperatureIndicator = ({ ui_temperatura_lead }: { ui_temperatura_lead: 1 | 2 | 3 }) => (
  <div className="flex gap-1">
    {[1, 2, 3].map(level => (
      <div
        key={level}
        className={`w-2 h-2 rounded-full ${
          level <= ui_temperatura_lead ? 'bg-dourado' : 'bg-cinza-claro'
        }`}
      />
    ))}
  </div>
);

export const ConversasView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterCanal, setFilterCanal] = useState("todos");

  const filteredConversas = conversas.filter(conversa => {
    const matchesSearch = conversa.v_conversas_detalhadas_nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversa.ui_servico_desejado?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "todos" || conversa.v_conversas_detalhadas_status === filterStatus;
    const matchesCanal = filterCanal === "todos" || conversa.v_conversas_detalhadas_canal === filterCanal;
    
    return matchesSearch && matchesStatus && matchesCanal;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button className="bg-dourado text-onyx hover:bg-dourado/90">
          <MessageSquare className="w-4 h-4 mr-2" />
          Nova Conversa
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-grafite" />
              <Input
                id="v-conversas-detalhadas-search"
                placeholder="Buscar por nome ou procedimento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger id="v-conversas-detalhadas-status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="novo">Novo</SelectItem>
                <SelectItem value="em-andamento">Em Andamento</SelectItem>
                <SelectItem value="aguardando">Aguardando</SelectItem>
                <SelectItem value="finalizada">Finalizada</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCanal} onValueChange={setFilterCanal}>
              <SelectTrigger id="v-conversas-detalhadas-canal-filter">
                <SelectValue placeholder="Canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Canais</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="site">Site</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <div className="space-y-4">
        {filteredConversas.map((conversa) => {
          const ChannelIcon = getChannelIcon(conversa.v_conversas_detalhadas_canal);
          
          return (
            <Card key={conversa.v_conversas_detalhadas_id.toString()} className="cursor-pointer hover:shadow-md transition-all">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Channel Icon */}
                    <div className="p-2 rounded-lg bg-cinza-claro/20 flex-shrink-0">
                      <ChannelIcon className="w-4 h-4 sm:w-5 sm:h-5 text-grafite" />
                    </div>

                    {/* Conversation Info */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <h3 className="font-semibold text-onyx text-sm sm:text-base">{conversa.v_conversas_detalhadas_nome_completo}</h3>
                        <div className="flex items-center gap-2">
                          {conversa.ui_temperatura_lead && (
                            <TemperatureIndicator ui_temperatura_lead={conversa.ui_temperatura_lead} />
                          )}
                          <Badge className={`${getStatusColor(conversa.v_conversas_detalhadas_status)} text-xs`}>
                            {conversa.v_conversas_detalhadas_status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </div>
                      </div>

                      {conversa.ui_servico_desejado && (
                        <p className="text-dourado font-medium text-xs sm:text-sm">
                          Interesse: {conversa.ui_servico_desejado}
                        </p>
                      )}

                      <p className="text-grafite text-xs sm:text-sm line-clamp-2">
                        {conversa.v_conversas_detalhadas_ultima_mensagem_preview}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-grafite">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(conversa.v_conversas_detalhadas_created_at).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="capitalize">
                          via {conversa.v_conversas_detalhadas_canal}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row sm:flex-col justify-between sm:items-end gap-2 sm:gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" className="text-xs">
                      Ver Conversa
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredConversas.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-cinza-claro mx-auto mb-4" />
            <p className="text-grafite">Nenhuma conversa encontrada com os filtros selecionados.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};