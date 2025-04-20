# Utilisation de Node.js 18
FROM node:18

# Définition du répertoire de travail
WORKDIR /app

# Copie uniquement les fichiers liés aux dépendances pour optimiser la mise en cache Docker
COPY package*.json ./

# Nettoyage du cache et installation propre des dépendances
RUN npm cache clean --force \
    && npm install --omit=optional --legacy-peer-deps \
    && npm install --save-dev rollup

# Copie du reste du projet
COPY . .

# Exposition du port Angular
EXPOSE 4200

# Démarrage du serveur Angular
CMD ["npm", "start"]
