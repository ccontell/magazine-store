import { GoogleGenAI } from "@google/genai";
import { Product, CartItem } from "../types";

// Robust API Key retrieval: works in Vite (via define replacement) and standard envs
// Note: process.env.API_KEY is replaced by string value during Vite build due to vite.config.ts
const apiKey = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (apiKey && apiKey.length > 10) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("Falha ao inicializar o cliente Gemini. Verifique se a chave API está correta.", e);
  }
} else {
  console.warn("API Key do Gemini ausente ou inválida. Recursos de IA desativados. Chave atual:", apiKey);
}

const SYSTEM_INSTRUCTION = `
Você é a "Maga", a assistente virtual inteligente da loja "MagaZine Store" (inspirada no estilo simpático da Magazine Luiza).
Seu tom de voz é amigável, prestativo, entusiasmado e muito brasileiro (use gírias leves se apropriado, emojis).
Você deve ajudar os clientes a escolherem produtos, tirar dúvidas sobre especificações e comparar itens.
Sempre tente direcionar o usuário para a compra de um dos produtos do catálogo fornecido no contexto.
Se o usuário perguntar sobre algo que não vendemos, diga gentilmente que no momento não temos esse item, mas sugira algo similar se possível.
Responda de forma concisa, pois é um chat.
`;

export const getGeminiResponse = async (
  userMessage: string,
  productsContext: Product[],
  cartContext: CartItem[]
) => {
  if (!ai) return "Minha conexão com a IA está indisponível no momento. Verifique a chave de API no arquivo .env.";

  try {
    const productsList = productsContext.map(p => 
      `- ${p.title} (R$ ${p.price.toFixed(2)}): ${p.description}`
    ).join('\n');

    const cartList = cartContext.length > 0 
      ? cartContext.map(c => `${c.quantity}x ${c.title}`).join(', ')
      : "Carrinho vazio";

    const prompt = `
    Contexto da Loja (Produtos Disponíveis):
    ${productsList}

    Contexto do Usuário (Carrinho atual):
    ${cartList}

    Mensagem do Cliente: "${userMessage}"
    
    Responda como a Maga:
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "Desculpe, tive um probleminha para entender. Pode repetir?";
  } catch (error: any) {
    console.error("Erro na API Gemini:", error);
    if (error.message?.includes('403') || error.message?.includes('API key')) {
      return "Ops! Parece que minha chave de acesso está incorreta. Por favor, verifique o arquivo .env.";
    }
    return "Ops! Minha inteligência artificial está tirando um cochilo. Tente novamente em instantes.";
  }
};

export const generateProductSummary = async (product: Product) => {
  if (!ai) return product.description;

  try {
    const prompt = `Crie um resumo de vendas persuasivo, curto e emocionante (máximo 2 frases) para este produto, destacando o maior benefício: ${product.title} - ${product.description}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return product.description;
  }
};