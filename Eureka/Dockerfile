# Utiliser l'image de base OpenJDK 17
FROM openjdk:17

# Exposer le port 8085 (port de ton microservice)
EXPOSE 8761

# Copier le fichier .jar dans l'image
ADD target/Eureka-0.0.1-SNAPSHOT.jar eureka-server.jar

CMD ["java", "-jar", "eureka-server.jar"]
