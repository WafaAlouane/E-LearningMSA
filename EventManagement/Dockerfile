# Utiliser l'image de base OpenJDK 17
FROM openjdk:17

# Exposer le port 8085 (port de ton microservice)
EXPOSE 8081

# Copier le fichier .jar dans l'image
ADD target/EventManagement-1.0.jar EventManagement.jar

# Définir le point d’entrée pour exécuter l’application
ENTRYPOINT ["java", "-jar", "EventManagement.jar"]
