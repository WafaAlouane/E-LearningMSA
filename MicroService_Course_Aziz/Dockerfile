# Utiliser l'image de base OpenJDK 17
FROM openjdk:17

# Exposer le port 9090 (port de ton microservice)
EXPOSE 9090

# Copier le fichier .jar dans l'image
ADD target/MicroService_Course_Aziz-0.0.1-SNAPSHOT.jar course.jar

# Exécuter le fichier JAR
CMD ["java", "-jar", "course.jar"]
