<html>

<h1>Gestionnaire de stock</h1>

<h2>Fonctionnalités de la v1 </h2>
  <ul>
    <li>Ajout de nouveaux produits.</li>
    <li>Suppression de produits existants.</li>
    <li>Modification (+/-) du stock de produits existants.</li>
    <li>Coloration de la cellule de stock: vert si >= 10 (class .table-success), orange si < 10 (class .table-warning), rouge si = 0 (class .table-danger).</li>
    <li>Sauvegarde des produits dans localStorage (enregistrement permanent).</li>
    <li>Lorsque l'on supprime tous les produits le message d'alerte s'affiche.</li>
    <li>Suppression de tout le stock en 1 clic sur l'icone poubelle.</li>
    <li>Tri par nom, par prix ou par quantité.</li>
    <li>Si un produit existe déjà, il ne peut être rentrer dans le stock à nouveau.</li>
    <li>Le message d'alerte s'affiche si le stock est vide. Il s'efface sinon.</li>
    <li>La ligne de tri ne s'affiche que s'il y a des produits en stock.</li>
  </ul>

  <p>
  La version 2 des fichiers est une approche différente de la suppression totale et ne possède pas les fonctions de tri.
  </p>

</html>