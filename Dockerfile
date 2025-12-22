FROM node:22-bookworm-slim AS builder

COPY client/ /opt/app/client/

WORKDIR /opt/app/client
RUN npm ci && npm run build

FROM node:lts-alpine

COPY api/ /opt/app/api

WORKDIR /opt/app/api

RUN npm install

COPY --from=builder /opt/app/client/dist/avalog-fe/browser/ /opt/app/client/dist

EXPOSE 8000

CMD ["npm", "start"]