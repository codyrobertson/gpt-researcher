FROM python:3.9-slim

WORKDIR /app

# Copy the requirements files
COPY server/requirements.txt .
COPY requirements.txt gpt_researcher_requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir -r gpt_researcher_requirements.txt

# Copy the application code
COPY . .

# Expose ports for both Flask and FastAPI
EXPOSE 5000 8000

# Create a script to run both servers
RUN echo '#!/bin/bash\n\
python server/flask_server.py & \
python server/fastapi_server.py' > run_servers.sh

RUN chmod +x run_servers.sh

CMD ["./run_servers.sh"]
