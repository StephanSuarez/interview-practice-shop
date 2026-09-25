# SHOP-165: Run the API with Docker Compose

**Context:** new developers should run the backend with one command.

**Required:**
- A `Dockerfile` for `api/`.
- An `api` service in `docker-compose.yml`, so `docker compose up --build` starts
  Postgres and the API, and `curl localhost:3000/health` answers `{"ok":true}`.
- The API must not crash if Postgres is still starting.
- Secrets come from environment variables, not from the image.

**Be ready to explain:** why `localhost:5433` works from your laptop but not from inside
the api container, what `.dockerignore` is for, and the difference between
`depends_on` alone and `depends_on` with `condition: service_healthy`.
