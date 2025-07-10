#!/usr/bin/env node

const { Command } = require('commander');
const ShellGPT = require('./src/core/ShellGPT');

// Create the main program
const program = new Command();

// Set up the program
program
  .name('shellgpt')
  .description(
    'A simple ChatGPT gateway CLI with streaming support and web search capabilities'
  )
  .version('1.0.0');

// Add global options
program
  .option('-m, --model <model>', 'Specify the model to use', 'gpt-4o-mini')
  .option('-t, --temperature <temperature>', 'Set temperature (0-2)', '0.7')
  .option('--max-tokens <tokens>', 'Set maximum tokens', '1000')
  .option('--no-search', 'Disable web search functionality')
  .option(
    '--debug',
    'Enable debug logging for tool calls and API interactions'
  );

// Chat command
program
  .command('chat')
  .description('Start an interactive chat session')
  .action(async (options) => {
    const shellGPT = new ShellGPT(options.debug);

    try {
      const chatOptions = {
        model: options.model,
        temperature: parseFloat(options.temperature),
        maxTokens: parseInt(options.maxTokens),
        enableWebSearch: options.search,
      };

      await shellGPT.startChat(chatOptions);
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

// Send command
program
  .command('send')
  .description('Send a single message to ChatGPT')
  .argument('<message>', 'The message to send')
  .action(async (message, options) => {
    const shellGPT = new ShellGPT(options.debug);

    try {
      const chatOptions = {
        model: options.model,
        temperature: parseFloat(options.temperature),
        maxTokens: parseInt(options.maxTokens),
        enableWebSearch: options.search,
      };

      await shellGPT.chat(message, chatOptions);
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

// Config command
program
  .command('config')
  .description('Manage configuration')
  .option('--show', 'Show current configuration')
  .option('--clear', 'Clear saved configuration')
  .option('--clear-search', 'Clear only search configuration')
  .action(async (options) => {
    const shellGPT = new ShellGPT(options.debug);

    if (options.show) {
      const hasConfig = await shellGPT.hasValidConfig();
      const hasSearchConfig = await shellGPT.hasValidSearchConfig();

      if (hasConfig) {
        console.log('✅ OpenAI configuration is valid');
        console.log(`📁 Config directory: ${shellGPT.getConfigDir()}`);
      } else {
        console.log('❌ No valid OpenAI configuration found');
      }

      if (hasSearchConfig) {
        console.log('✅ SearchAPI configuration is valid');
      } else {
        console.log('❌ No valid SearchAPI configuration found');
      }
    } else if (options.clear) {
      const ConfigManager = require('./src/config/ConfigManager');
      const configManager = new ConfigManager();
      configManager.clearConfig();
    } else if (options.clearSearch) {
      const ConfigManager = require('./src/config/ConfigManager');
      const configManager = new ConfigManager();
      configManager.clearSearchConfig();
    } else {
      console.log(
        'Use --show to view configuration, --clear to remove all config, or --clear-search to remove only search config'
      );
    }
  });

// Search command
program
  .command('search')
  .description('Test web search functionality')
  .argument('[query]', 'Search query to test', 'test')
  .action(async (query, options) => {
    const shellGPT = new ShellGPT(options.debug);

    try {
      console.log(`�� Testing web search with query: "${query}"`);

      const hasSearchConfig = await shellGPT.hasValidSearchConfig();
      if (!hasSearchConfig) {
        console.log('❌ No SearchAPI configuration found');
        console.log('Run the chat command to set up SearchAPI key');
        return;
      }

      const searchWorks = await shellGPT.testSearch(query);
      if (searchWorks) {
        console.log('✅ Web search functionality is working');
      } else {
        console.log('❌ Web search test failed');
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

// History command
program
  .command('history')
  .description('Show conversation history')
  .option('--clear', 'Clear conversation history')
  .action(async (options) => {
    const shellGPT = new ShellGPT(options.debug);

    try {
      if (options.clear) {
        shellGPT.clearHistory();
      } else {
        const history = shellGPT.getHistory();
        if (history.length === 0) {
          console.log('📚 No conversation history');
        } else {
          console.log('📚 Conversation History:');
          history.forEach((msg, index) => {
            const role = msg.role === 'user' ? '👤 You' : '🤖 Assistant';
            console.log(
              `${index + 1}. ${role}: ${msg.content.substring(0, 100)}${
                msg.content.length > 100 ? '...' : ''
              }`
            );
          });
        }
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

// Default action (when no command is specified)
program.action(async (options) => {
  const shellGPT = new ShellGPT(options.debug);

  try {
    const chatOptions = {
      model: options.model,
      temperature: parseFloat(options.temperature),
      maxTokens: parseInt(options.maxTokens),
      enableWebSearch: options.search,
    };

    await shellGPT.startChat(chatOptions);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Goodbye!');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Goodbye!');
  process.exit(0);
});

// Parse command line arguments
program.parse();
