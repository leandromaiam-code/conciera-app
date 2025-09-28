import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import concieraLogo from "@/assets/Black White transparente.png";

interface LoginCardProps {
  onLogin: () => void;
}

export const LoginCard = ({ onLogin }: LoginCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-onyx flex items-center justify-center p-xxl animate-fade-in">
      <Card className="w-full max-w-md">
        <CardContent className="p-xl">
          <div className="text-center mb-lg">
            <img 
              src={concieraLogo} 
              alt="CONCIERA Suite™️" 
              className="mx-auto w-20 h-20 mb-md object-contain"
            />
            <h1 className="text-onyx mb-xxs">Bem-vindo(a)</h1>
            <p className="text-grafite text-secondary">
              Faça login para acessar a Conciera Suite™️.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-sm">
            <div className="space-y-xxs">
              <Label htmlFor="email" className="text-onyx font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-elegant h-12"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="space-y-xxs">
              <Label htmlFor="password" className="text-onyx font-medium">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-elegant h-12"
                placeholder="••••••••"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="btn-primary w-full h-12 mt-lg"
            >
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};