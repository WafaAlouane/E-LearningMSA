# Utiliser l'image de base OpenJDK 17
FROM openjdk:17

# Exposer le port 8085 (port de ton microservice)
EXPOSE 8087

# Copier le fichier .jar dans l'image
ADD target/userBackend-0.0.1-SNAPSHOT.jar userBackend.jar

# Définir le point d’entrée pour exécuter l’application
ENTRYPOINT ["java", "-jar", "userBackend.jar"]
