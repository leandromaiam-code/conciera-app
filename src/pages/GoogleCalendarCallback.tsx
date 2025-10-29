import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GoogleCalendarCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processando conexão com Google Calendar...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");

        if (error) {
          setStatus("error");
          setMessage("Acesso negado. Por favor, tente novamente.");
          return;
        }

        if (!code) {
          setStatus("error");
          setMessage("Código de autorização não encontrado.");
          return;
        }

        // TODO: Implementar chamada para edge function que processa o OAuth
        // const response = await supabase.functions.invoke('google-calendar-oauth', {
        //   body: { code }
        // });

        // Por enquanto, simular sucesso
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setStatus("success");
        setMessage("Google Calendar conectado com sucesso!");
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);

      } catch (error) {
        console.error("Error handling Google Calendar callback:", error);
        setStatus("error");
        setMessage("Erro ao processar conexão. Por favor, tente novamente.");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === "loading" && <Loader2 className="w-16 h-16 animate-spin text-primary" />}
            {status === "success" && <CheckCircle className="w-16 h-16 text-green-500" />}
            {status === "error" && <XCircle className="w-16 h-16 text-destructive" />}
          </div>
          <CardTitle>
            {status === "loading" && "Conectando..."}
            {status === "success" && "Sucesso!"}
            {status === "error" && "Erro"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        
        {status === "error" && (
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate("/", { replace: true })}>
              Voltar para Configurações
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}