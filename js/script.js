// Modèle de données produits
const products = [
    {
        name: 'Tartiflette à réaction',
        price: 599.99,
        stock: 26
    },
    {
        name: 'Hélicoptère à pédales',
        price: 250.95,
        stock: 12
    },
    {
        name: 'Géranium électrique',
        price: 398.57,
        stock: 178
    }
];

// Fonction pour remplir le localStorage pour les tests
function fillLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}
//fillLocalStorage();

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {

    //Fonction pour véifier si le stock est vide ou non et affichier l'alerte
    function alerteVide() {
        let listeProduits = JSON.parse(localStorage.getItem('products')) || []; // Récupération des produits, si vide alors []

        const divAlert = document.getElementById('alert');

        if (listeProduits.lenght <= 0) {
            divAlert.style.display = "block"; // Si le stock est vide, on affiche l'alerte
        } else {
            divAlert.style.display = "none"; // Sinon on cache l'alerte
        }
    }

    // Fonction pour afficher les produits dans le tableau
    function displayProducts() {
        let listeProduits = JSON.parse(localStorage.getItem("products")) || []; // Récupération des produits, si vide alors []

        const bodyTableau = document.getElementById("products");
        bodyTableau.innerHTML = ""; // On vide le tableau

        // On parcourt la liste des produits pour afficher chaque élément
        listeProduits.forEach((element) => {
            const tableRow = document.createElement('tr'); // On créé la ligne du tableau

            // On commence à remplir la ligne
            tableRow.innerHTML = `
                <td class="w-100">${element.name}</td>
                <td>${element.price}</td>
                <td class="stock">${element.stock}</td>
            `;

            bodyTableau.appendChild(tableRow);
        });
    }

    alerteVide();
    displayProducts();
});