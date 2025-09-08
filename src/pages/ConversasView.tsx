import { useState } from "react";
import { Search, Filter, MessageSquare, Phone, Mail, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const conversas = [
  {
    id: 1,
    cliente: "Maria Silva",
    canal: "whatsapp",
    ultimaMensagem: "Obrigada pelo atendimento! Muito satisfeita com o resultado.",
    horario: "15:42",
    status: "resolvido",
    mensagens: 12
  },
  {
    id: 2,
    cliente: "João Santos",
    canal: "telefone",
    ultimaMensagem: "Preciso reagendar minha consulta para a próxima semana.",
    horario: "14:20",
    status: "em-andamento",
    mensagens: 5
  },
  {
    id: 3,
    cliente: "Ana Costa",
    canal: "email",
    ultimaMensagem: "Enviando os documentos solicitados em anexo.",
    horario: "13:15",
    status: "aguardando",
    mensagens: 3
  },
  {
    id: 4,
    cliente: "Pedro Lima",
    canal: "portal",
    ultimaMensagem: "Como faço para acessar meus exames online?",
    horario: "12:30",
    status: "novo",
    mensagens: 1
  },
  {
    id: 5,
    cliente: "Carlos Oliveira",
    canal: "whatsapp",
    ultimaMensagem: "Perfeito! Agendamento confirmado para quinta-feira às 14h.",
    horario: "11:45",
    status: "resolvido",
    mensagens: 8
  }
];

const getChannelIcon = (canal: string) => {
  switch (canal) {
    case "whatsapp": return <MessageSquare className="w-4 h-4 text-green-600" />;
    case "telefone": return <Phone className="w-4 h-4 text-blue-600" />;
    case "email": return <Mail className="w-4 h-4 text-red-600" />;
    case "portal": return <Globe className="w-4 h-4 text-purple-600" />;
    default: return <MessageSquare className="w-4 h-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "resolvido": return "bg-green-100 text-green-800";
    case "em-andamento": return "bg-blue-100 text-blue-800";
    case "aguardando": return "bg-yellow-100 text-yellow-800";
    case "novo": return "bg-purple-100 text-purple-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "resolvido": return "Resolvido";
    case "em-andamento": return "Em Andamento";
    case "aguardando": return "Aguardando";
    case "novo": return "Novo";
    default: return status;
  }
};

export const ConversasView = () => {
  const [selectedConversa, setSelectedConversa] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversas = conversas.filter(conversa =>
    conversa.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversa.ultimaMensagem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex gap-6">
      {/* Left Panel - Conversations List */}
      <div className="w-1/3 space-y-4">
        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" size="sm">Todos</Button>
            <Button variant="outline" size="sm">Novos</Button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredConversas.map((conversa) => (
            <Card
              key={conversa.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversa === conversa.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedConversa(conversa.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getChannelIcon(conversa.canal)}
                  <h4 className="font-medium text-gray-900">{conversa.cliente}</h4>
                </div>
                <div className="text-xs text-gray-500">{conversa.horario}</div>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {conversa.ultimaMensagem}
              </p>
              
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(conversa.status)}>
                  {getStatusLabel(conversa.status)}
                </Badge>
                <div className="flex items-center text-xs text-gray-500">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  {conversa.mensagens}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Panel - Conversation Detail */}
      <div className="flex-1">
        {selectedConversa ? (
          <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {getChannelIcon(conversas.find(c => c.id === selectedConversa)?.canal || '')}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {conversas.find(c => c.id === selectedConversa)?.cliente}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Conversa via {conversas.find(c => c.id === selectedConversa)?.canal}
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(conversas.find(c => c.id === selectedConversa)?.status || '')}>
                {getStatusLabel(conversas.find(c => c.id === selectedConversa)?.status || '')}
              </Badge>
            </div>

            {/* Simulated Chat Messages */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg max-w-xs">
                  <p className="text-sm">Olá! Gostaria de agendar uma consulta.</p>
                  <span className="text-xs text-gray-500">12:15</span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                  <p className="text-sm">Olá! Claro, posso ajudá-lo com isso. Qual especialidade você precisa?</p>
                  <span className="text-xs text-blue-100">12:16</span>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg max-w-xs">
                  <p className="text-sm">Cardiologia, por favor.</p>
                  <span className="text-xs text-gray-500">12:17</span>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                  <p className="text-sm">Perfeito! Temos disponibilidade para esta semana. Prefere manhã ou tarde?</p>
                  <span className="text-xs text-blue-100">12:18</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button size="sm">Responder</Button>
              <Button variant="outline" size="sm">Transferir</Button>
              <Button variant="outline" size="sm">Marcar como Resolvido</Button>
            </div>
          </Card>
        ) : (
          <Card className="p-12 h-full flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecione uma conversa
              </h3>
              <p className="text-gray-600">
                Escolha uma conversa da lista para ver o histórico completo
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};