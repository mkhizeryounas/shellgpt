# Contributing to ShellGPT

Thank you for your interest in contributing to ShellGPT! This document provides guidelines for contributing to the project.

## 🤝 How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in the [issues](https://github.com/yourusername/shellgpt/issues)
2. Create a new issue with a clear title and description
3. Include steps to reproduce the bug
4. Add any relevant error messages or logs

### Suggesting Features

1. Check if the feature has already been suggested
2. Create a new issue with the "enhancement" label
3. Describe the feature and its benefits
4. Provide examples of how it would work

### Submitting Code Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Add tests if applicable
5. Run the test suite: `npm test`
6. Commit your changes: `git commit -m 'feat: add your feature'`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Create a pull request

## 📋 Development Setup

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/shellgpt.git
cd shellgpt

# Install dependencies
npm install

# Run tests
npm test
```

### Available Scripts

- `npm start` - Start the CLI application
- `npm test` - Run tests
- `npm run lint` - Run linting
- `npm run test:coverage` - Run tests with coverage

## 📝 Code Style

### JavaScript/Node.js

- Use ES6+ features
- Follow the existing code style
- Add JSDoc comments for public functions
- Use meaningful variable and function names
- Keep functions small and focused

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Maintenance tasks

### Pull Request Guidelines

1. **Title**: Use a clear, descriptive title
2. **Description**: Explain what the PR does and why
3. **Tests**: Include tests for new features
4. **Documentation**: Update docs if needed
5. **Screenshots**: Add screenshots for UI changes

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Writing Tests

- Write tests for new features
- Ensure good test coverage
- Use descriptive test names
- Test both success and error cases

## 📚 Documentation

### Updating Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for new functions
- Update API documentation if needed
- Include examples for new features

## 🔒 Security

### Reporting Security Issues

If you discover a security vulnerability, please:

1. **Do not** create a public issue
2. Email the maintainers directly
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed

## 🏷️ Release Process

### Version Bumping

- Use semantic versioning (MAJOR.MINOR.PATCH)
- Update CHANGELOG.md with changes
- Create a release on GitHub
- Tag releases with version numbers

### Release Checklist

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Version is bumped
- [ ] Release notes are written
- [ ] GitHub release is created

## 🤝 Community Guidelines

### Be Respectful

- Be kind and respectful to others
- Use inclusive language
- Listen to feedback
- Help others learn

### Communication

- Use clear, concise language
- Ask questions when unsure
- Provide constructive feedback
- Be patient with newcomers

## 📞 Getting Help

- Check the [documentation](https://github.com/yourusername/shellgpt#readme)
- Search existing [issues](https://github.com/yourusername/shellgpt/issues)
- Create a new issue if needed
- Join our community discussions

## 📄 License

By contributing to ShellGPT, you agree that your contributions will be licensed under the ISC License.

---

Thank you for contributing to ShellGPT! 🚀 