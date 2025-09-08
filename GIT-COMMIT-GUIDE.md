# Git Commit Guide

This project uses Husky and commitlint to enforce structured git commits following the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## Setup

The project is already configured with:

- **Husky**: Git hooks manager
- **commitlint**: Commit message linter
- **commitizen**: Interactive commit interface
- **Conventional Commits**: Standard commit format

## Commit Message Format

All commit messages must follow this format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries
- **ci**: Changes to CI configuration files and scripts
- **build**: Changes that affect the build system or external dependencies
- **revert**: Reverts a previous commit

### Examples

✅ **Valid commits:**

```
feat: add user authentication system
fix(auth): resolve login validation issue
docs: update API documentation
style: format code with prettier
refactor: restructure user service
perf: optimize database queries
test: add unit tests for auth service
chore: update dependencies
```

❌ **Invalid commits:**

```
added new feature
fixed bug
updated docs
```

## How to Commit

### Option 1: Interactive Commit (Recommended)

Use the interactive commit interface:

```bash
bun run commit
```

This will guide you through selecting the type, scope, and description.

### Option 2: Manual Commit

Write your commit message manually following the conventional format:

```bash
git commit -m "feat: add new dashboard component"
```

### Option 3: Commit with Body

For more detailed commits:

```bash
git commit -m "feat: add new dashboard component" -m "This component provides real-time analytics and user activity tracking. Includes responsive design and accessibility features."
```

## Git Hooks

### Pre-commit Hook

- Runs `bun test` before each commit
- Ensures all tests pass before allowing the commit

### Commit-msg Hook

- Validates commit message format using commitlint
- Rejects commits that don't follow the conventional format

## Configuration Files

- **`.husky/`**: Contains git hooks
- **`commitlint.config.js`**: Commit message validation rules
- **`package.json`**: Scripts and commitizen configuration

## Troubleshooting

### Hook Not Working

If hooks aren't working, ensure they're executable:

```bash
chmod +x .husky/*
```

### Reinstall Husky

If you encounter issues, reinstall Husky:

```bash
bun remove husky
bun add -D husky
bunx husky init
```

### Bypass Hooks (Emergency Only)

In emergency situations, you can bypass hooks:

```bash
git commit --no-verify -m "emergency: critical fix"
```

## Best Practices

1. **Be descriptive**: Write clear, concise descriptions
2. **Use present tense**: "add feature" not "added feature"
3. **Keep it short**: Description should be under 50 characters
4. **Use body for details**: Add a body for complex changes
5. **Reference issues**: Include issue numbers in footer when applicable

## Examples by Category

### Features

```
feat: implement dark mode toggle
feat(auth): add OAuth2 support
feat(ui): create reusable button component
```

### Bug Fixes

```
fix: resolve memory leak in data processing
fix(api): handle null response gracefully
fix(ui): fix button alignment on mobile
```

### Documentation

```
docs: add setup instructions
docs(api): document new endpoints
docs: update deployment guide
```

### Refactoring

```
refactor: extract utility functions
refactor(auth): simplify authentication logic
refactor: improve error handling
```

### Performance

```
perf: optimize image loading
perf(db): add database indexes
perf: reduce bundle size
```

### Testing

```
test: add unit tests for utils
test(api): add integration tests
test: increase test coverage
```

### Maintenance

```
chore: update dependencies
chore: configure CI/CD pipeline
chore: add linting rules
```
