FROM node:22-bookworm-slim AS builder

COPY client/ /opt/app/client/

WORKDIR /opt/app/client
RUN npm ci && npm run build

FROM alpine:3.19.1

COPY api/ /opt/app/api

WORKDIR /opt/app/api

COPY --from=builder /opt/app/client/dist/avalog-fe/browser/ /opt/app/client/dist