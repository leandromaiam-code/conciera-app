import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const InstagramCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Pega os parâmetros da URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const state = params.get("state");
        const error = params.get("error");
        const errorDescription = params.get("error_description");

        // Se o usuário negou a autorização
        if (error) {
          toast({
            title: "Conexão cancelada",
            description: errorDescription || "Você cancelou a conexão com Instagram.",
            variant: "destructive",
          });
          navigate("/?page=configuracoes");
          return;
        }

        // Valida o state (segurança contra CSRF)
        const savedState = localStorage.getItem("instagram_oauth_state");
        const timestamp = localStorage.getItem("instagram_oauth_timestamp");

        if (!savedState || state !== savedState) {
          toast({
            title: "Erro de segurança",
            description: "Token de segurança inválido. Tente novamente.",
            variant: "destructive",
          });
          navigate("/?page=configuracoes");
          return;
        }

        // Verifica se o state não expirou (10 minutos)
        if (timestamp && Date.now() - parseInt(timestamp) > 600000) {
          toast({
            title: "Sessão expirada",
            description: "A sessão de autorização expirou. Tente novamente.",
            variant: "destructive",
          });
          navigate("/?page=configuracoes");
          return;
        }

        // Limpa o state do localStorage
        localStorage.removeItem("instagram_oauth_state");
        localStorage.removeItem("instagram_oauth_timestamp");

        if (!code) {
          throw new Error("Código de autorização não recebido");
        }

        // Buscar empresa_id do usuário logado
        const { data: { user } } = await supabase.auth.getUser();
        let empresaId: number | null = null;
        
        if (user) {
          const { data: userData } = await supabase
            .from("core_users")
            .select("empresa_id")
            .eq("auth_id", user.id)
            .maybeSingle();
          
          empresaId = userData?.empresa_id || null;
        }

        // Envia o code para seu backend
        const response = await fetch("https://n8n-n8n.ajpgd7.easypanel.host/webhook/conciera_ai_conexao_insta", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            code,
            empresa_id: empresaId
          }),
        });

        if (!response.ok) {
          throw new Error("Erro ao processar autorização");
        }

        const data = await response.json();

        toast({
          title: "Instagram conectado!",
          description: "Sua conta do Instagram foi conectada com sucesso.",
        });

        navigate("/?page=configuracoes");
      } catch (error) {
        console.error("Erro no callback do Instagram:", error);
        toast({
          title: "Erro ao conectar",
          description: "Ocorreu um erro ao conectar sua conta. Tente novamente.",
          variant: "destructive",
        });
        navigate("/?page=configuracoes");
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      <p className="mt-4 text-muted-foreground">Conectando seu Instagram...</p>
    </div>
  );
};
