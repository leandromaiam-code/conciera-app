// src/pages/Auth.tsx

// ... (toda a sua lógica de imports, state e funções permanece a mesma) ...

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      
      {/* --- ALTERAÇÃO APLICADA AQUI --- */}
      {/* Coluna da Esquerda: A Imagem de Fundo com Overlay */}
      {/* Aplicamos a imagem de fundo diretamente neste div, que é a coluna do grid. */}
      <div 
        className="relative hidden lg:block bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBackground})` }}
      >
        {/* Overlay branco muito transparente */}
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {/* Coluna da Direita: O Formulário de Login */}
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 items-center text-center">
            <div className="mb-4">
              <img 
                src={concieraLogo} 
                alt="CONCIERA Logo" 
                className="w-32 h-auto mx-auto"
              />
            </div>
            <CardTitle className="text-2xl">
              {isLogin ? 'Bem-vindo(a) de volta' : 'Crie a sua Conta'}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Aceda à sua suite de inteligência de receita'
                : 'Comece a transformar atendimento em resultado'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    disabled={loading}
                    required={!isLogin}
                    className="placeholder:text-gray-500" 
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading}
                  required
                  className="placeholder:text-gray-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={loading}
                  required
                  className="placeholder:text-gray-500"
                />
              </div>

              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-dourado text-onyx hover:bg-dourado/90"
                disabled={loading}
              >
                {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors([]);
                  setFormData({ email: '', password: '', nome: '' });
                }}
                disabled={loading}
                className="text-grafite hover:text-onyx"
              >
                {isLogin 
                  ? 'Não tem uma conta? Criar conta'
                  : 'Já tem uma conta? Fazer login'
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};