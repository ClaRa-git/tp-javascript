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
    console.log('%c🚀', 'font-size:180px');
    // Votre code ici !
});