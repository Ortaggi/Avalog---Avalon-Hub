FROM node:22-bookworm-slim AS builder

COPY client/ /opt/app/client/

WORKDIR /opt/app/client
RUN npm ci && npm run build

FROM node:lts-alpine

# Install nginx and supervisor for process management
RUN apk add --no-cache nginx supervisor

# Copy API code
COPY api/ /opt/app/api

WORKDIR /opt/app/api

# Install API dependencies
RUN npm install

# Copy built client files to nginx html directory
COPY --from=builder /opt/app/client/dist/avalog-fe/browser/ /usr/share/nginx/html

# Copy nginx configuration
COPY api/nginx.conf /etc/nginx/nginx.conf

# Create supervisor configuration
RUN mkdir -p /etc/supervisor.d
COPY <<EOF /etc/supervisor.d/supervisord.conf
[supervisord]
nodaemon=true
user=root

[program:nginx]
command=nginx -g "daemon off;"
autostart=true
autorestart=true
stderr_logfile=/var/log/nginx_stderr.log
stdout_logfile=/var/log/nginx_stdout.log

[program:db-migration]
command=npm run migrate
directory=/opt/app/api
autostart=true
autorestart=false
stderr_logfile=/var/log/db_migration_stderr.log
stdout_logfile=/var/log/db_migration_stdout.log

[program:api]
command=npm start
directory=/opt/app/api
autostart=true
autorestart=true
stderr_logfile=/var/log/api_stderr.log
stdout_logfile=/var/log/api_stdout.log
EOF

# Expose port 80 for nginx
EXPOSE 80

# Start supervisor to manage both nginx and the API
CMD ["supervisord", "-c", "/etc/supervisor.d/supervisord.conf"]