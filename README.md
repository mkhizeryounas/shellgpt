# ShellGPT

A simple ChatGPT gateway module for Node.js with streaming support, dynamic system prompts, and intelligent web search capabilities. ShellGPT provides an easy-to-use CLI interface for interacting with OpenAI's ChatGPT API, featuring automatic API key management, conversation history, context-aware system prompts, and AI-driven web search using tools.

## Features

- 🤖 **Interactive Chat Sessions** - Start a conversation and chat naturally
- 📡 **Real-time Streaming** - See responses as they're generated
- 🔑 **Automatic API Key Management** - Secure storage and validation
- 📚 **Conversation History** - View and manage chat history
- ⚙️ **Configurable Options** - Customize model, temperature, and tokens
- 🛠️ **Modular Architecture** - Well-structured, maintainable code
- 📅 **Dynamic System Prompts** - Context-aware prompts with current date/time
- 🧠 **Enhanced AI Awareness** - AI knows its capabilities and limitations
- 🔍 **Intelligent Web Search** - AI-driven search using tools instead of keyword matching

## Installation

```bash
npm i -g shgpt
```

## Usage

### As a CLI Tool

#### Interactive Chat Session
```bash
# Start an interactive chat session
npm start

# Or with custom options
npm start -- --model gpt-4o --temperature 0.5

# Disable web search
npm start -- --no-search
```

#### Send a Single Message
```bash
# Send a single message
npm start send "What is the capital of France?"

# With custom options
npm start send "Explain quantum physics" --model gpt-4o --temperature 0.3

# With web search enabled
npm start send "What are the latest news about AI?" --search
```

#### Test Web Search
```bash
# Test web search functionality
npm start search "OpenAI latest news"

# Test with default query
npm start search
```

#### Manage Configuration
```bash
# Show current configuration
npm start config --show

# Clear saved configuration
npm start config --clear

# Clear only search configuration
npm start config --clear-search
```

#### View History
```bash
# Show conversation history
npm start history

# Clear conversation history
npm start history --clear
```

### As a Node.js Module

```javascript
const ShellGPT = require('./index.js');

async function example() {
    const shellGPT = new ShellGPT();
    
    // Send a single message
    const response = await shellGPT.chat("Hello, how are you?");
    console.log(response);
    
    // Start interactive session
    await shellGPT.startChat();
    
    // Test search functionality
    const searchWorks = await shellGPT.testSearch("test query");
    console.log('Search working:', searchWorks);
}
```

## CLI Commands

### Global Options
- `-m, --model <model>` - Specify the model to use (default: gpt-4o)
- `-t, --temperature <temperature>` - Set temperature (0-2, default: 0.7)
- `--max-tokens <tokens>` - Set maximum tokens (default: 1000)
- `--no-search` - Disable web search functionality

### Commands

#### `chat`
Start an interactive chat session.

```bash
shellgpt chat
shellgpt chat --model gpt-4o --temperature 0.5
shellgpt chat --no-search
```

#### `send <message>`
Send a single message to ChatGPT.

```bash
shellgpt send "What is the weather like?"
shellgpt send "Explain machine learning" --model gpt-4o
shellgpt send "Latest AI news" --search
```

#### `search [query]`
Test web search functionality.

```bash
shellgpt search "OpenAI news"
shellgpt search
```

#### `config`
Manage configuration.

```bash
shellgpt config --show         # Show current configuration
shellgpt config --clear        # Clear all configuration
shellgpt config --clear-search # Clear only search configuration
```

#### `history`
Manage conversation history.

```bash
shellgpt history          # Show conversation history
shellgpt history --clear  # Clear conversation history
```

## Interactive Session Commands

When in an interactive chat session, you can use these commands:

- `clear` - Clear conversation history
- `history` - Show conversation history
- `help` - Show available commands
- `quit` or `exit` - Exit the chat session

## Dynamic System Prompts

ShellGPT uses dynamic system prompts that include:

- **Current Date & Time** - Automatically updated for each session
- **AI Capabilities** - Clear awareness of what the AI can and cannot do
- **Response Guidelines** - Consistent behavior and formatting
- **Context Awareness** - Terminal/CLI interaction context

The system prompt is automatically processed and includes:
- Current date in readable format
- Current time with timezone
- Day of the week
- Comprehensive capability descriptions
- Clear limitations and guidelines

## Intelligent Web Search Integration

ShellGPT integrates with SearchAPI.io to provide AI-driven web search capabilities:

### Features
- **AI-Driven Search** - The AI decides when to search based on context, not keywords
- **Tool-Based Approach** - Uses OpenAI's function calling for intelligent search decisions
- **Real-time Information** - Search for current news and information
- **Multiple Result Types** - Organic results, knowledge graphs, featured snippets
- **Configurable** - Can be enabled/disabled per session

### How It Works
Instead of using keyword matching, the AI uses a `search_web` tool to:
- Automatically detect when current information is needed
- Choose appropriate search queries based on context
- Integrate search results seamlessly into responses
- Provide accurate, up-to-date information

### Setup
1. Get a free API key from [SearchAPI.io](https://www.searchapi.io/)
2. Run ShellGPT for the first time
3. Choose to enable web search when prompted
4. Enter your SearchAPI key
5. The key will be validated and saved for future use

### Search Triggers
The AI automatically uses web search when users ask about:
- Current events and news
- Recent developments in any field
- Real-time data (weather, stocks, etc.)
- Information that may have changed recently
- Facts that need verification
- Time-sensitive information

## Configuration

ShellGPT automatically manages your API keys:

### OpenAI API Key
1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Run ShellGPT for the first time
3. Enter your OpenAI API key when prompted
4. The key will be validated and saved for future use

### SearchAPI Key (Optional)
1. Get your free API key from [SearchAPI.io](https://www.searchapi.io/)
2. When prompted, choose to enable web search functionality
3. Enter your SearchAPI key
4. The key will be validated and saved for future use

## Project Structure

```
shellgpt/
├── src/
│   ├── auth/
│   │   └── AuthManager.js      # API key management and validation
│   ├── chat/
│   │   └── ChatManager.js      # Chat functionality and streaming
│   ├── cli/
│   │   └── InteractiveSession.js # Interactive CLI session
│   ├── config/
│   │   └── ConfigManager.js    # Configuration file management
│   ├── core/
│   │   └── ShellGPT.js         # Main orchestrator class
│   ├── services/
│   │   └── SearchAPIService.js # Web search integration
│   └── utils/
│       └── PromptProcessor.js  # Dynamic prompt processing
├── cli.js                      # CLI entry point with Commander.js
├── index.js                    # Module entry point
├── SYSTEM_PROMPT.md            # Dynamic system prompt template
├── package.json                # Dependencies and metadata
└── README.md                   # This file
```

## Dependencies

- `openai` - OpenAI API client
- `commander` - CLI argument parsing
- `axios` - HTTP client for web search
- `readline` - Interactive input handling
- `fs`, `path`, `os` - File system and OS utilities

## Error Handling

ShellGPT includes comprehensive error handling:

- **Invalid API Keys**: Automatic validation and retry
- **Network Errors**: Graceful error messages
- **Configuration Issues**: Clear guidance for setup
- **Graceful Shutdown**: Proper cleanup on exit
- **Prompt Processing**: Fallback prompts if file reading fails
- **Search API Errors**: Graceful handling of search failures
- **Tool Call Errors**: Proper handling of function calling errors

## Security

- API keys are stored locally in user's home directory
- Keys are validated before storage
- No keys are logged or displayed
- Configuration files use proper permissions
- Search API calls are made securely over HTTPS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License - see LICENSE file for details. 