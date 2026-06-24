FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copy the JAR file
COPY target/ems-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the port
EXPOSE 8080

# Set environment variables
ENV JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75.0 -Dspring.profiles.active=production"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/api/health || exit 1

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
