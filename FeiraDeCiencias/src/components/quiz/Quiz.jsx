import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { playClickSound } from "../../utils/sounds";

// =====================================================
// BANCO DE PERGUNTAS — FÁCIL
// =====================================================
const QUESTIONS_EASY = [
  {
    question: "Siri, Alexa e Google Assistente são exemplos de qual tecnologia de IA?",
    options: [
      "Robôs físicos controlados por controle remoto.",
      "Assistentes virtuais com Processamento de Linguagem Natural (NLP).",
      "Simples buscadores de palavras-chave na internet.",
      "Aplicativos de calendário com lembretes programados."
    ],
    answer: 1,
    explanation: "Esses assistentes usam IA para entender a linguagem humana, interpretar intenções e responder de forma natural — tudo graças ao Processamento de Linguagem Natural (NLP).",
    hints: [
      "Pense em como você conversa com eles usando palavras normais...",
      "Eles precisam 'entender' o que você fala — não apenas palavras-chave.",
      "A tecnologia que faz máquinas entenderem a linguagem humana é chamada de NLP."
    ]
  },
  {
    question: "Quando o Netflix ou YouTube sugere vídeos pra você, qual tecnologia está por trás?",
    options: [
      "Funcionários que assistem seus vídeos e fazem sugestões manualmente.",
      "IA com algoritmos de recomendação baseados no seu histórico.",
      "Um sorteio aleatório entre os vídeos mais assistidos.",
      "Publicidade paga pelos criadores de conteúdo."
    ],
    answer: 1,
    explanation: "Plataformas de streaming usam algoritmos de IA que analisam o que você assiste, por quanto tempo, e o que usuários parecidos com você gostam — para recomendar conteúdo personalizado.",
    hints: [
      "As sugestões são diferentes para cada pessoa...",
      "O algoritmo aprende com o que você assiste e por quanto tempo.",
      "Isso é personalização em escala — impossível sem IA."
    ]
  },
  {
    question: "O que é um 'chatbot'?",
    options: [
      "Um robô físico que conversa presencialmente.",
      "Um programa de IA que simula uma conversa humana por texto ou voz.",
      "Um vírus de computador disfarçado de assistente.",
      "Um chat entre dois humanos moderado por IA."
    ],
    answer: 1,
    explanation: "Chatbots são programas que simulam conversas humanas. Podem ser simples (respostas pré-programadas) ou avançados (usando IA para entender contexto e gerar respostas naturais).",
    hints: [
      "'Chat' significa conversa e 'bot' vem de robô...",
      "Você provavelmente já usou um ao pedir suporte técnico online.",
      "Hoje, ferramentas como o ChatGPT são exemplos avançados de chatbots."
    ]
  },
  {
    question: "Como o celular reconhece seu rosto para ser desbloqueado?",
    options: [
      "Ele memoriza uma foto sua tirada no cadastro e compara pixel por pixel.",
      "Usa biometria com IA de reconhecimento facial por redes neurais.",
      "Um sensor de temperatura identifica o calor do seu rosto.",
      "Um código QR invisível está tatuado na sua testa."
    ],
    answer: 1,
    explanation: "O reconhecimento facial usa redes neurais treinadas com milhares de rostos para identificar características únicas como distância entre olhos, formato do nariz e contorno do rosto.",
    hints: [
      "A tecnologia mapeia pontos do seu rosto...",
      "Ela funciona mesmo com óculos, chapéu ou com a luz ruim.",
      "Isso é possível graças a redes neurais treinadas com milhares de imagens de rostos."
    ]
  },
  {
    question: "Filtros de spam no e-mail (que movem mensagens indesejadas para a lixeira) usam qual recurso de IA?",
    options: [
      "Um banco de dados com todos os e-mails ruins do mundo.",
      "Aprendizado de Máquina para identificar padrões de mensagens indesejadas.",
      "Uma lista manual atualizada por funcionários da empresa.",
      "O próprio usuário que vai marcando cada spam individualmente."
    ],
    answer: 1,
    explanation: "Filtros de spam usam Machine Learning: o algoritmo aprende com exemplos de e-mails spam e normais, identificando padrões como palavras suspeitas, remetentes e estrutura da mensagem.",
    hints: [
      "O filtro fica mais esperto conforme você marca e-mails como spam...",
      "Ele aprende padrões — palavras, remetentes, comportamentos...",
      "Isso é Machine Learning: aprender com exemplos para classificar casos novos."
    ]
  },
  {
    question: "O que significa a sigla 'IA'?",
    options: [
      "Internet Avançada.",
      "Inteligência Artificial.",
      "Informação Automatizada.",
      "Interface Adaptativa."
    ],
    answer: 1,
    explanation: "IA significa Inteligência Artificial — o campo da computação que cria sistemas capazes de realizar tarefas que normalmente exigiriam inteligência humana.",
    hints: [
      "A primeira letra vem de uma palavra que descreve a mente...",
      "A segunda letra descreve algo criado pelo ser humano, não natural.",
      "É a capacidade de máquinas simularem o pensamento e aprendizado humano."
    ]
  },
  {
    question: "Qual é o principal uso da IA no diagnóstico médico atualmente?",
    options: [
      "Substituir completamente os médicos nas consultas.",
      "Analisar imagens médicas (raios-X, ressonâncias) para detectar doenças.",
      "Receitar medicamentos automaticamente sem avaliação humana.",
      "Realizar cirurgias sem a presença de cirurgiões."
    ],
    answer: 1,
    explanation: "A IA já analisa imagens médicas com precisão impressionante, detectando tumores, fraturas e anomalias às vezes antes dos radiologistas. Ela auxilia o médico, não o substitui.",
    hints: [
      "Pense em quais exames médicos geram imagens...",
      "A IA é muito boa em encontrar padrões em imagens grandes e complexas.",
      "Ela detecta sinais de câncer, fraturas e outras doenças em raios-X e ressonâncias."
    ]
  },
  {
    question: "Como os aplicativos de GPS (como Waze e Google Maps) usam IA?",
    options: [
      "Eles não usam IA, apenas mapas estáticos atualizados mensalmente.",
      "Calculam rotas em tempo real usando trânsito, acidentes e padrões históricos.",
      "Um operador humano monitora cada rua e envia atualizações.",
      "Apenas mostram a distância em linha reta entre dois pontos."
    ],
    answer: 1,
    explanation: "Esses apps usam IA para processar dados de trânsito em tempo real, prever congestionamentos baseados em histórico, calcular a rota mais rápida e se adaptar a imprevistos na estrada.",
    hints: [
      "O app sabe quando vai ter trânsito antes mesmo de acontecer...",
      "Ele usa dados de milhões de usuários ao mesmo tempo.",
      "A IA analisa padrões históricos e dados em tempo real para otimizar rotas."
    ]
  },
  {
    question: "O que os filtros de beleza em câmeras de celular usam para suavizar a pele em selfies?",
    options: [
      "Filtros de cor simples aplicados uniformemente na imagem.",
      "Visão Computacional com IA para identificar e modificar partes do rosto.",
      "Um espelho digital que reflete a luz de forma diferente.",
      "A câmera usa uma lente especial que distorce a imagem naturalmente."
    ],
    answer: 1,
    explanation: "Filtros de beleza usam Visão Computacional: a IA detecta o rosto, mapeia pontos específicos (olhos, nariz, pele) e aplica transformações precisas apenas nas áreas identificadas.",
    hints: [
      "O filtro sabe exatamente onde está seu rosto e seus olhos...",
      "Ele modifica partes específicas da imagem — não tudo igualmente.",
      "Isso usa Visão Computacional: IA que 'enxerga' e interpreta imagens."
    ]
  },
  {
    question: "Qual dessas situações é um exemplo real de IA sendo usada no dia a dia?",
    options: [
      "Ligar o ventilador com controle remoto.",
      "O correto ortográfico do celular que aprende seu estilo de escrita.",
      "Um relógio digital que mostra as horas automaticamente.",
      "Uma calculadora que soma números automaticamente."
    ],
    answer: 1,
    explanation: "O teclado do celular usa Machine Learning para aprender suas palavras favoritas, expressões e erros típicos, personalizando as sugestões de texto para você especificamente.",
    hints: [
      "Pense em algo do seu celular que fica mais esperto com o tempo...",
      "Ele aprende as palavras que você mais usa e como você escreve.",
      "O teclado preditivo usa IA para sugerir a próxima palavra baseado no seu histórico."
    ]
  }
];

