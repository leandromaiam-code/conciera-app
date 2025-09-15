import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Search, Filter, Instagram, Phone, Mail, Calendar } from "lucide-react";
import { useState } from "react";

interface Conversa {
  id: string;
  paciente_nome: string;
  canal: 'instagram' | 'whatsapp' | 'email' | 'telefone';
  status: 'ativo' | 'agendado' | 'perdido' | 'nutrição';
  ultima_mensagem: string;
  data_inicio: string;
  temperatura: 1 | 2 | 3;
  procedimento_interesse?: string;
  valor_estimado?: number;
}

const conversas: Conversa[] = [
  {
    id: "1",
    paciente_nome: "Maria Silva",
    canal: "instagram",
    status: "agendado",
    ultima_mensagem: "Perfeito! Confirmo o agendamento para amanhã às 14:30. Muito obrigada!",
    data_inicio: "2024-01-15",
    temperatura: 3,
    procedimento_interesse: "Harmonização Facial",
    valor_estimado: 2800
  },
  {
    id: "2", 
    paciente_nome: "João Santos",
    canal: "whatsapp",
    status: "ativo",
    ultima_mensagem: "Gostaria de saber mais sobre os valores do implante capilar...",
    data_inicio: "2024-01-14",
    temperatura: 2,
    procedimento_interesse: "Implante Capilar",
    valor_estimado: 8500
  },
  {
    id: "3",
    paciente_nome: "Ana Costa", 
    canal: "instagram",
    status: "nutrição",
    ultima_mensagem: "Ainda estou pensando... vocês têm desconto para pagamento à vista?",
    data_inicio: "2024-01-12",
    temperatura: 2,
    procedimento_interesse: "Rinoplastia",
    valor_estimado: 12000
  },
  {
    id: "4",
    paciente_nome: "Carlos Lima",
    canal: "whatsapp", 
    status: "perdido",
    ultima_mensagem: "Obrigado pelas informações. Vou pesquisar mais e retorno.",
    data_inicio: "2024-01-10",
    temperatura: 1,
    procedimento_interesse: "Lipo HD"
  }
];

const getChannelIcon = (canal: string) => {
  switch (canal) {
    case 'instagram': return Instagram;
    case 'whatsapp': return MessageSquare;
    case 'email': return Mail;
    case 'telefone': return Phone;
    default: return MessageSquare;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ativo': return 'bg-esmeralda text-white';
    case 'agendado': return 'bg-dourado text-onyx';
    case 'nutrição': return 'bg-blue-500 text-white';
    case 'perdido': return 'bg-red-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const TemperatureIndicator = ({ temperatura }: { temperatura: 1 | 2 | 3 }) => (
  <div className="flex gap-1">
    {[1, 2, 3].map(level => (
      <div
        key={level}
        className={`w-2 h-2 rounded-full ${
          level <= temperatura ? 'bg-dourado' : 'bg-cinza-claro'
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
    const matchesSearch = conversa.paciente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversa.procedimento_interesse?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "todos" || conversa.status === filterStatus;
    const matchesCanal = filterCanal === "todos" || conversa.canal === filterCanal;
    
    return matchesSearch && matchesStatus && matchesCanal;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-onyx">Histórico de Conversas</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-grafite" />
              <Input
                placeholder="Buscar por nome ou procedimento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="agendado">Agendado</SelectItem>
                <SelectItem value="nutrição">Nutrição</SelectItem>
                <SelectItem value="perdido">Perdido</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCanal} onValueChange={setFilterCanal}>
              <SelectTrigger>
                <SelectValue placeholder="Canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Canais</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="telefone">Telefone</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <div className="space-y-4">
        {filteredConversas.map((conversa) => {
          const ChannelIcon = getChannelIcon(conversa.canal);
          
          return (
            <Card key={conversa.id} className="cursor-pointer hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Channel Icon */}
                    <div className="p-2 rounded-lg bg-cinza-claro/20">
                      <ChannelIcon className="w-5 h-5 text-grafite" />
                    </div>

                    {/* Conversation Info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-onyx">{conversa.paciente_nome}</h3>
                        <TemperatureIndicator temperatura={conversa.temperatura} />
                        <Badge className={getStatusColor(conversa.status)}>
                          {conversa.status.charAt(0).toUpperCase() + conversa.status.slice(1)}
                        </Badge>
                      </div>

                      {conversa.procedimento_interesse && (
                        <p className="text-dourado font-medium">
                          Interesse: {conversa.procedimento_interesse}
                        </p>
                      )}

                      <p className="text-grafite text-sm line-clamp-2">
                        {conversa.ultima_mensagem}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-grafite">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(conversa.data_inicio).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="capitalize">
                          via {conversa.canal}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Value and Actions */}
                  <div className="flex flex-col items-end gap-2">
                    {conversa.valor_estimado && (
                      <p className="text-dourado font-semibold text-sm">
                        R$ {conversa.valor_estimado.toLocaleString()}
                      </p>
                    )}
                    
                    <Button size="sm" variant="outline">
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