# DreamFlow E-Learning 📚
Plateforme de gestion d'apprentissage en ligne

##  Description du Projet
E-LearningMSA est une application web distribuée conçue pour faciliter l'apprentissage en ligne à travers une plateforme moderne et intuitive. L'application permet de gérer les utilisateurs, les cours, les événements éducatifs, les retours des apprenants (feedback), le partenaires et la communication entre les différents services via une architecture de microservices. Elle offre une expérience utilisateur fluide grâce à une passerelle API et un serveur de découverte pour orchestrer les services.

##  Objectifs Cléss
- Implémenter une architecture microservices avec Spring Boot.
- Assurer la communication entre les microservices via DreamFlow Discovery Server et API Gateway.
- Gérer différentes entités de manière indépendante avec des bases de données adaptées (H2 , MySQL ).
- Faciliter la gestion des événements éducatifs et des retours des apprenants.

## Architecture
L’application est composée de plusieurs microservices indépendants :

###  Microservices Individuels
- **Gestion des Utilisateurs** → MySQL
- **Gestion des cours** → MySQL 
- **Gestion des Événements (EventManagement)** → H2
- **Gestion des Retours (Feedback-Service)** → H2 
- **Gestion des partenaires** → MySQL 


Tous les services sont orchestrés via **# DreamFlow E-Learning Discovery Server** et sécurisés par une **API Gateway**.

##  Technologies Utilisées
### Backend
- **Spring Boot** (développement des microservices)
- **Spring Cloud Eureka** (service de découverte)
- **Spring Cloud Gateway** (passerelle API)
- **Spring Data JPA** (gestion des bases de données)
- **H2 / MySQL** (stockage des données)

### Frontend
-React.js (interface utilisateur)

### Outils de Gestion
- **Git & GitHub** (gestion de version et collaboration)
- **Docker** (conteneurisation des services)
- **Keycloak** (sécurisation de l'API Gateway))

##  Projet académique réalisé par l'equipe DreamFlow
Encadré par Monsieur Mohamed Amine Chebbi
