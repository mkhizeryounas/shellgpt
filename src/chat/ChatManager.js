const OpenAI = require('openai');

class ChatManager {
    constructor(apiKey) {
        this.openai = new OpenAI({ apiKey });
        this.conversationHistory = [];
    }

    // Send a message to ChatGPT with streaming
    async chat(message, options = {}) {
        const {
            model = 'gpt-3.5-turbo',
            temperature = 0.7,
            maxTokens = 1000,
            stream = true
        } = options;

        // Add user message to conversation history
        this.conversationHistory.push({
            role: 'user',
            content: message
        });

        try {
            const stream = await this.openai.chat.completions.create({
                model: model,
                messages: this.conversationHistory,
                temperature: temperature,
                max_tokens: maxTokens,
                stream: true
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
                content: fullResponse
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
        return this.conversationHistory.map((msg, index) => {
            const role = msg.role === 'user' ? '👤 You' : '🤖 Assistant';
            return `${index + 1}. ${role}: ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}`;
        }).join('\n');
    }

    // Get conversation count
    getConversationCount() {
        return this.conversationHistory.length;
    }
}

module.exports = ChatManager; 