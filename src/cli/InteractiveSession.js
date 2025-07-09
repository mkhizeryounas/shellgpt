const readline = require('readline');
const ChatManager = require('../chat/ChatManager');

class InteractiveSession {
  constructor(chatManager) {
    this.chatManager = chatManager;
    this.rl = null;
  }

  // Start an interactive chat session
  async start(options = {}) {
    console.log('🤖 Welcome to ShellGPT! Type your message or "quit" to exit.');
    console.log('💡 Type "clear" to clear conversation history');
    console.log('📝 Type "history" to view conversation history');
    console.log('❓ Type "help" for more commands\n');

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const askQuestion = () => {
      this.rl.question('👤 You: ', async (input) => {
        await this.handleInput(input, options, askQuestion);
      });
    };

    askQuestion();
  }

  // Handle user input
  async handleInput(input, options, callback) {
    const command = input.toLowerCase().trim();

    switch (command) {
      case 'quit':
      case 'exit':
        this.quit();
        return;

      case 'clear':
        this.chatManager.clearHistory();
        callback();
        return;

      case 'history':
        this.showHistory();
        callback();
        return;

      case 'help':
        this.showHelp();
        callback();
        return;

      case '':
        callback();
        return;

      default:
        await this.processMessage(input, options, callback);
    }
  }

  // Process a chat message
  async processMessage(message, options, callback) {
    try {
      console.log('\n🤖 Assistant: ');
      await this.chatManager.chat(message, options);
      console.log('');
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
    callback();
  }

  // Show conversation history
  showHistory() {
    const history = this.chatManager.getHistoryAsString();
    if (history) {
      console.log('\n📚 Conversation History:');
      console.log(history);
    } else {
      console.log('\n📚 No conversation history yet.');
    }
    console.log('');
  }

  // Show help
  showHelp() {
    console.log('\n📖 Available Commands:');
    console.log('  clear    - Clear conversation history');
    console.log('  history  - Show conversation history');
    console.log('  help     - Show this help message');
    console.log('  quit     - Exit the chat session');
    console.log('  exit     - Exit the chat session');
    console.log('');
  }

  // Quit the session
  quit() {
    console.log('👋 Goodbye!');
    if (this.rl) {
      this.rl.close();
    }
  }

  // Close the session
  close() {
    if (this.rl) {
      this.rl.close();
    }
  }
}

module.exports = InteractiveSession;
