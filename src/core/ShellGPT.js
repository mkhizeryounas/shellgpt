const AuthManager = require('../auth/AuthManager');
const ChatManager = require('../chat/ChatManager');
const InteractiveSession = require('../cli/InteractiveSession');

class ShellGPT {
  constructor() {
    this.authManager = new AuthManager();
    this.chatManager = null;
    this.session = null;
  }

  // Initialize the ShellGPT instance
  async initialize() {
    const apiKey = await this.authManager.getApiKey();
    if (!apiKey) {
      throw new Error('No API key available');
    }

    this.chatManager = new ChatManager(apiKey);
    return true;
  }

  // Send a single message
  async chat(message, options = {}) {
    if (!this.chatManager) {
      await this.initialize();
    }

    return await this.chatManager.chat(message, options);
  }

  // Start interactive session
  async startChat(options = {}) {
    if (!this.chatManager) {
      await this.initialize();
    }

    this.session = new InteractiveSession(this.chatManager);
    await this.session.start(options);
  }

  // Get conversation history
  getHistory() {
    return this.chatManager ? this.chatManager.getHistory() : [];
  }

  // Clear conversation history
  clearHistory() {
    if (this.chatManager) {
      this.chatManager.clearHistory();
    }
  }

  // Check if user has valid configuration
  async hasValidConfig() {
    return await this.authManager.hasValidConfig();
  }

  // Get config directory
  getConfigDir() {
    return this.authManager.configManager.getConfigDir();
  }
}

module.exports = ShellGPT;
