````md
# 🐳 Docker & Docker Compose Cheat Sheet
_For NestJS + GHCR + multi-environment servers_

---

## 🔍 Basic Docker Info

### Check Docker version
```bash
docker --version
docker compose version
````

### See running containers

```bash
docker ps
```

### See all containers (including stopped)

```bash
docker ps -a
```

### See Docker images

```bash
docker images
```

---

## 🧱 Containers

### Start containers (from docker-compose.yml)

```bash
docker compose up -d
```

### Stop containers

```bash
docker compose down
```

### Restart containers

```bash
docker compose restart
```

### Recreate containers (after env/image changes)

```bash
docker compose up -d --force-recreate
```

---

## 🪵 Logs & Debugging

### View logs

```bash
docker logs <container_name>
```

### Follow logs (live)

```bash
docker logs -f <container_name>
```

### Last N lines of logs

```bash
docker logs <container_name> --tail=100
```

---

## 🧠 Exec into Containers

### Open shell inside container

```bash
docker exec -it <container_name> sh
```

(Use `bash` if available)

### Run one-off command inside container

```bash
docker exec <container_name> ls /app
```

---

## 🌐 Ports & Networking

### See what ports Docker exposes

```bash
docker ps
```

### Check what’s listening on a host port

```bash
sudo ss -lntp | grep :5002
```

### Test container from host

```bash
curl http://127.0.0.1:5002
```

---

## 📦 Images

### Pull latest image

```bash
docker pull ghcr.io/org/image:tag
```

### Remove image

```bash
docker rmi <image_id>
```

### Remove unused images

```bash
docker image prune
```

---

## 📁 Volumes

### List volumes

```bash
docker volume ls
```

### Inspect a volume

```bash
docker volume inspect <volume_name>
```

### Remove unused volumes

```bash
docker volume prune
```

---

## 🧩 Docker Compose

### Validate compose file

```bash
docker compose config
```

### Use a specific compose file

```bash
docker compose -f docker-compose.yml up -d
```

### Pull updated images only

```bash
docker compose pull
```

### Stop + remove containers, keep volumes

```bash
docker compose down
```

### Stop + remove containers AND volumes (⚠️ destructive)

```bash
docker compose down -v
```

---

## 🌍 Environment Files

### Docker Compose env resolution order

1. `.env` file
2. `env_file:` in compose
3. `environment:` in compose
4. CLI `-e` flags

### Check env inside container

```bash
docker exec <container_name> env
```

---

## 🐘 Postgres

### View Postgres logs

```bash
docker logs postgres-<env>
```

### Connect to Postgres shell

```bash
docker exec -it postgres-<env> psql -U <user> -d <db>
```

---

## 🟥 Redis

### Test Redis connection

```bash
docker exec -it redis-<env> redis-cli ping
```

Expected:

```text
PONG
```

---

## 🧹 Cleanup (Use Carefully)

### Remove stopped containers

```bash
docker container prune
```

### Remove unused networks

```bash
docker network prune
```

### Remove everything unused (⚠️)

```bash
docker system prune -a
```

---

## 🚀 Common CI/CD Fixes

### Containers restarting?

```bash
docker logs <container>
```

### Port not exposed?

```bash
docker ps
```

### Env not loading?

```bash
cat .env
docker compose config
```

### App works in container but not via Nginx?

```bash
curl http://127.0.0.1:<HOST_PORT>
```

---

## ✅ Golden Rules

* Inside Docker:

  * Use service names (`postgres`, `redis`)
  * Never use `localhost`
* Same image for all environments
* One compose file, different `.env` per env
* Nginx talks to **host ports**, not container ports

