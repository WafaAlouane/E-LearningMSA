# Utiliser l'image de base OpenJDK 17
FROM openjdk:17

# Exposer le port 8086 (port de ton microservice)
EXPOSE 8086

# Copier le fichier .jar dans l'image
ADD target/Feedback-Serrvice-0.0.1-SNAPSHOT.jar Feedback-Service.jar

# Définir le point d’entrée pour exécuter l’application
ENTRYPOINT ["java", "-jar", "Feedback-Service.jar"]