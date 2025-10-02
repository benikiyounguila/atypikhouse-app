# AtypikHouse - Plateforme de Location de Logements Insolites

AtypikHouse est une application web complète qui permet aux utilisateurs de découvrir, réserver et mettre en location des logements uniques et atypiques. La plateforme est conçue pour offrir une expérience utilisateur fluide et sécurisée, de la recherche de logements au processus de paiement.

## Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Structure du Projet](#structure-du-projet)
- [Prérequis](#prérequis)
- [Installation et Lancement](#installation-et-lancement)
- [Scripts Disponibles](#scripts-disponibles)
- [Technologies Utilisées](#technologies-utilisées)

## Aperçu

Le projet est divisé en deux parties principales :

-   **`client/`** : Une application frontend construite avec React (en utilisant Vite), responsable de l'interface utilisateur et de l'interaction.
-   **`api/`** : Une API backend construite avec Node.js et Express, qui gère la logique métier, l'authentification, les interactions avec la base de données et les paiements.

## Fonctionnalités

-   **Recherche et Découverte :** Parcourez une sélection de logements insolites avec des filtres et une recherche avancée.
-   **Réservations :** Un système de réservation simple et sécurisé.
-   **Espace Utilisateur :** Gérez votre profil, vos réservations et vos logements.
-   **Espace Propriétaire :** Ajoutez, modifiez et gérez vos propres annonces de logements.
-   **Paiements Sécurisés :** Intégration avec Stripe pour des transactions sécurisées.
-   **Authentification :** Inscription et connexion via email/mot de passe ou Google.
-   **Interface d'Administration :** Un tableau de bord pour gérer les utilisateurs, les logements et les réservations.

## Structure du Projet

```
/
├── api/                # Backend (Node.js/Express)
│   ├── controllers/    # Logique des routes
│   ├── models/         # Schémas de la base de données (Mongoose)
│   ├── routes/         # Définitions des routes de l'API
│   ├── config/         # Configuration (ex: connexion BDD)
│   ├── index.cjs       # Point d'entrée du serveur
│   └── package.json
│
└── client/             # Frontend (React/Vite)
    ├── src/
    │   ├── components/ # Composants React réutilisables
    │   ├── pages/      # Pages principales de l'application
    │   ├── context/    # Contexte React (gestion d'état)
    │   ├── App.jsx     # Composant racine
    │   └── main.jsx    # Point d'entrée du client
    └── package.json
```

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les logiciels suivants :

-   [Node.js](https://nodejs.org/) (version 18.x ou supérieure recommandée)
-   [npm](https://www.npmjs.com/) (généralement inclus avec Node.js)
-   Une base de données MongoDB (locale ou via un service comme MongoDB Atlas)

## Installation et Lancement

Suivez ces étapes pour mettre en place l'environnement de développement local.

1.  **Cloner le dépôt :**
    ```bash
    git clone <URL_DU_DEPOT>
    cd atypikhouse
    ```

2.  **Installer les dépendances du Backend :**
    ```bash
    cd api
    npm install
    ```

3.  **Installer les dépendances du Frontend :**
    ```bash
    cd ../client
    npm install
    ```

4.  **Configurer les variables d'environnement :**
    Créez un fichier `.env` à la racine du dossier `api/` et remplissez les variables nécessaires. Un fichier `api/.env.example` peut être utilisé comme modèle.
    ```
    # Exemple pour api/.env
    MONGO_URL=mongodb+srv://...
    PORT=5000
    CLIENT_URL=http://localhost:5173
    STRIPE_SECRET_KEY=...
    SESSION_SECRET=...
    ```

5.  **Lancer le Backend :**
    Depuis le dossier `api/`, exécutez :
    ```bash
    npm start
    ```
    Le serveur backend devrait être accessible sur `http://localhost:5000`.

6.  **Lancer le Frontend :**
    Depuis le dossier `client/`, exécutez :
    ```bash
    npm run dev
    ```
    L'application frontend devrait être accessible sur `http://localhost:5173`.

## Scripts Disponibles

### Backend (`api/`)

-   `npm start`: Démarre le serveur de production.
-   `npm test`: Lance les tests avec Jest.

### Frontend (`client/`)

-   `npm run dev`: Démarre le serveur de développement Vite avec rechargement à chaud.
-   `npm run build`: Compile l'application pour la production.
-   `npm run preview`: Prévisualise le build de production localement.
-   `npm test`: Lance les tests avec Jest.

## Technologies Utilisées

### Backend

-   **Node.js**
-   **Express.js**
-   **MongoDB** avec **Mongoose**
-   **Stripe** pour les paiements
-   **JWT** et **Cookie-Session** pour l'authentification
-   **Cloudinary** pour le stockage d'images
-   **Jest** pour les tests

### Frontend

-   **React**
-   **Vite** comme outil de build
-   **React Router** pour le routage
-   **Axios** pour les requêtes HTTP
-   **Tailwind CSS** pour le style
-   **Jest** & **React Testing Library** pour les tests
