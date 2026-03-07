# src Architecture

This application follows a strict feature-based architecture.

## Rules enforced
- Features do not import from other feature modules.
- `shared/` does not import from `app/` or `features/`.
- `app/` contains wiring only (routes, store, typed hooks, app-level utils).
- API calls flow through `shared/services/apiClient.service.ts` and feature service wrappers.
- State belongs either in feature Redux slices or local component state.

## Feature Modules
- `auth`: authentication and session shell
- `inventory`: inventory monitoring
- `production`: production scheduling and operational overview
