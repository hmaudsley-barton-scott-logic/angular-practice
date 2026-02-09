# Create Build Stage
FROM maven:3.9.11-eclipse-temurin-21 AS build

WORKDIR /app

# Copy & Build Dependencies
COPY pom.xml .
COPY src ./src       
RUN mvn clean package -DskipTests

# Create Runtime Stage
FROM eclipse-temurin:21-jre

RUN groupadd -r user && useradd -r -g user user

WORKDIR /app
RUN chown user:user /app

USER user

ARG PROFILE
ENV SPRING_PROFILES_ACTIVE=LOCAL

# Copy the built jar from the build stage
COPY --from=build --chown=user:user /app/target/*.jar app.jar

# Run Application
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]