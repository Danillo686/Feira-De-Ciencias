# 🔥 Configuração do Firebase — Ranking Global

## Por que Firebase?

O ranking agora é **global e em tempo real** — qualquer pessoa que acesse o site
(celular, PC, outro dispositivo) vê os mesmos dados. Para isso funcionar, você
precisa configurar um projeto gratuito no Firebase.

---

## Passo a Passo

### 1. Criar o Projeto Firebase

1. Acesse [https://console.firebase.google.com](https://console.firebase.google.com)
2. Clique em **"Adicionar projeto"**
3. Nomeie o projeto (ex: `feira-ia-2025`)
4. Desative o Google Analytics (opcional)
5. Clique em **"Criar projeto"**

---

### 2. Ativar o Realtime Database

1. No painel do projeto, vá em **"Build" → "Realtime Database"**
2. Clique em **"Criar banco de dados"**
3. Selecione uma localização (ex: `us-central1`)
4. Escolha **"Iniciar no modo de teste"** (permite leitura e escrita por 30 dias)
5. Clique em **"Ativar"**

> ⚠️ **Depois de 30 dias**, você precisará configurar regras de segurança.
> Para a Feira de Ciências, o modo de teste é suficiente.

---

### 3. Obter as Credenciais

1. Vá em **Configurações do projeto** (ícone de engrenagem ⚙️)
2. Na seção **"Seus aplicativos"**, clique em **"</>** (Web)"
3. Registre o app com um apelido (ex: `feira-web`)
4. Copie o objeto `firebaseConfig` que aparece

---

### 4. Atualizar o arquivo `src/firebase.js`

Abra o arquivo `src/firebase.js` e substitua o bloco `firebaseConfig` pelos seus dados reais:

```js
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  databaseURL: "https://SEU_PROJETO-default-rtdb.firebaseio.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

---

### 5. Regras de Segurança (Recomendado)

No Firebase Console → Realtime Database → **Regras**, cole:

```json
{
  "rules": {
    "rankings": {
      ".read": true,
      ".write": true
    }
  }
}
```

---

## Sem Firebase (Fallback)

Se o Firebase **não estiver configurado**, o site funciona normalmente com
`localStorage` como fallback — mas o ranking fica apenas local no dispositivo.

---

## Estrutura dos Dados no Firebase

```
rankings/
  quiz_easy/
    eduardo_201adm/
      name: "Eduardo"
      turma: "201-Adm"
      score: 9
      timeSpent: 87
      date: "2025-06-01T..."
  quiz_medium/
  quiz_hard/
  memory/
  scenarios/
```
