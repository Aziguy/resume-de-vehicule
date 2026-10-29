# Changelog

Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versions selon [SemVer](https://semver.org/lang/fr/).

## [1.2.0] - 2026-10-29

### Ajouté

- Fiche véhicule repensée : thème sombre, bordure néon animée (désactivée si l'utilisateur limite les animations), grille et halos lumineux, tuiles de caractéristiques avec icônes, jauges de dimensions, variation du prix en pourcentage.
- Migration automatique des blocs enregistrés avec la fiche 1.1.

### Modifié

- Libellés ADEME (énergie, carrosserie, boîte) affichés en casse de phrase.

- WordPress 6.6 minimum (runtime JSX requis par `@wordpress/scripts` 37).
- Dépendances à jour : paquets WordPress, `@wordpress/scripts` 37, Jest 30, Testing Library, actions GitHub.
- ESLint en configuration « flat », directives `@tailwind` à la place des `@import` Sass dépréciés.
- Release déclenchable manuellement depuis l'onglet Actions.
- Mises à jour Dependabot regroupées.

## [1.1.0] - 2026-10-28

### Ajouté

- Sources de données interchangeables avec l'open data ADEME Car Labelling en alternative à l'API Saabre.
- Proxy REST `resume-vehicule/v1/vehicles` avec cache et page de réglages.
- Recherche avec autocomplétion et bouton d'actualisation des données.
- Nouveaux champs : version, carrosserie, boîte, puissance, poids, CO2, bonus/malus, source.
- Tests Jest et PHPUnit, intégration continue, couverture Codecov, workflow de release.
- Documentation, guide de contribution, licence.

### Modifié

- Code PHP découpé en classes namespacées.
- Carte véhicule responsive, accessible et sans valeurs vides.
- Styles Tailwind limités au bloc (suppression du preflight global).

### Corrigé

- Blocs 1.0 migrés automatiquement vers le nouveau format.
- Image tierce codée en dur, flèche de tendance affichée sans prix de référence, script front inutile.

### Supprimé

- Dépendance `axios`, remplacée par `@wordpress/api-fetch`.

## [1.0.0] - 2024-04-01

- Première version du bloc.
