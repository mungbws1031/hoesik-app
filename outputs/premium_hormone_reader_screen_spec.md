# Premium Hormone Reader Screen Package

## Files
- Interactive prototype: `outputs/premium_hormone_reader_app.html`
- Mock contract: `data/premium_hormone_reader_mock.json`
- Device image: `assets/premium-reader-device.png`

## Core Flow
1. Onboarding and pairing
2. Start test from Home
3. Dip, carry, insert, wait guide
4. Result sync and interpretation
5. Trend and note review

## Screen Set
- `Onboarding / Pairing`
  - One-line product framing
  - Device image and pairing CTA
  - Privacy and sync explanation
  - Connected / disconnected state
- `Home`
  - Latest result summary
  - Next recommended action
  - Reader battery and last sync
  - Primary CTA for starting a test
- `Step Guide`
  - Four-step flow: dip, carry, insert, wait
  - Retry and delayed sync messages
  - Incomplete-session handling
- `Result & Coaching`
  - Session summary
  - Reading rows from data
  - One clear next action
  - Trend-only caution copy
- `Trend / Calendar`
  - Cycle-day timeline
  - Recent comparisons
  - Coaching highlight
  - Empty state when cycle context is missing

## State Coverage
- `default`
- `device_disconnected`
- `sync_delayed`
- `incomplete_test`
- `no_cycle_data`

## Copy Rules
- Write in the order `status`, `meaning`, `next action`.
- Avoid certainty language such as confirmed diagnosis, proven condition, or guaranteed timing.
- Keep coaching specific and operational.
- Treat missing data and delayed sync as product states, not user blame.

## Visual Rules
- Matte white surfaces, black glass emphasis, rose-gold accent only.
- Large type, clear thumb targets, and restrained dividers.
- Use panels only for primary interaction or result emphasis.
- Keep motion short and informative: entry, pulse, reveal.
