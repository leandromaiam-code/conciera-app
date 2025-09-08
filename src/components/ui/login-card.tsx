import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import concieraLogo from "@/assets/conciera-logo.png";

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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-16">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardContent className="p-12">
          <div className="text-center mb-8">
            <img 
              src={concieraLogo} 
              alt="CONCIERA Suite™️" 
              className="mx-auto w-20 h-20 mb-6 object-contain"
            />
            <h1 className="text-gray-900 text-3xl font-bold mb-2 font-serif">Bem-vindo(a)</h1>
            <p className="text-gray-600 text-sm">
              Faça login para acessar a Conciera Suite™️.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-gray-900 font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-lg border-gray-300 bg-white/50 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-gray-900 font-medium">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-lg border-gray-300 bg-white/50 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500"
                placeholder="••••••••"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 mt-8 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};