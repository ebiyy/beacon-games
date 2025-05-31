# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 言語設定 / Language Settings

**重要**: このプロジェクトでは日本語でのコミュニケーションを使用してください。

- すべてのやり取りは日本語で行う
- コードのコメントは英語でOK
- ドキュメント作成時は指定がない限り日本語を使用

## Project Overview

This is a real-time emergency response simulation game platform project that enables rapid deployment of different themed emergency management games (similar to 112 Operator). The project contains business development plans from two AI models with different approaches:

- **Model A (NERVE)**: Ambitious unicorn-focused approach with neural/nervous system branding
- **Model B (MetroHelix)**: Pragmatic implementation-focused approach with urban DNA analysis theme

## Core Architecture Principles

### Technical Foundation

- **Single Game Engine**: One core engine that supports multiple emergency response themes
- **Plugin Architecture**: Theme-specific content loaded as plugins
- **Web-First Development**: Browser-based for instant accessibility
- **Real-time Operations**: WebSocket/Socket.io for multiplayer and real-time events
- **Data Integration**: OpenStreetMap and real-world data sources

### Key Design Goals

- Theme deployment time: 3 weeks → 3 days
- Operating cost reduction: 70% compared to Unity
- Market deployment: 10x faster
- Accessibility: One-click play in browsers

## Technology Stack

### Frontend

- React/Next.js with TypeScript
- WebGL for 2D/3D rendering
- State management with event sourcing pattern

### Backend

- Microservices architecture
- WebAssembly (Rust) for performance-critical components
- API-driven for external integrations

### Infrastructure

- Kubernetes deployment on AWS/GCP
- Real-time communication via WebSocket
- OpenStreetMap integration

## Development Approach

### When implementing features:

1. Consider both Model A and Model B perspectives
2. Prioritize web performance and instant playability
3. Design for theme extensibility from the start
4. Focus on real-world data integration capabilities

### Business Context

- Target: 3 titles in 24 months
- Revenue goal: 300M yen ARR
- Scale: 10,000-100,000 DAU support
- Dual market: Entertainment + Training/Education
