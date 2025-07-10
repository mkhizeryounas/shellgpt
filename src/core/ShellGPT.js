const AuthManager = require('../auth/AuthManager');
const ChatManager = require('../chat/ChatManager');
const InteractiveSession = require('../cli/InteractiveSession');

class ShellGPT {
  constructor(debug = false) {
    this.authManager = new AuthManager();
    this.chatManager = null;
    this.session = null;
    this.debug = debug;
  }

  // Initialize the ShellGPT instance
  async initialize() {
    const apiKey = await this.authManager.getApiKey();
    if (!apiKey) {
      throw new Error('No OpenAI API key available');
    }

    // Get SearchAPI key (optional)
    const searchApiKey = await this.authManager.getSearchApiKey();

    this.chatManager = new ChatManager(apiKey, searchApiKey, this.debug);
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

  // Check if user has valid search configuration
  async hasValidSearchConfig() {
    return await this.authManager.hasValidSearchConfig();
  }

  // Get config directory
  getConfigDir() {
    return this.authManager.getConfigDir();
  }

  // Test search functionality
  async testSearch(query = 'test') {
    if (!this.chatManager) {
      await this.initialize();
    }

    return await this.chatManager.testSearch(query);
  }

  // Check if search capability is available
  hasSearchCapability() {
    return this.chatManager ? this.chatManager.hasSearchCapability() : false;
  }

  // Get current date info
  getCurrentDateInfo() {
    return this.chatManager ? this.chatManager.getCurrentDateInfo() : null;
  }
}

module.exports = ShellGPT;
