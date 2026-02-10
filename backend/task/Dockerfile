# Create Build Stage
FROM maven:3.9.11-eclipse-temurin-21 AS build

WORKDIR /app

# Copy & Build Dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy Source Code
COPY src ./src       

# Build Application
RUN mvn clean package -DskipTests

# Create Runtime Stage
FROM eclipse-temurin:21-jre

RUN groupadd -r user && useradd -r -g user user

WORKDIR /app
RUN chown user:user /app

USER user

ARG PROFILE
ARG ALLOWED_ORIGINS
ENV SPRING_PROFILES_ACTIVE=${PROFILE}
ENV APP_ALLOWED_ORIGINS=${ALLOWED_ORIGINS}

# Copy the built jar from the build stage
COPY --from=build --chown=user:user /app/target/*.jar app.jar

# Run Application
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]