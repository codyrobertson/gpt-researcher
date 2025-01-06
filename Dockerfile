FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    supervisor \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --no-cache-dir --upgrade pip

# Copy the requirements files
COPY server/requirements.txt server-requirements.txt
COPY requirements.txt app-requirements.txt

# Install dependencies with error handling
RUN pip install --no-cache-dir -r server-requirements.txt || exit 1
RUN pip install --no-cache-dir -r app-requirements.txt || exit 1

# Copy the application code
COPY . .

# Create supervisor configuration
RUN echo '[supervisord]\n\
nodaemon=true\n\
\n\
[program:flask]\n\
command=python server/flask_server.py\n\
directory=/app\n\
autostart=true\n\
autorestart=true\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
environment=FLASK_ENV=development,FLASK_DEBUG=1\n\
\n\
[program:fastapi]\n\
command=python server/fastapi_server.py\n\
directory=/app\n\
autostart=true\n\
autorestart=true\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0' > /etc/supervisor/conf.d/supervisord.conf

# Create startup script with health check and environment variable verification
RUN echo '#!/bin/bash\n\
echo "Verifying environment variables..."\n\
if [ -z "$OPENAI_API_KEY" ]; then\n\
    echo "Error: OPENAI_API_KEY is not set"\n\
    exit 1\n\
fi\n\
\n\
echo "Starting servers..."\n\
/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf &\n\
\n\
echo "Waiting for servers to be ready..."\n\
for i in {1..30}; do\n\
    if curl -s http://localhost:5001/health > /dev/null && curl -s http://localhost:8000/health > /dev/null; then\n\
        echo "Both servers are up!"\n\
        break\n\
    fi\n\
    echo "Waiting for servers... ($i/30)"\n\
    sleep 1\n\
done\n\
\n\
tail -f /dev/null' > /app/start.sh && \
    chmod +x /app/start.sh

# Expose ports
EXPOSE 5001 8000

# Start servers
CMD ["/app/start.sh"]
