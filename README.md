# ShellGPT

A simple ChatGPT gateway module for Node.js with streaming support and dynamic system prompts. ShellGPT provides an easy-to-use CLI interface for interacting with OpenAI's ChatGPT API, featuring automatic API key management, conversation history, and context-aware system prompts.

## Features

- 🤖 **Interactive Chat Sessions** - Start a conversation and chat naturally
- 📡 **Real-time Streaming** - See responses as they're generated
- 🔑 **Automatic API Key Management** - Secure storage and validation
- 📚 **Conversation History** - View and manage chat history
- ⚙️ **Configurable Options** - Customize model, temperature, and tokens
- 🛠️ **Modular Architecture** - Well-structured, maintainable code
- 📅 **Dynamic System Prompts** - Context-aware prompts with current date/time
- 🧠 **Enhanced AI Awareness** - AI knows its capabilities and limitations

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
npm start -- --model gpt-4o-mini --temperature 0.5
```

#### Send a Single Message
```bash
# Send a single message
npm start send "What is the capital of France?"

# With custom options
npm start send "Explain quantum physics" --model gpt-4o-mini --temperature 0.3
```

#### Manage Configuration
```bash
# Show current configuration
npm start config --show

# Clear saved configuration
npm start config --clear
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
}
```

## CLI Commands

### Global Options
- `-m, --model <model>` - Specify the model to use (default: gpt-4o-mini)
- `-t, --temperature <temperature>` - Set temperature (0-2, default: 0.7)
- `--max-tokens <tokens>` - Set maximum tokens (default: 1000)

### Commands

#### `chat`
Start an interactive chat session.

```bash
shellgpt chat
shellgpt chat --model gpt-4o-mini --temperature 0.5
```

#### `send <message>`
Send a single message to ChatGPT.

```bash
shellgpt send "What is the weather like?"
shellgpt send "Explain machine learning" --model gpt-4o-mini
```

#### `config`
Manage configuration.

```bash
shellgpt config --show    # Show current configuration
shellgpt config --clear   # Clear saved configuration
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

## Configuration

ShellGPT automatically manages your OpenAI API key:

1. **First Run**: You'll be prompted to enter your OpenAI API key
2. **Validation**: The key is validated before being saved
3. **Storage**: The key is securely stored in `~/.shellgpt/config.json`
4. **Subsequent Runs**: The saved key is automatically loaded

### API Key Setup

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Run ShellGPT for the first time
3. Enter your API key when prompted
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
- `readline` - Interactive input handling
- `fs`, `path`, `os` - File system and OS utilities

## Error Handling

ShellGPT includes comprehensive error handling:

- **Invalid API Key**: Automatic validation and retry
- **Network Errors**: Graceful error messages
- **Configuration Issues**: Clear guidance for setup
- **Graceful Shutdown**: Proper cleanup on exit
- **Prompt Processing**: Fallback prompts if file reading fails

## Security

- API keys are stored locally in user's home directory
- Keys are validated before storage
- No keys are logged or displayed
- Configuration files use proper permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License - see LICENSE file for details. 