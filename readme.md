# QueueForge

A production-inspired distributed job processing platform built with Node.js, Express, PostgreSQL, and Prisma.

## Current Phase

Phase 1 - Foundation

## Features

- Express API
- PostgreSQL
- Prisma
- Background Worker (coming next)

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