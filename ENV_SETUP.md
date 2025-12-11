# Configuração de Variáveis de Ambiente

## Passo 1: Obter a Anon Key do Supabase

1. Acesse o dashboard do Supabase: https://supabase.com/dashboard/project/zlpwgnriqabukhgggmis
2. Vá em **Settings** (Configurações) no menu lateral
3. Clique em **API**
4. Na seção **Project API keys**, copie a chave **anon public** (não a service_role!)

## Passo 2: Criar o arquivo .env

Crie um arquivo chamado `.env` na pasta `frontend/` com o seguinte conteúdo:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://zlpwgnriqabukhgggmis.supabase.co
REACT_APP_SUPABASE_ANON_KEY=cole_a_anon_key_aqui

# API Backend
REACT_APP_API_URL=http://localhost:5000/api/v1
```

**Importante:** Substitua `cole_a_anon_key_aqui` pela chave anon que você copiou do Supabase.

## Passo 3: Reiniciar o servidor

Após criar o arquivo `.env`, você precisa **reiniciar o servidor de desenvolvimento**:

1. Pare o servidor (Ctrl+C no terminal)
2. Execute novamente: `npm start`

**Nota:** O React só carrega variáveis de ambiente na inicialização, então é necessário reiniciar após criar ou modificar o `.env`.

## Verificação

Para verificar se está funcionando, abra o console do navegador (F12) e verifique se não há mais o erro "Supabase não configurado".

