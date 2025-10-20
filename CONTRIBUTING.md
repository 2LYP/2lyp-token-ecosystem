# Contributing to 2LYP Token Ecosystem Dashboard

Thanks for your interest in contributing! This guide explains how to get started and the expectations for contributions.

## How to contribute

Thank you for contributing — we welcome improvements, bug fixes and documentation updates. Follow these steps to contribute effectively:

1. Open an issue to discuss major features or breaking changes before implementing. Include motivation and high-level approach.
2. Fork the repository.
3. Create a branch using the naming convention below.
4. Implement your change with small, focused commits.
5. Add or update tests and documentation where applicable.
6. Push your branch and open a Pull Request (PR) against `main`.
7. Link the PR to any relevant issues and provide a clear description and testing steps.

### Branch naming convention

Please use the following branch formats so history is consistent and easy to scan:

- feature branches: `feature/<short-description>`
- bugfix branches: `fix/<short-description>`
- chore / maintenance: `chore/<short-description>`
- hotfix branches (urgent production fixes): `hotfix/<short-description>`

Examples:

- `feature/tokenomics-ui` — new tokenomics UI changes
- `fix/circulating-supply-calculation` — bugfix for circulating supply
- `chore/update-deps` — routine dependency updates

Use hyphens to separate words and keep names short but descriptive.

## Development workflow

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Run tests (if present): `npm test` or `npm run test:watch`

When developing a feature or bugfix:

- Create a branch from the latest `main` (pull before creating a branch).
- Make small commits with clear messages (see Commit Message Guidelines).
- Keep your PR focused on a single concern.

## Pull Request checklist

- PR targets `main` branch.
- PR description includes motivation, summary of changes, and testing steps.
- Linked issue (if applicable).
- Tests added or updated for new behavior.
- Linting and type checks pass.
- No large unrelated changes.

## Commit Message Guidelines

Use imperative tense and keep the subject line short (<= 72 chars). Example:

```
feat: add real-time distribution metrics

Add a new hook useRealTimeDistribution that computes holder categories
and liquidity metrics based on wallet balances.
```

Prefixes you can use: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.

## Coding standards

## Coding standards

- Follow existing code style and patterns.
- Avoid changing unrelated files in a single PR.
- Document important design decisions in the PR description.

## Reporting security issues

If you discover a security vulnerability, please disclose it privately to the maintainers of 2LYP. You can reach out to `davedmj1725@gmail.com` (replace with actual secure contact). Do not open public issue threads for undisclosed vulnerabilities.
