const fs = require('fs');
const path = require('path');

class PromptProcessor {
  constructor() {
    this.promptPath = path.join(__dirname, '../../SYSTEM_PROMPT.md');
  }

  // Get current date and time information
  getCurrentDateTime() {
    const now = new Date();

    return {
      CURRENT_DATE: now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      CURRENT_TIME: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      }),
      DAY_OF_WEEK: now.toLocaleDateString('en-US', { weekday: 'long' }),
    };
  }

  // Read and process the system prompt
  async getProcessedPrompt() {
    try {
      const promptContent = fs.readFileSync(this.promptPath, 'utf8');
      const dateTime = this.getCurrentDateTime();

      let processedPrompt = promptContent;

      // Replace placeholders with actual values
      Object.entries(dateTime).forEach(([placeholder, value]) => {
        processedPrompt = processedPrompt.replace(
          new RegExp(`{{${placeholder}}}`, 'g'),
          value
        );
      });

      return processedPrompt;
    } catch (error) {
      console.error('❌ Error reading system prompt:', error.message);
      return '';
    }
  }

  // Get just the date information for other uses
  getDateInfo() {
    return this.getCurrentDateTime();
  }
}

module.exports = PromptProcessor;
