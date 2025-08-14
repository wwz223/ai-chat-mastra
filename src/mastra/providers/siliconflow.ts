import { createOpenAI } from '@ai-sdk/openai';

/**
 * SiliconFlow AI provider configuration
 * SiliconFlow 是一个兼容 OpenAI API 的中国 AI 服务提供商
 * 使用 OpenAI provider 配置自定义 baseURL
 */
export const siliconflow = createOpenAI({
  baseURL: process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1',
  apiKey: process.env.SILICONFLOW_API_KEY,
  headers: {
    'User-Agent': 'Mastra/1.0.0',
  },
});

// 常用的 SiliconFlow 模型
export const siliconflowModels = {
  // Qwen 系列模型
  'qwen-turbo': 'Qwen/Qwen2.5-7B-Instruct',
  'qwen-plus': 'Qwen/Qwen2.5-14B-Instruct',
  'qwen-max': 'Qwen/Qwen2.5-72B-Instruct',
  'qwen-coder': 'Qwen/Qwen2.5-Coder-7B-Instruct',
  
  // DeepSeek 系列模型
  'deepseek-chat': 'deepseek-ai/DeepSeek-V2.5',
  'deepseek-coder': 'deepseek-ai/DeepSeek-Coder-V2-Instruct',
  
  // 智谱 GLM 系列
  'glm-4-9b': 'THUDM/glm-4-9b-chat',
  
  // Meta Llama 系列
  'llama-3-8b': 'meta-llama/Meta-Llama-3-8B-Instruct',
  'llama-3-70b': 'meta-llama/Meta-Llama-3-70B-Instruct',
  
  // 通义千问数学模型
  'qwq-32b': 'Qwen/QwQ-32B-Preview',
} as const;

export type SiliconFlowModel = keyof typeof siliconflowModels;

/**
 * 获取 SiliconFlow 模型实例
 * @param model 模型名称或完整模型路径
 * @returns 配置好的模型实例
 */
export function getSiliconFlowModel(model: SiliconFlowModel | string) {
  const modelPath = model in siliconflowModels 
    ? siliconflowModels[model as SiliconFlowModel]
    : model;
    
  return siliconflow(modelPath);
}
