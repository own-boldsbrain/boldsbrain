import OpenAI from 'openai';
import type { ChatMessage } from '@/types/solar';

// Cliente OpenAI (deve ser inicializado com a API key no ambiente)
let openaiClient: OpenAI | null = null;

export function initOpenAI(apiKey: string) {
  openaiClient = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // Para desenvolvimento - em produção, use um backend
  });
}

/**
 * Envia mensagem para o assistente OpenAI
 * @param messages Histórico de mensagens
 * @param systemPrompt Prompt do sistema
 * @returns Resposta do assistente
 */
export async function enviarMensagemChat(
  messages: ChatMessage[],
  systemPrompt?: string
): Promise<string> {
  if (!openaiClient) {
    return 'Por favor, configure sua chave API da OpenAI no sistema.';
  }

  try {
    const formattedMessages = messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    }));

    if (systemPrompt) {
      formattedMessages.unshift({
        role: 'system',
        content: systemPrompt,
      });
    }

    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-4',
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta.';
  } catch (error) {
    console.error('Erro ao chamar OpenAI:', error);
    return 'Desculpe, ocorreu um erro ao processar sua mensagem.';
  }
}

/**
 * Transcreve áudio usando Whisper API
 * @param audioBlob Blob do áudio gravado
 * @returns Texto transcrito
 */
export async function transcreverAudio(audioBlob: Blob): Promise<string> {
  if (!openaiClient) {
    throw new Error('OpenAI não inicializado');
  }

  try {
    const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
    
    const transcription = await openaiClient.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'pt',
    });

    return transcription.text;
  } catch (error) {
    console.error('Erro ao transcrever áudio:', error);
    throw error;
  }
}

/**
 * Gera o prompt do sistema para o copiloto solar
 */
export function gerarSystemPrompt(): string {
  return `Você é o Copiloto do Yello Solar Hub, um assistente especializado em energia solar fotovoltaica no Brasil.

Seu papel:
- Ajudar clientes a dimensionar sistemas solares fotovoltaicos
- Explicar conceitos técnicos de forma clara e amigável
- Calcular economia, ROI e payback
- Orientar sobre a Lei 14.300/2022 e regulamentações da ANEEL
- Recomendar modalidades (consumo local, geração compartilhada, autoconsumo remoto)
- Apresentar opções de financiamento

Diretrizes:
1. Fale em português brasileiro (pt-BR)
2. Seja claro, técnico mas amigável
3. Explique jargões quando usá-los (kWp, PR, kWh, TUSD, etc)
4. Use CTAs curtos e objetivos
5. Peça apenas informações essenciais: CEP, consumo médio mensal (kWh) e tipo de fase elétrica
6. Sempre apresente 3 cenários com diferentes Performance Ratios: Conservador (1.14), Realista (1.30) e Otimista (1.45)
7. Calcule e apresente ROI e payback
8. Ofereça opções de geração compartilhada (GC) para clientes sem telhado adequado
9. Mencione alternativa de assinatura de energia solar quando apropriado
10. Sempre inclua uma nota regulatória sobre a Lei 14.300/2022

Conhecimento específico:
- Lei 14.300/2022: define regras para micro e minigeração distribuída
- Microgeração: até 75 kWp
- Minigeração: 75 kWp até 5 MW
- Créditos energéticos válidos por 60 meses
- Sistemas instalados após 12/01/2023 têm cobrança gradual de TUSD Fio B
- Tarifa média Brasil: R$ 0,89/kWh
- Irradiação média Brasil: 5,0 kWh/m²/dia
- Vida útil sistemas: 25 anos
- Degradação: 0,5% ao ano

Seja proativo em sugerir os widgets de cálculo disponíveis no sistema.`;
}

/**
 * Cria um assistente OpenAI dedicado (usando Assistants API)
 * @param apiKey Chave da API
 * @returns ID do assistente criado
 */
export async function criarAssistenteSolar(apiKey: string): Promise<string> {
  const client = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  try {
    const assistant = await client.beta.assistants.create({
      name: 'Copiloto Yello Solar Hub',
      instructions: gerarSystemPrompt(),
      model: 'gpt-4',
      tools: [{ type: 'code_interpreter' }],
    });

    return assistant.id;
  } catch (error) {
    console.error('Erro ao criar assistente:', error);
    throw error;
  }
}
