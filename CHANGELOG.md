# Changelog

All notable changes to ShellGPT will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of ShellGPT
- Interactive chat sessions with streaming
- Automatic API key management
- Conversation history tracking
- CLI interface with Commander.js
- Modular architecture with clean separation of concerns
- Configuration management
- Security audit and validation
- Comprehensive error handling
- GitHub Actions for CI/CD
- Contributing guidelines and documentation

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- Secure API key storage in user's home directory
- API key validation before storage
- No logging or display of sensitive information

## [1.0.0] - 2024-01-XX

### Added
- Initial release of ShellGPT
- Interactive chat sessions with real-time streaming
- Automatic OpenAI API key management and validation
- Conversation history with view and clear functionality
- CLI interface using Commander.js with multiple commands:
  - `chat` - Start interactive session
  - `send <message>` - Send single message
  - `config --show/--clear` - Manage configuration
  - `history --clear` - View/clear conversation history
- Modular architecture with separate managers for:
  - Authentication (AuthManager)
  - Chat functionality (ChatManager)
  - Configuration (ConfigManager)
  - Interactive sessions (InteractiveSession)
- Global CLI options for model, temperature, and max tokens
- Interactive session commands: clear, history, help, quit
- Comprehensive error handling and graceful shutdown
- GitHub Actions workflows for:
  - CI/CD pipeline
  - Automatic publishing to NPM
  - Security audits
- Complete documentation including README and contributing guidelines

### Technical Details
- Built with Node.js and CommonJS modules
- Uses OpenAI API v4 for chat completions
- Supports streaming responses for real-time interaction
- Configuration stored in `~/.shgpt/config.json`
- Cross-platform compatibility (Windows, macOS, Linux)
- No external dependencies beyond core Node.js modules and OpenAI SDK

---

## Version History

- **1.0.0** - Initial release with full CLI functionality and modular architecture

## Contributing

To add entries to this changelog, please follow the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format and add your changes under the appropriate section.

## Release Process

1. Update version in `package.json`
2. Add entries to this changelog
3. Create a GitHub release
4. Tag the release with version number
5. Publish to NPM (automated via GitHub Actions) 