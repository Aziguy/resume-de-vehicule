=== Résumé de véhicule ===
Contributors: aziguy
Tags: block, gutenberg, vehicle, car, automobile
Requires at least: 6.4
Tested up to: 6.6
Requires PHP: 7.4
Stable tag: 1.1.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Bloc Gutenberg affichant la fiche technique d'un véhicule issue d'une source de données externe.

== Description ==

Recherchez un véhicule depuis l'éditeur et insérez une fiche claire : prix, statut de commercialisation, énergie, puissance, dimensions, émissions de CO2...

Sources disponibles :

* API Saabre (historique, URL configurable) ;
* open data ADEME Car Labelling (public, sans clé).

Les requêtes passent par un proxy REST interne avec cache.

== Installation ==

1. Téléverser l'archive dans Extensions > Ajouter.
2. Activer l'extension.
3. Choisir la source dans Réglages > Résumé de véhicule.

== Changelog ==

= 1.1.0 =
* Sources de données interchangeables (Saabre, ADEME).
* Recherche avec autocomplétion, actualisation, nouvelle fiche responsive.
* Migration automatique des blocs 1.0.

= 1.0.0 =
* Première version.
