const OpenAI = require('openai');
const readline = require('readline');
const ConfigManager = require('../config/ConfigManager');

class AuthManager {
  constructor() {
    this.configManager = new ConfigManager();
  }

  // Get API key from saved config or prompt user
  async getApiKey() {
    // Try to load from config file
    const savedKey = this.configManager.loadApiKey();
    if (savedKey) {
      return savedKey;
    }

    // Prompt user for API key
    const apiKey = await this.promptForApiKey();
    if (apiKey) {
      await this.configManager.saveApiKey(apiKey);
      return apiKey;
    }

    return null;
  }

  // Prompt user for API key
  async promptForApiKey() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question('🔑 Please enter your OpenAI API key: ', async (apiKey) => {
        rl.close();

        if (!apiKey.trim()) {
          console.log('❌ API key is required');
          resolve(null);
          return;
        }

        // Validate API key by testing it
        try {
          const testOpenAI = new OpenAI({ apiKey: apiKey.trim() });
          await testOpenAI.models.list();
          console.log('✅ API key is valid');
          resolve(apiKey.trim());
        } catch (error) {
          console.log(
            '❌ Invalid API key. Please check your key and try again.'
          );
          resolve(null);
        }
      });
    });
  }

  // Validate existing API key
  async validateApiKey(apiKey) {
    try {
      const openai = new OpenAI({ apiKey });
      await openai.models.list();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Check if user has valid config
  async hasValidConfig() {
    const apiKey = this.configManager.loadApiKey();
    if (!apiKey) return false;

    return await this.validateApiKey(apiKey);
  }
}

module.exports = AuthManager;
