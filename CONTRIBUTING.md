# Contribuer

Merci de votre intérêt pour le projet.

## Signaler un problème

Ouvrir une [issue](https://github.com/Aziguy/resume-de-vehicule/issues) en précisant la version du plugin, de WordPress, de PHP et la source de données utilisée.

## Proposer une modification

1. Forker le dépôt et créer une branche depuis `master` (`feat/recherche-par-annee`, `fix/prix-vide`...).
2. Installer les dépendances : `npm install` et `composer install`.
3. Développer avec `npm start`. Un WordPress local est disponible via `npx wp-env start`.
4. Vérifier avant de pousser :
   ```bash
   npm run lint
   npm test
   composer test
   npm run build
   ```
5. Commiter `build/` si `src/` a changé : le dossier est versionné pour permettre l'installation depuis Git.
6. Ouvrir une pull request en remplissant le modèle.

## Conventions

- Code : [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/) (ESLint, Stylelint et Prettier via `@wordpress/scripts`).
- Commits : [Conventional Commits](https://www.conventionalcommits.org/fr/) courts et précis (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `ci:`, `chore:`).
- Commentaires : rares, utiles, concis.
- Tests : toute nouvelle logique est couverte (Jest pour `src/`, PHPUnit pour `includes/`).
- Le balisage enregistré (`VehicleCard`, `save.js`) doit rester déterministe. Toute modification passe par une entrée dans `src/deprecated/` pour ne pas invalider les blocs existants.

## Ajouter une source de données

Créer une classe dans `includes/Providers/` qui implémente `ProviderInterface`, retourne des véhicules via `Vehicle::normalize()`, puis l'ajouter dans `ProviderRegistry` (ou via le filtre `resume_vehicule_providers` depuis un autre plugin). Couvrir le mapping par un test.

## Publier une version

1. Mettre à jour la version dans `resume-vehicule-block.php`, `src/block.json`, `package.json`, `readme.txt` et `CHANGELOG.md`.
2. `npm run build` puis commit.
3. Créer un tag `vX.Y.Z` : le workflow *Release* publie l'archive.
