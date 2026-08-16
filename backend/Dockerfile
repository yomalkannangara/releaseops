# Build stage
FROM maven:3.9-eclipse-temurin-21-alpine AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src

RUN mvn clean package -DskipTests


# Runtime stage
FROM eclipse-temurin:21-jre-alpine

RUN addgroup -S releaseops \
    && adduser -S releaseops -G releaseops

WORKDIR /app

COPY --from=build \
    /app/target/backend-0.0.1-SNAPSHOT.jar \
    app.jar

USER releaseops

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]