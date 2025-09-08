import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center animate-fade-in">
        <h1 className="mb-sm text-onyx">404</h1>
        <p className="mb-md text-xl text-grafite">Oops! Página não encontrada</p>
        <Button 
          onClick={() => window.location.href = "/"}
          className="btn-primary"
        >
          Voltar ao Início
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
