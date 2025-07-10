const fs = require('fs');
const path = require('path');
const os = require('os');

class ConfigManager {
  constructor() {
    this.configDir = path.join(os.homedir(), '.shellgpt');
    this.configFile = path.join(this.configDir, 'config.json');
  }

  // Load API key from config file
  loadApiKey() {
    try {
      if (fs.existsSync(this.configFile)) {
        const config = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
        return config.apiKey;
      }
    } catch (error) {
      console.error('Error loading config:', error.message);
    }
    return null;
  }

  // Load SearchAPI key from config file
  loadSearchApiKey() {
    try {
      if (fs.existsSync(this.configFile)) {
        const config = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
        return config.searchApiKey;
      }
    } catch (error) {
      console.error('Error loading search config:', error.message);
    }
    return null;
  }

  // Save API key to config file
  async saveApiKey(apiKey) {
    try {
      // Create config directory if it doesn't exist
      if (!fs.existsSync(this.configDir)) {
        fs.mkdirSync(this.configDir, { recursive: true });
      }

      // Load existing config or create new one
      let config = {};
      if (fs.existsSync(this.configFile)) {
        config = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
      }

      config.apiKey = apiKey;
      config.updatedAt = new Date().toISOString();

      if (!config.createdAt) {
        config.createdAt = new Date().toISOString();
      }

      fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
      console.log('✅ OpenAI API key saved successfully');
    } catch (error) {
      console.error('Error saving API key:', error.message);
    }
  }

  // Save SearchAPI key to config file
  async saveSearchApiKey(searchApiKey) {
    try {
      // Create config directory if it doesn't exist
      if (!fs.existsSync(this.configDir)) {
        fs.mkdirSync(this.configDir, { recursive: true });
      }

      // Load existing config or create new one
      let config = {};
      if (fs.existsSync(this.configFile)) {
        config = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
      }

      config.searchApiKey = searchApiKey;
      config.updatedAt = new Date().toISOString();

      if (!config.createdAt) {
        config.createdAt = new Date().toISOString();
      }

      fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
      console.log('✅ SearchAPI key saved successfully');
    } catch (error) {
      console.error('Error saving SearchAPI key:', error.message);
    }
  }

  // Check if config exists
  hasConfig() {
    return fs.existsSync(this.configFile);
  }

  // Get config directory path
  getConfigDir() {
    return this.configDir;
  }

  // Get full configuration
  getConfig() {
    try {
      if (fs.existsSync(this.configFile)) {
        return JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
      }
    } catch (error) {
      console.error('Error loading config:', error.message);
    }
    return null;
  }

  // Clear configuration
  clearConfig() {
    try {
      if (fs.existsSync(this.configFile)) {
        fs.unlinkSync(this.configFile);
        console.log('✅ Configuration cleared successfully');
      } else {
        console.log('ℹ️  No configuration file found');
      }
    } catch (error) {
      console.error('Error clearing config:', error.message);
    }
  }

  // Clear only SearchAPI configuration
  clearSearchConfig() {
    try {
      if (fs.existsSync(this.configFile)) {
        const config = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
        delete config.searchApiKey;
        config.updatedAt = new Date().toISOString();

        fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
        console.log('✅ SearchAPI configuration cleared successfully');
      } else {
        console.log('ℹ️  No configuration file found');
      }
    } catch (error) {
      console.error('Error clearing search config:', error.message);
    }
  }
}

module.exports = ConfigManager;
