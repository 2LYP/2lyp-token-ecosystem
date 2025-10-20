# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and adheres to Semantic Versioning.

## [1.0.0] - 2025-10-21
### Added
- Token dashboard (overview, live stats, advanced metrics, tokenomics wallets)
- Real-time health, growth and distribution metrics (blockwatch + on-chain reads)
- Vesting and allocation views with charts and tables
- Admin controls and owner-only features
- official v1 version of 2LYP token contract

### Changed
- Removed the burn functionality from the UI and related ABI exposures
- Removed unused metrics

### Fixed
- Hydration and hook-order issues across client components
- Pie chart zero-data rendering (neutral 'No data' slice to avoid visual overlap)

### Notes
- This is the v1 release (initial public release of the token ecosystem dashboard).

---

For past unreleased notes, see the repository history (git log) or the releases/tags on the remote.

## [1.1.0] - 2025-10-21
### Added
- Display connected user's 2LYP token balance in the navbar and dashboard widgets (TokenSummaryBox, LiveStatsBox).

### Changed
- UI: balance now shows near the Connect Wallet button for quick visibility.

### Notes
- Minor release focused on UX: exposes on-chain `balanceOf` for the connected wallet and formats values for readability.
