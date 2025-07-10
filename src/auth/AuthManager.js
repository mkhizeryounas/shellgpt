const OpenAI = require('openai');
const readline = require('readline');
const ConfigManager = require('../config/ConfigManager');
const SearchAPIService = require('../services/SearchAPIService');

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

  // Get SearchAPI key from saved config or prompt user
  async getSearchApiKey() {
    // Try to load from config file
    const savedSearchKey = this.configManager.loadSearchApiKey();
    if (savedSearchKey) {
      return savedSearchKey;
    }

    // Ask user if they want to enable search functionality
    const enableSearch = await this.promptForSearchEnablement();
    if (!enableSearch) {
      return null;
    }

    // Prompt user for SearchAPI key
    const searchApiKey = await this.promptForSearchApiKey();
    if (searchApiKey) {
      await this.configManager.saveSearchApiKey(searchApiKey);
      return searchApiKey;
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
          console.log('✅ OpenAI API key is valid');
          resolve(apiKey.trim());
        } catch (error) {
          console.log(
            '❌ Invalid OpenAI API key. Please check your key and try again.'
          );
          resolve(null);
        }
      });
    });
  }

  // Prompt user for SearchAPI key
  async promptForSearchApiKey() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      console.log('\n🔍 SearchAPI Setup:');
      console.log(
        'To enable web search functionality, you need a SearchAPI key.'
      );
      console.log('Get your free API key at: https://www.searchapi.io/');
      console.log(
        'This allows ShellGPT to search the web for current information.\n'
      );

      rl.question(
        '🔑 Please enter your SearchAPI key: ',
        async (searchApiKey) => {
          rl.close();

          if (!searchApiKey.trim()) {
            console.log(
              '❌ SearchAPI key is required for web search functionality'
            );
            resolve(null);
            return;
          }

          // Validate SearchAPI key by testing it
          try {
            const searchService = new SearchAPIService(searchApiKey.trim());
            const isValid = await searchService.validateApiKey();

            if (isValid) {
              console.log('✅ SearchAPI key is valid');
              resolve(searchApiKey.trim());
            } else {
              console.log(
                '❌ Invalid SearchAPI key. Please check your key and try again.'
              );
              resolve(null);
            }
          } catch (error) {
            console.log('❌ Error validating SearchAPI key:', error.message);
            resolve(null);
          }
        }
      );
    });
  }

  // Prompt user to enable search functionality
  async promptForSearchEnablement() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      console.log('\n🔍 Web Search Functionality:');
      console.log(
        'ShellGPT can search the web for current information and news.'
      );
      console.log(
        'This requires a free SearchAPI key from https://www.searchapi.io/'
      );
      console.log('You can skip this and add it later if needed.\n');

      rl.question(
        'Would you like to enable web search functionality? (y/N): ',
        (answer) => {
          rl.close();
          const enableSearch =
            answer.toLowerCase().trim() === 'y' ||
            answer.toLowerCase().trim() === 'yes';
          resolve(enableSearch);
        }
      );
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

  // Validate existing SearchAPI key
  async validateSearchApiKey(searchApiKey) {
    try {
      const searchService = new SearchAPIService(searchApiKey);
      return await searchService.validateApiKey();
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

  // Check if user has valid search config
  async hasValidSearchConfig() {
    const searchApiKey = this.configManager.loadSearchApiKey();
    if (!searchApiKey) return false;

    return await this.validateSearchApiKey(searchApiKey);
  }

  // Get config directory
  getConfigDir() {
    return this.configManager.getConfigDir();
  }
}

module.exports = AuthManager;
