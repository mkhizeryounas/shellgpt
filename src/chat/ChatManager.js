const OpenAI = require('openai');
const PromptProcessor = require('../utils/PromptProcessor');

class ChatManager {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey });
    this.conversationHistory = [];
    this.promptProcessor = new PromptProcessor();
    this.systemPrompt = '';
  }

  // Initialize system prompt
  async initializeSystemPrompt() {
    this.systemPrompt = await this.promptProcessor.getProcessedPrompt();
  }

  // Send a message to ChatGPT with streaming
  async chat(message, options = {}) {
    const {
      model = 'chatgpt-4o-latest',
      temperature = 0.7,
      maxTokens = 1000,
      stream = true,
    } = options;

    // Initialize system prompt if not already done
    if (!this.systemPrompt) {
      await this.initializeSystemPrompt();
    }

    // Add user message to conversation history
    this.conversationHistory.push({
      role: 'user',
      content: message,
    });

    // Prepare messages with system prompt
    const messages = [
      {
        role: 'system',
        content: this.systemPrompt,
      },
      ...this.conversationHistory,
    ];

    try {
      const stream = await this.openai.chat.completions.create({
        model: model,
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens,
        stream: true,
      });

      let fullResponse = '';

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          process.stdout.write(content);
          fullResponse += content;
        }
      }

      console.log('\n'); // Add newline after response

      // Add assistant response to conversation history
      this.conversationHistory.push({
        role: 'assistant',
        content: fullResponse,
      });

      return fullResponse;
    } catch (error) {
      console.error('❌ Error communicating with ChatGPT:', error.message);
      throw error;
    }
  }

  // Clear conversation history
  clearHistory() {
    this.conversationHistory = [];
    console.log('🗑️  Conversation history cleared');
  }

  // Get conversation history
  getHistory() {
    return this.conversationHistory;
  }

  // Get conversation history as formatted string
  getHistoryAsString() {
    return this.conversationHistory
      .map((msg, index) => {
        const role = msg.role === 'user' ? '👤 You' : '🤖 Assistant';
        return `${index + 1}. ${role}: ${msg.content.substring(0, 100)}${
          msg.content.length > 100 ? '...' : ''
        }`;
      })
      .join('\n');
  }

  // Get conversation count
  getConversationCount() {
    return this.conversationHistory.length;
  }

  // Get current date info
  getCurrentDateInfo() {
    return this.promptProcessor.getDateInfo();
  }

  // Refresh system prompt (useful for long-running sessions)
  async refreshSystemPrompt() {
    await this.initializeSystemPrompt();
  }
}

module.exports = ChatManager;
