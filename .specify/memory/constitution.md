<!--
Sync Impact Report
- Version change: template-placeholder → 1.0.0
- Modified principles:
	- Principle 1 placeholder → I. Simplicity and Scope Discipline
	- Principle 2 placeholder → II. Monorepo and API Contract Integrity
	- Principle 3 placeholder → III. Test-First Quality Gates (NON-NEGOTIABLE)
	- Principle 4 placeholder → IV. UI Consistency, Accessibility, and Theme Fidelity
	- Principle 5 placeholder → V. Code Maintainability and Review Readiness
- Added sections:
	- Product Constraints and Functional Baseline
	- Delivery Workflow and Quality Gates
- Removed sections:
	- None
- Templates requiring updates:
	- ✅ updated: .specify/templates/plan-template.md
	- ✅ updated: .specify/templates/spec-template.md
	- ✅ updated: .specify/templates/tasks-template.md
	- ⚠ pending: .specify/templates/commands/*.md (directory not present in repository)
- Deferred follow-up TODOs:
	- TODO(RATIFICATION_DATE): Original adoption date is unknown in repo history.
-->

# AI Bootcamp Todo App Constitution

## Core Principles

### I. Simplicity and Scope Discipline
The product MUST remain a simple, single-user todo application focused on create,
view, update status, edit details, and delete with confirmation. Features explicitly
out of scope (authentication, collaboration, filtering/search, reminders,
undo/redo, bulk operations, tags/categories, recurring todos) MUST NOT be added
without a ratified constitutional amendment. Rationale: preserving MVP clarity
prevents accidental scope creep and keeps delivery predictable.

### II. Monorepo and API Contract Integrity
The system MUST preserve the existing monorepo split between React frontend and
Express backend, with frontend state changes persisted through backend APIs.
Changes to shared data contracts (todo shape, required fields, ordering behavior)
MUST include coordinated frontend/backend updates in the same change set.
Rationale: functional correctness depends on a stable contract between packages.

### III. Test-First Quality Gates (NON-NEGOTIABLE)
All behavior changes MUST be accompanied by tests that fail before implementation
and pass after implementation. The project MUST maintain at least 80% coverage
across packages, and critical user workflows (create, list, toggle, edit, delete,
persistence across refresh) SHOULD remain fully covered. Tests MUST prioritize
behavior over implementation details and remain isolated and deterministic.
Rationale: this codebase is a training environment where tests define expected
behavior and protect refactoring safety.

### IV. UI Consistency, Accessibility, and Theme Fidelity
UI changes MUST conform to documented design primitives: single-column layout,
Halloween-inspired palette, light/dark mode support, 8px spacing system, and
desktop-first behavior. Interactive elements MUST be keyboard accessible, have
visible focus states, and include semantic labels (including aria labels for icon
actions). Theme preference MUST persist via localStorage and default to system
preference on first visit. Rationale: visual consistency and accessibility are core
functional quality requirements, not optional polish.

### V. Code Maintainability and Review Readiness
Code MUST follow repository coding guidelines: 2-space indentation, consistent
naming conventions, organized imports, single-responsibility modules, and clear
error handling with actionable user feedback. New logic MUST avoid unnecessary
complexity (KISS), duplication (DRY), and hidden coupling. Pull requests MUST be
atomic, lint-clean, and reviewable with clear intent. Rationale: maintainability is
required for collaborative bootcamp delivery and rapid iteration.

## Product Constraints and Functional Baseline

- Frontend technology MUST remain React and backend technology MUST remain
	Express.js unless superseded by amendment.
- Todo creation MUST require a title (max 255 characters) and MAY include a due
	date.
- New todos MUST default to incomplete status and list ordering MUST remain newest
	first unless a feature spec explicitly revises ordering.
- Delete actions MUST require explicit confirmation before permanent removal.
- All successful create/update/delete actions MUST persist through page refresh.

## Delivery Workflow and Quality Gates

- Every feature spec MUST map user stories to independently testable increments
	with clear acceptance scenarios.
- Every implementation plan MUST include a Constitution Check that evaluates scope,
	API contract impact, testing coverage impact, and UI/accessibility impact.
- Task lists MUST include explicit work for tests, implementation, and validation.
- Before merge, contributors MUST verify: tests pass, coverage target is not
	regressed below 80%, and user-facing behavior aligns with functional and UI
	guidelines.

## Governance

This constitution supersedes conflicting local practices and template defaults.

Amendment process:
- Propose changes through a documented update to this file including rationale,
	impact, and migration notes for active templates.
- Obtain maintainer approval from project owners before adoption.
- Update dependent templates and related guidance documents in the same change
	whenever principles or mandatory gates are modified.

Versioning policy (Semantic Versioning):
- MAJOR: Removes or redefines a principle in a backward-incompatible way.
- MINOR: Adds a new principle/section or materially expands governance
	requirements.
- PATCH: Clarifies wording, fixes typos, or makes non-semantic refinements.

Compliance review expectations:
- Planning and review artifacts MUST explicitly state constitutional compliance.
- Non-compliant changes MUST include a documented exception approved by
	maintainers and a follow-up amendment or remediation plan.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): Original adoption date not found in repository artifacts. | **Last Amended**: 2026-02-27