// =====================================================
// BANCO DE PERGUNTAS — MÉDIO
// =====================================================
const QUESTIONS_MEDIUM = [
  {
    question: "O que é 'Machine Learning' (Aprendizado de Máquina)?",
    options: [
      "Programar uma máquina com todas as regras possíveis manualmente.",
      "Ensinar máquinas a aprender com dados e melhorar sem serem reprogramadas.",
      "Um tipo de hardware especial que pensa como humanos.",
      "Um software que executa tarefas repetitivas mais rapidamente."
    ],
    answer: 1,
    explanation: "Machine Learning é um campo da IA onde sistemas aprendem automaticamente a partir de dados, identificando padrões e melhorando seu desempenho com a experiência — sem programação explícita de cada regra.",
    hints: [
      "O nome já diz: as máquinas 'aprendem'...",
      "Elas aprendem a partir de exemplos, não de regras fixas.",
      "Um modelo de ML melhora sozinho conforme recebe mais dados."
    ]
  },
  {
    question: "O que é 'viés algorítmico' e por que ele é um problema?",
    options: [
      "Quando o algoritmo processa dados mais rápido do que o esperado.",
      "Quando preconceitos dos dados de treino fazem a IA discriminar grupos de pessoas.",
      "Um erro de código que faz o programa travar.",
      "Quando o algoritmo favorece usuários que pagam mais pela plataforma."
    ],
    answer: 1,
    explanation: "Se os dados usados para treinar a IA contêm preconceitos históricos (raciais, de gênero, socioeconômicos), a IA aprende e reproduz esses preconceitos em escala — podendo prejudicar pessoas em decisões de crédito, emprego e justiça.",
    hints: [
      "O viés vem de antes: está nos dados que a IA aprendeu...",
      "Se os dados históricos discriminavam, a IA vai discriminar também.",
      "Isso pode afetar quem recebe empréstimo, emprego ou tratamento justo."
    ]
  },
  {
    question: "O que é 'Processamento de Linguagem Natural' (NLP)?",
    options: [
      "Um método para acelerar o processamento de texto em computadores.",
      "A capacidade da IA de entender, interpretar e gerar linguagem humana.",
      "Um tradutor automático que converte linguagens de programação.",
      "O processo de digitalizar documentos escritos à mão."
    ],
    answer: 1,
    explanation: "NLP (Natural Language Processing) é a área da IA que permite aos computadores entender e gerar linguagem humana — é o que faz chatbots, tradutores automáticos e assistentes de voz funcionarem.",
    hints: [
      "'Natural' aqui significa linguagem humana, não código...",
      "Permite que máquinas entendam o que você escreve ou fala.",
      "ChatGPT, Google Translate e Siri usam NLP."
    ]
  },
  {
    question: "O que é uma 'rede neural artificial'?",
    options: [
      "Uma rede de computadores conectados pela internet.",
      "Um sistema computacional inspirado nos neurônios do cérebro humano.",
      "Um cabo especial que conecta processadores a alta velocidade.",
      "Um método de criptografia de dados em redes sociais."
    ],
    answer: 1,
    explanation: "Redes neurais artificiais são modelos matemáticos inspirados no cérebro: compostos de 'neurônios' artificiais interconectados que processam informações e aprendem a reconhecer padrões complexos.",
    hints: [
      "O nome foi inspirado em algo biológico...",
      "Assim como neurônios no cérebro se conectam, esses 'neurônios' também se conectam.",
      "É a tecnologia base de reconhecimento de imagem, voz e texto."
    ]
  },
  {
    question: "O que é um 'deepfake'?",
    options: [
      "Um arquivo de vídeo de alta resolução gravado em câmera 8K.",
      "Conteúdo falso (vídeo/áudio) gerado por IA que parece real.",
      "Um perfil falso em rede social criado manualmente.",
      "Um tipo de vírus que copia arquivos do computador."
    ],
    answer: 1,
    explanation: "Deepfakes são vídeos ou áudios sintéticos criados por IA que substituem o rosto ou voz de pessoas, podendo parecer extremamente reais. Representam um risco sério para desinformação e fraudes.",
    hints: [
      "'Deep' vem de Deep Learning, a tecnologia usada...",
      "Você já viu vídeos famosos dizendo coisas que nunca disseram?",
      "É conteúdo falso criado por IA que parece real — rosto, voz e tudo."
    ]
  },
  {
    question: "Qual é a diferença entre 'IA Fraca' (Narrow AI) e 'IA Forte' (AGI)?",
    options: [
      "IA Fraca é menos potente em processamento; IA Forte tem mais memória RAM.",
      "IA Fraca é especializada em uma tarefa; IA Forte faria qualquer tarefa intelectual.",
      "IA Fraca usa algoritmos antigos; IA Forte usa apenas deep learning.",
      "IA Fraca funciona offline; IA Forte exige internet constante."
    ],
    answer: 1,
    explanation: "Toda IA atual é 'Fraca' (Narrow): especializada em tarefas específicas como reconhecer faces ou jogar xadrez. AGI (Inteligência Geral Artificial) realizaria qualquer tarefa cognitiva humana — ainda não existe.",
    hints: [
      "Pense em IA que só sabe jogar xadrez vs. uma que sabe tudo...",
      "A IA que usamos hoje é especialista em uma coisa só.",
      "AGI seria como um humano digital capaz de qualquer tarefa — ainda é ficção científica."
    ]
  },
  {
    question: "O que é 'Big Data' e qual sua relação com a IA?",
    options: [
      "Um disco rígido de grande capacidade usado em servidores.",
      "Conjuntos massivos de dados que alimentam e treinam modelos de IA.",
      "Uma linguagem de programação para criar bancos de dados.",
      "Um programa que organiza arquivos automaticamente no computador."
    ],
    answer: 1,
    explanation: "Big Data são volumes enormes de dados (fotos, textos, transações, etc.). A IA precisa de grandes quantidades de dados para aprender. Sem Big Data, modelos modernos como GPT não poderiam existir.",
    hints: [
      "IA aprende com dados — quanto mais, melhor...",
      "'Big' porque é uma quantidade gigantesca de informação.",
      "São esses dados que treinam modelos como o ChatGPT e o Gemini."
    ]
  },
  {
    question: "O que faz uma 'IA Generativa'?",
    options: [
      "Apenas classifica e organiza dados existentes em categorias.",
      "Cria conteúdo novo — textos, imagens, músicas — a partir do que aprendeu.",
      "Gera energia elétrica a partir de processamento computacional.",
      "Detecta e remove conteúdo impróprio de plataformas digitais."
    ],
    answer: 1,
    explanation: "IA Generativa cria conteúdo original: o ChatGPT gera textos, o DALL-E cria imagens, o Suno compõe músicas. Todos aprenderam padrões de dados e agora conseguem criar algo novo.",
    hints: [
      "O nome diz: ela 'gera' algo...",
      "ChatGPT, DALL-E e Midjourney são exemplos.",
      "Ela cria textos, imagens e músicas originais baseando-se no que aprendeu."
    ]
  },
  {
    question: "Como a IA é usada para combater desinformação nas redes sociais?",
    options: [
      "Humanos verificam manualmente cada post publicado nas plataformas.",
      "Algoritmos detectam padrões de fake news e conteúdos suspeitos automaticamente.",
      "A IA bloqueia automaticamente qualquer notícia negativa sobre empresas.",
      "Ela monitora apenas posts com mais de 1 milhão de curtidas."
    ],
    answer: 1,
    explanation: "Plataformas usam IA para detectar desinformação em escala: analisam padrões de espalhamento, comparando com bancos de dados de checagem, velocidade viral e características de conteúdo falso.",
    hints: [
      "É impossível um humano ler todos os posts publicados por segundo...",
      "A IA analisa padrões — como uma notícia se espalha, seu conteúdo...",
      "Ela compara com bases de dados de fake news conhecidas e sinaliza suspeitos."
    ]
  },
  {
    question: "O que é 'automação' no contexto da IA e como ela afeta o emprego?",
    options: [
      "A automação apenas cria novos empregos e nunca elimina nenhum.",
      "IA e robôs podem substituir tarefas repetitivas, mudando o mercado de trabalho.",
      "Automação significa que as pessoas trabalham mais horas por dia.",
      "Só afeta empregos no setor agrícola e nunca em escritórios."
    ],
    answer: 1,
    explanation: "A automação usa IA para realizar tarefas repetitivas e previsíveis. Isso elimina alguns empregos, mas também cria outros (engenheiros de IA, analistas de dados). O desafio é a transição para a nova realidade.",
    hints: [
      "Pense em linhas de produção com robôs...",
      "Tarefas repetitivas são as mais fáceis de automatizar.",
      "É uma transformação: alguns empregos somem, outros surgem — e precisamos nos preparar."
    ]
  }
];

