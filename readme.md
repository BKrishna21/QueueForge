# QueueForge

A production-inspired distributed job processing platform built with Node.js, Express, PostgreSQL, and Prisma.

## Current Phase

Phase 3 - Worker Management



## Phase 1: Architecture

                 Client
                    │
             POST /jobs
                    │
                    ▼
               Express API
                    │
          Validation Middleware
                    │
                    ▼
              Controllers
                    │
                    ▼
               Services
                    │
                    ▼
             PostgreSQL
                    ▲
                    │
              Worker Process
                    │
               Polling Engine
                    │
              Claim Next Job
                    │
                Processor
                    │
              Email Handler
                    │
                    ▼
             Update Job Status

## Architecture at the end of phase 3:

                           Client
                              │
                              ▼
                       Express REST API
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   Job Routes          Dashboard Routes      Worker APIs
        │                     │
        ▼                     ▼
 Controllers            Controllers
        │                     │
        └──────────────┬──────┘
                       ▼
                  Service Layer
        ┌──────────────┼──────────────────────────┐
        │              │                          │
        ▼              ▼                          ▼
  Job Service    Worker Service          Dashboard Service
        │              │                          │
        ├──────────────┼───────────────┐          │
        ▼              ▼               ▼          ▼
 Retry Logic     Leader Election   Heartbeats   Metrics
 Recovery         Lifecycle         Statistics  Overview
        │
        ▼
 Prisma ORM
        │
        ▼
 PostgreSQL