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

  // Save API key to config file
  async saveApiKey(apiKey) {
    try {
      // Create config directory if it doesn't exist
      if (!fs.existsSync(this.configDir)) {
        fs.mkdirSync(this.configDir, { recursive: true });
      }

      const config = {
        apiKey: apiKey,
        createdAt: new Date().toISOString(),
      };

      fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
      console.log('✅ API key saved successfully');
    } catch (error) {
      console.error('Error saving API key:', error.message);
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
}

module.exports = ConfigManager;