// =====================================================
// BANCO DE PERGUNTAS — DIFÍCIL
// =====================================================
const QUESTIONS_HARD = [
  {
    question: "O que é o conceito de 'Hallucination' em modelos de linguagem (LLMs)?",
    options: [
      "Quando a IA fica sem energia e para de responder.",
      "Quando o modelo gera informações falsas com alta confiança, como se fossem verdadeiras.",
      "Um efeito visual gerado por GPUs potentes.",
      "Um recurso criativo para gerar poesia e arte."
    ],
    answer: 1,
    explanation: "Alucinação é quando modelos como GPT geram respostas plausíveis mas incorretas — um dos maiores desafios de segurança da IA. O modelo não 'sabe' que errou e apresenta o erro com confiança.",
    hints: [
      "O modelo responde com convicção mesmo estando errado...",
      "É como alguém que inventa fatos com total certeza.",
      "LLMs geram texto estatisticamente provável — nem sempre factualmente correto."
    ]
  },
  {
    question: "O que diferencia 'Machine Learning' de 'Deep Learning'?",
    options: [
      "Machine Learning usa regras manuais; Deep Learning não aprende nada.",
      "Deep Learning é uma subcategoria de ML que usa redes neurais artificiais com múltiplas camadas.",
      "Machine Learning é exclusivo para imagens; Deep Learning para textos.",
      "Não há diferença, são sinônimos."
    ],
    answer: 1,
    explanation: "Deep Learning é um subset de Machine Learning que usa redes neurais profundas (muitas camadas) para aprender padrões complexos nos dados sem necessidade de engenharia manual de features.",
    hints: [
      "'Deep' refere-se às camadas profundas da rede neural...",
      "DL é um tipo específico de ML, mais poderoso e que exige mais dados.",
      "É como dizer que um quadrado é um retângulo — DL é um tipo de ML."
    ]
  },
  {
    question: "O que é o 'Teste de Turing' e qual seu objetivo?",
    options: [
      "Medir a velocidade de processamento de uma CPU.",
      "Classificar IAs por nível de segurança cibernética.",
      "Avaliar se uma IA consegue imitar o comportamento humano a ponto de ser indistinguível.",
      "Verificar se um código está livre de bugs."
    ],
    answer: 2,
    explanation: "Proposto por Alan Turing em 1950, o teste avalia se uma máquina pode exibir comportamento inteligente indistinguível de um humano em conversação. É um marco filosófico na história da IA.",
    hints: [
      "Alan Turing propôs em 1950 como definição de inteligência...",
      "Envolve uma conversa onde você tenta descobrir se está falando com humano ou máquina.",
      "Se você não consegue distinguir a IA de um humano, ela 'passa no teste'."
    ]
  },
  {
    question: "O que é 'Viés Algorítmico' e por que é um problema crítico?",
    options: [
      "Quando um algoritmo é mais rápido que outros.",
      "Preferência do algoritmo por dados mais recentes.",
      "Quando padrões discriminatórios nos dados de treino fazem a IA reproduzir preconceitos em escala.",
      "Um erro de cálculo que desacelera o processamento."
    ],
    answer: 2,
    explanation: "Se os dados históricos contêm preconceitos raciais, de gênero ou socioeconômicos, a IA os aprende e amplifica, causando discriminação sistêmica em decisões de crédito, recrutamento e até justiça criminal.",
    hints: [
      "Garbage in, garbage out — se os dados são enviesados...",
      "Um sistema de RH treinado com histórico masculino pode discriminar mulheres.",
      "O algoritmo aprende preconceitos históricos e os aplica em escala massiva."
    ]
  },
  {
    question: "O que é 'Aprendizado por Reforço' (Reinforcement Learning)?",
    options: [
      "Um método onde a IA aprende exclusivamente com humanos supervisionando cada resposta.",
      "A IA aprende por tentativa e erro, recebendo recompensas ou penalidades pelas suas ações.",
      "Um processo de memorizar um banco de dados fixo.",
      "Treinar a IA com imagens de reforços físicos como pesos."
    ],
    answer: 1,
    explanation: "No Aprendizado por Reforço, um agente interage com um ambiente e aprende a maximizar recompensas acumuladas — técnica usada no AlphaGo, em IAs de jogos e em robótica.",
    hints: [
      "Pense em como você treina um cachorro com recompensas...",
      "A IA tenta ações, recebe feedback positivo ou negativo e aprende.",
      "AlphaGo aprendeu a jogar Go assim — jogando milhões de partidas contra si mesmo."
    ]
  },
  {
    question: "Qual foi o impacto da arquitetura 'Transformer' (2017) no campo da IA?",
    options: [
      "Permitiu criar robôs que se transformam como nos desenhos animados.",
      "Revolucionou o Processamento de Linguagem Natural (NLP), sendo a base do GPT, BERT e outros LLMs.",
      "Acelerou exclusivamente o processamento de imagens médicas.",
      "Tornou obsoletos todos os computadores anteriores a 2017."
    ],
    answer: 1,
    explanation: "O artigo 'Attention is All You Need' (2017) introduziu os Transformers com mecanismo de atenção, tornando possível treinar modelos gigantes como GPT-4 e Gemini com performance sem precedentes em NLP.",
    hints: [
      "O artigo se chama 'Attention is All You Need'...",
      "Usou um mecanismo chamado 'atenção' que permite olhar para todas as palavras ao mesmo tempo.",
      "É a fundação do ChatGPT, Gemini, BERT e praticamente todos os LLMs modernos."
    ]
  },
  {
    question: "O que é o 'Problema de Alinhamento' (AI Alignment) em sistemas de IA avançados?",
    options: [
      "Dificuldade em alinhar fisicamente componentes de hardware.",
      "Garantir que os objetivos e comportamentos de uma IA correspondam aos valores e intenções humanas.",
      "Sincronizar múltiplas GPUs para processamento paralelo.",
      "Traduzir código de IA entre linguagens de programação."
    ],
    answer: 1,
    explanation: "Alinhamento é o desafio de fazer com que sistemas de IA poderosos ajam de forma consistente com o que realmente queremos — não apenas com o que especificamos literalmente, prevenindo comportamentos inesperados e perigosos.",
    hints: [
      "E se a IA otimizar algo de uma forma inesperada que nos prejudica?",
      "O problema é que as IAs fazem exatamente o que você diz, não o que você quer.",
      "Como garantir que uma IA superinteligente age segundo nossos valores? Esse é o desafio."
    ]
  },
  {
    question: "O que caracteriza um 'Ataque Adversarial' em sistemas de IA de visão computacional?",
    options: [
      "Quando dois sistemas de IA competem entre si num torneio.",
      "Um ciberataque que desliga fisicamente os servidores de IA.",
      "Pequenas perturbações imperceptíveis ao humano em imagens que fazem a IA classificar erroneamente.",
      "Quando usuários reportam resultados incorretos à empresa."
    ],
    answer: 2,
    explanation: "Ataques adversariais exploram vulnerabilidades de redes neurais: pixels levemente alterados (invisíveis ao humano) podem fazer a IA identificar um stop sign como limite de velocidade — um risco real para carros autônomos.",
    hints: [
      "São mudanças tão pequenas que um humano não percebe...",
      "Mas a IA fica completamente confusa com essas pequenas alterações.",
      "Um adesivo específico numa placa de PARE pode fazer um carro autônomo ignorá-la."
    ]
  },
  {
    question: "Qual princípio ético da IA define que sistemas devem explicar suas decisões de forma compreensível?",
    options: [
      "Princípio da Velocidade Máxima.",
      "Explainability / Interpretabilidade (XAI — Explainable AI).",
      "Princípio da Caixa Preta Definitiva.",
      "Teoria da Redundância Neural."
    ],
    answer: 1,
    explanation: "Explainable AI (XAI) é crucial para confiança e responsabilidade: médicos precisam entender por que a IA diagnosticou câncer, e juízes precisam entender por que ela recomendou uma sentença.",
    hints: [
      "XAI — a sigla em inglês inclui a palavra 'Explainable'...",
      "Se a IA toma uma decisão importante, você precisa saber o porquê.",
      "Sem explicações, como confiar em um diagnóstico médico feito por IA?"
    ]
  },
  {
    question: "Qual foi a contribuição revolucionária do AlphaFold (DeepMind) para a ciência?",
    options: [
      "Criar o primeiro robô capaz de caminhar em terreno irregular.",
      "Prever com precisão atômica a estrutura 3D de proteínas a partir de sequências de aminoácidos.",
      "Desenvolver o primeiro carro autônomo comercial do mundo.",
      "Criar uma IA capaz de compor sinfonias clássicas indistinguíveis de Beethoven."
    ],
    answer: 1,
    explanation: "O AlphaFold 2 resolveu um problema de 50 anos da biologia: prever como proteínas se dobram. Isso acelera enormemente a pesquisa de medicamentos e o entendimento de doenças como Alzheimer e câncer.",
    hints: [
      "Proteínas são fundamentais para a vida — e sua estrutura 3D determina sua função...",
      "Descobrir essa estrutura levava anos de laboratório. A IA faz em horas.",
      "A DeepMind resolveu um dos maiores mistérios da biologia molecular."
    ]
  }
];

