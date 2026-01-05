# Contributing to Claude Code Online

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions.

## How to Contribute

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/OS information

### Suggesting Features

1. Check if feature already exists or is planned
2. Create an issue with:
   - Clear use case
   - Proposed implementation
   - Potential impact

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Test thoroughly
5. Commit with conventional commits
6. Push and create PR

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Claude-Code-online.git
cd Claude-Code-online

# Install dependencies
npm install

# Start dev server
npm run dev
```

## Coding Standards

### Commit Messages

Follow conventional commits:

```
type(scope): subject

- feat: new feature
- fix: bug fix
- perf: performance improvement
- refactor: code restructuring
- docs: documentation
- test: testing
- chore: maintenance
```

Examples:
```
feat(terminal): implement command history with localStorage
fix(auth): resolve token refresh race condition
perf(ui): optimize terminal render with memoization
```

### Code Style

- Use functional components
- Prefer hooks over class components
- Use async/await over promises
- Extract complex logic into utilities
- Add JSDoc comments for functions

### File Organization

```
src/
├── components/     # React components
├── hooks/         # Custom hooks
├── services/      # API services
├── utils/         # Utility functions
└── styles/        # CSS files
```

## Testing

```bash
# Run tests (when implemented)
npm test

# Run linter
npm run lint

# Format code
npm run format
```

## Documentation

- Update README.md for user-facing changes
- Update FEATURES.md for new features
- Add JSDoc comments for new functions
- Update DEPLOYMENT.md for deployment changes

## Review Process

1. Automated checks must pass
2. Code review by maintainer
3. Testing in staging environment
4. Merge to main branch

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release tag
4. Deploy to production

## Questions?

Create an issue or reach out to maintainers.