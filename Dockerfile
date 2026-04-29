# ==============================================================
# ÉLITAN — Multi-stage Dockerfile
# Build: Frontend (Node) + Backend (Java) → Single JAR
# ==============================================================

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --production=false
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend (with frontend embedded)
FROM eclipse-temurin:17-jdk-alpine AS backend-build
WORKDIR /app/backend
COPY backend/.mvn .mvn
COPY backend/mvnw backend/pom.xml ./
# Download dependencies first (Docker cache layer)
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B
COPY backend/src ./src
# Copy frontend build output vào Spring Boot static resources
COPY --from=frontend-build /app/frontend/dist/ ./src/main/resources/static/
# Build JAR (dùng prod profile)
RUN ./mvnw clean package -DskipTests -B

# Stage 3: Run
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=backend-build /app/backend/target/*.jar app.jar
RUN mkdir -p uploads && chown -R appuser:appgroup /app
USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-Xmx400m", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