const QUESTION_BANKS = {
  easy: QUESTIONS_EASY,
  medium: QUESTIONS_MEDIUM,
  hard: QUESTIONS_HARD,
};

const DIFFICULTY_LABELS = {
  easy: { label: "Fácil", color: "text-emerald-600 dark:text-emerald-400", emoji: "🟢" },
  medium: { label: "Médio", color: "text-amber-600 dark:text-amber-400", emoji: "🟡" },
  hard: { label: "Difícil", color: "text-rose-600 dark:text-rose-400", emoji: "🔴" },
};

const MAX_HINTS = 3;

const Quiz = ({ onComplete, onBack, difficulty = "hard" }) => {
  const questions = QUESTION_BANKS[difficulty] || QUESTIONS_HARD;
  const diffInfo = DIFFICULTY_LABELS[difficulty];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [startTime] = useState(Date.now());
  const [hintsUsed, setHintsUsed] = useState(0);
  const [shownHints, setShownHints] = useState([]);
  const [showHintBox, setShowHintBox] = useState(false);
  const [answered, setAnswered] = useState(false);

  const q = questions[currentQuestion];
  const progress = (currentQuestion / questions.length) * 100;
  const hintsLeft = MAX_HINTS - hintsUsed;

  const handleOptionClick = (index) => {
    if (answered) return;
    playClickSound();
    setSelectedOption(index);
    setAnswered(true);
    if (index === q.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleUseHint = () => {
    if (hintsUsed >= MAX_HINTS || answered) return;
    playClickSound();
    const nextHint = q.hints[hintsUsed];
    setShownHints((prev) => [...prev, nextHint]);
    setHintsUsed((prev) => prev + 1);
    setShowHintBox(true);
  };

  const handleNext = () => {
    playClickSound();
    const isCorrect = selectedOption === q.answer;
    const newScore = score; // already updated

    setSelectedOption(null);
    setAnswered(false);
    setHintsUsed(0);
    setShownHints([]);
    setShowHintBox(false);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      onComplete({ score: newScore, timeSpent });
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto">
      {/* Back + Progress Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => { playClickSound(); onBack(); }}
          className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
        <div className="flex-1">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">{score} ponto{score !== 1 ? 's' : ''}</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden"
      >
        {/* Question */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              Quiz de IA • {diffInfo.emoji} {diffInfo.label}
            </span>
            {/* Hint button */}
            <button
              onClick={handleUseHint}
              disabled={hintsLeft === 0 || answered}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                ${hintsLeft > 0 && !answered
                  ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/70 border border-amber-300 dark:border-amber-700'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-600 opacity-60'
                }`}
            >
              <Lightbulb size={13} />
              {hintsLeft > 0 ? `${hintsLeft} dica${hintsLeft !== 1 ? 's' : ''}` : 'Sem dicas'}
            </button>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
            {q.question}
          </h3>

          {/* Hints shown */}
          <AnimatePresence>
            {showHintBox && shownHints.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 space-y-1.5 overflow-hidden"
              >
                {shownHints.map((hint, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg px-3 py-2"
                  >
                    <Lightbulb size={13} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-800 dark:text-amber-300 leading-snug">{hint}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Options */}
        <div className="p-6 space-y-3">
          {q.options.map((option, index) => {
            let cls = "w-full text-left px-5 py-4 rounded-xl border font-medium transition-all duration-200 text-sm leading-snug ";
            if (!answered) {
              cls += "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer";
            } else if (index === q.answer) {
              cls += "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-800 dark:text-emerald-300";
            } else if (index === selectedOption) {
              cls += "bg-red-50 dark:bg-red-900/30 border-red-400 text-red-700 dark:text-red-400";
            } else {
              cls += "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 opacity-60";
            }

            return (
              <button
                key={index}
                disabled={answered}
                onClick={() => handleOptionClick(index)}
                className={cls}
              >
                <span className="flex items-start gap-3">
                  <span className="mt-0.5 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold border-current">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation + Next button after answer */}
        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-6 mb-6 space-y-3"
            >
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">💡 Explicação</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{q.explanation}</p>
              </div>
              <button
                onClick={handleNext}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {currentQuestion + 1 < questions.length ? 'Próxima Pergunta →' : 'Ver Resultado 🏆'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Quiz;
