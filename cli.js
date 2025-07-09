#!/usr/bin/env node

const { Command } = require('commander');
const ShellGPT = require('./src/core/ShellGPT');

// Create the main program
const program = new Command();

// Set up the program
program
  .name('shgpt')
  .description('A simple ChatGPT gateway CLI with streaming support')
  .version('1.0.0');

// Add global options
program
    .option('-m, --model <model>', 'Specify the model to use', 'gpt-3.5-turbo')
    .option('-t, --temperature <temperature>', 'Set temperature (0-2)', '0.7')
    .option('--max-tokens <tokens>', 'Set maximum tokens', '1000');

// Chat command
program
    .command('chat')
    .description('Start an interactive chat session')
    .action(async (options) => {
        const shellGPT = new ShellGPT();
        
        try {
            const chatOptions = {
                model: options.model,
                temperature: parseFloat(options.temperature),
                maxTokens: parseInt(options.maxTokens)
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
        const shellGPT = new ShellGPT();
        
        try {
            const chatOptions = {
                model: options.model,
                temperature: parseFloat(options.temperature),
                maxTokens: parseInt(options.maxTokens)
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
    .action(async (options) => {
        const shellGPT = new ShellGPT();
        
        if (options.show) {
            const hasConfig = await shellGPT.hasValidConfig();
            if (hasConfig) {
                console.log('✅ Configuration is valid');
                console.log(`📁 Config directory: ${shellGPT.getConfigDir()}`);
            } else {
                console.log('❌ No valid configuration found');
            }
        } else if (options.clear) {
            const ConfigManager = require('./src/config/ConfigManager');
            const configManager = new ConfigManager();
            configManager.clearConfig();
        } else {
            console.log('Use --show to view configuration or --clear to remove it');
        }
    });

// History command
program
    .command('history')
    .description('Show conversation history')
    .option('--clear', 'Clear conversation history')
    .action(async (options) => {
        const shellGPT = new ShellGPT();
        
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
                        console.log(`${index + 1}. ${role}: ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}`);
                    });
                }
            }
        } catch (error) {
            console.error('❌ Error:', error.message);
            process.exit(1);
        }
    });

// Default action (when no command is specified)
program
    .action(async (options) => {
        const shellGPT = new ShellGPT();
        
        try {
            const chatOptions = {
                model: options.model,
                temperature: parseFloat(options.temperature),
                maxTokens: parseInt(options.maxTokens)
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