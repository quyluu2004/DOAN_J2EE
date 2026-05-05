# ==============================================================
# ÉLITAN — Backend (Java Spring Boot)
# Build: Chỉ build Backend API (vì Frontend đã chạy trên Vercel)
# ==============================================================

# Stage 1: Build Backend
FROM eclipse-temurin:17-jdk-alpine AS backend-build
WORKDIR /app/backend
COPY .mvn .mvn
COPY mvnw pom.xml ./
# Download dependencies first (Docker cache layer) để build nhanh hơn ở các lần sau
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B
COPY src ./src
# Build JAR (dùng prod profile, bỏ qua test để tăng tốc)
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Run
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=backend-build /app/backend/target/*.jar app.jar
RUN mkdir -p uploads && chown -R appuser:appgroup /app
USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-Xmx400m", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
