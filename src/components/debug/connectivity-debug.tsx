import { useConnectivityTest } from "@/hooks/use-connectivity-test";
import { useCoreAgendamentosSimple } from "@/hooks/use-core-agendamentos-simple";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const ConnectivityDebug = () => {
  const connectivityStatus = useConnectivityTest();
  const { agendamentos, loading, error } = useCoreAgendamentosSimple();

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>🔍 Diagnóstico de Conectividade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <Badge variant={connectivityStatus.auth ? "default" : "destructive"}>
                {connectivityStatus.auth ? "✅ Auth OK" : "❌ Auth Fail"}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">Autenticação</p>
            </div>
            
            <div className="text-center">
              <Badge variant={connectivityStatus.basicQuery ? "default" : "destructive"}>
                {connectivityStatus.basicQuery ? "✅ Query OK" : "❌ Query Fail"}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">Query Básica</p>
            </div>
            
            <div className="text-center">
              <Badge variant={connectivityStatus.agendamentosAccess ? "default" : "destructive"}>
                {connectivityStatus.agendamentosAccess ? "✅ RLS OK" : "❌ RLS Fail"}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">Acesso RLS</p>
            </div>
          </div>

          {connectivityStatus.error && (
            <div className="p-3 bg-destructive/10 rounded-md">
              <p className="text-sm text-destructive font-medium">Erro:</p>
              <p className="text-sm text-destructive">{connectivityStatus.error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📊 Teste de Query Simplificada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={loading ? "secondary" : "default"}>
                {loading ? "🔄 Carregando..." : "✅ Concluído"}
              </Badge>
            </div>
            
            {error && (
              <div className="p-3 bg-destructive/10 rounded-md">
                <p className="text-sm text-destructive font-medium">Erro na Query:</p>
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            
            {!error && !loading && (
              <div className="p-3 bg-green-50 rounded-md">
                <p className="text-sm text-green-700 font-medium">
                  ✅ Query funcionou! Encontrados {agendamentos.length} agendamentos
                </p>
                {agendamentos.length > 0 && (
                  <div className="mt-2 text-xs text-green-600">
                    <p>Primeiro agendamento: {JSON.stringify(agendamentos[0], null, 2)}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};