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

// Fonction pour remplir le localStorage avec products pour les tests
// A décommenter pour remplir le localStorage puis recommenter pour ne pas écraser les données
// !!! Efface tous les produits présents dans le localStorage !!!
function fillLocalStorage() {
    products.forEach((product) => {
        product.name = product.name.toUpperCase();
    });
    localStorage.setItem('productsList', JSON.stringify(products));
}
//fillLocalStorage();

// Fonction de tri par nom
function sortByName(tableau) {
    return tableau.sort((a, b) => { return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0; });
}

// Fonction de tri par prix
function sortByPrice(tableau) {
    return tableau.sort((a, b) => { return a.price - b.price; });
}

// Fonction de tri par stock
function sortByQuantity(tableau) {
    return tableau.sort((a, b) => { return a.stock - b.stock; });
}

// Fonction de recherche par nom ou par bout de nom
// Retourne un tableau trié correspondant à la recherche
// Si les résultats sont trouvés, ils sont placés en premier
// Si aucun résultat n'est trouvé, une alerte est affichée
function searchName(name) {
    let productsList = JSON.parse(localStorage.getItem('productsList')) || [];
    let matched = [];
    // On parcourt la liste des produits pour trouver les correspondances et on récupère les index
    productsList.forEach((product, key) => {
        let result = product.name.match(name.toUpperCase());
        if (result != null) {
            matched.push(key);
        }
    });

    // Si on a trouvé des correspondances, on les retirant de leur position et on les ajoute au début du tableau
    // Sinon on affiche une alerte
    if (matched.length > 0) {
        matched.forEach((element) => {
            productsList.unshift(productsList.splice(element, 1)[0]); // .splice() renvoie un tableau donc pour récupérer juste l'élément on met [0]
        });
    }
    else {
        alert("Aucune correspondance trouvée");
    }

    return productsList;
}

//Fonction pour vérifier si le stock est vide ou non et affichier l'alerte ainsi que la ligne de tri
function warningEmptyStock() {
    let productsList = JSON.parse(localStorage.getItem("productsList")) || []; // Récupération des produits, si vide alors []

    const divAlert = document.getElementById("alert");
    const sortRow = document.getElementById("sortRow");
    const searchBar = document.getElementById("searchBar");

    if (productsList.length <= 0) {
        divAlert.style.display = "block"; // Si le stock est vide, on affiche l'alerte
        sortRow.style.display = "none"; // On cache la ligne de tri
        searchBar.style.display = "none"; // On cache la barre de recherche

    } else {
        divAlert.style.display = "none"; // Sinon on cache l'alerte
        sortRow.style.display = "table-row"; // On affiche la ligne de tri
        searchBar.style.display = "flex"; // On affiche la barre de recherche
    }
}

// Fonction pour afficher les produits dans le tableau
function displayProducts() {
    let productsList = JSON.parse(localStorage.getItem("productsList")) || []; // Récupération des produits, si vide alors []

    const bodyTable = document.getElementById("products");
    bodyTable.innerHTML = ""; // On vide le tableau

    // On parcourt la liste des produits pour afficher chaque élément
    productsList.forEach((element, key) => {
        const tableRow = document.createElement('tr'); // On créé la ligne du tableau

        // On commence à remplir la ligne
        tableRow.innerHTML = `
                <td class="w-100">${element.name}</td>
                <td>${element.price}</td>
                <td class="stock">${element.stock}</td>
            `;

        // Ajout de couleur pour voir l'état du stock. Vert >10 ; Orange (0 < et < 10) ; Rouge = 0
        // tableRow.children[2] est la cellule du stock
        if (element.stock === 0) {
            tableRow.children[2].classList.add("table-danger");
        } else if (element.stock < 10) {
            tableRow.children[2].classList.add("table-warning");
        } else {
            tableRow.children[2].classList.add("table-success");
        }

        // Création de la cellule pour les boutons +/-
        const tdButtonAddMinus = document.createElement("td");
        tdButtonAddMinus.className = "text-nowrap";

        // Création du bouton de retrait
        const buttonMinus = document.createElement("button");
        buttonMinus.className = "btn btn-primary btn-sm stock-del";
        buttonMinus.innerHTML = "&minus;";
        // On est à l'écoute du clic sur le bouton pour retirer -1 au nombre en stock
        buttonMinus.addEventListener("click", () => {
            //console.log("Retrait");
            // on vérifie s'il reste des éléments à enlever
            if (element.stock > 0) {
                element.stock--;
                localStorage.setItem("productsList", JSON.stringify(productsList));
                productsList = JSON.parse(localStorage.getItem("productsList")) || [];
                displayProducts();
            }
        });

        // Création du bouton d'ajout
        const buttonAdd = document.createElement("button");
        buttonAdd.className = "btn btn-outline-primary btn-sm stock-add";
        buttonAdd.innerHTML = "&plus;";
        // On est à l'écoute du clic sur le bouton pour ajouter +1 au nombre en stock
        buttonAdd.addEventListener("click", () => {
            //console.log("Ajout");
            element.stock++;
            localStorage.setItem("productsList", JSON.stringify(productsList));
            productsList = JSON.parse(localStorage.getItem("productsList")) || [];
            displayProducts();
        });

        tdButtonAddMinus.append(buttonMinus, buttonAdd); // Ajout des boutons dans la cellule

        // Création de la cellule pour le bouton Delete
        const tdDelete = document.createElement("td");
        const buttonDelete = document.createElement("button"); // Création du bouton Delete
        buttonDelete.className = "btn btn-danger btn-sm product-del";
        buttonDelete.innerHTML = "&Cross;";
        // On est à l'écoute du clic sur le bouton pour supprimer le produit du stock
        buttonDelete.addEventListener("click", () => {
            // On affiche une popup d'alerte pour confirmer la suppression
            if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
                // console.log("Suppression");
                //productsList = productsList.filter((produit) => produit.name !== element.name); Ne fonctionne que si le nom est unique sinon supprime tous les produits du même nom
                productsList.splice(key, 1); // Suppression de l'élément du tableau à l'endroit donné. Permet les doublons.
                localStorage.setItem("productsList", JSON.stringify(productsList));
                warningEmptyStock();
                displayProducts();
            }
        });

        tdDelete.appendChild(buttonDelete); // Ajout du bouton à la cellule

        tableRow.append(tdButtonAddMinus, tdDelete); // Ajout des case à la ligne du tableau
        bodyTable.appendChild(tableRow);
    });
}


// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {

    // On récupère les éléments de la barre de recherche
    const inputSearch = document.getElementById("search");
    const buttonSearch = document.getElementById("buttonSearch");

    buttonSearch.addEventListener('click', () => {
        let search = inputSearch.value.toUpperCase();
        localStorage.setItem('productsList', JSON.stringify(searchName(search)));
        displayProducts();
    });

    // On récupère la thead du tableau
    const headTable = document.getElementById("th-table");
    const tableRow = document.createElement('tr'); // On créé une ligne pour le tableau
    tableRow.id = "sortRow";

    // On créé les éléments de la ligne tri du tableau
    // Tri par nom
    const sortName = document.createElement("td");
    sortName.innerHTML = "Tri par nom";
    sortName.className = "sorting";

    // Tri par prix
    const sortPrice = document.createElement("td");
    sortPrice.innerHTML = "Tri par prix";
    sortPrice.className = "sorting";

    // Tri par quantité
    const sortQuantity = document.createElement("td");
    sortQuantity.colSpan = 2;
    sortQuantity.innerHTML = "Tri par quantité";
    sortQuantity.className = "sorting";

    // Icone de suppression totale
    const deleteAll = document.createElement("td");
    let deleteIcon = document.createElement("i");
    deleteIcon.className = "bi bi-trash icon delete-icon";

    // On est à l'écoute du clic sur le nom pour trier par nom
    sortName.addEventListener('click', () => {
        let productsList = JSON.parse(localStorage.getItem('productsList')) || [];
        if (productsList.length > 1) { // On tri uniquement si on a plus d'un produit
            localStorage.setItem('productsList', JSON.stringify(sortByName(productsList)));
            productsList = JSON.parse(localStorage.getItem('productsList')) || [];
            displayProducts();
        }
    });

    // On est à l'écoute du clic sur le prix pour trier par prix
    sortPrice.addEventListener('click', () => {
        let productsList = JSON.parse(localStorage.getItem('productsList')) || [];
        if (productsList.length > 1) { // On tri uniquement si on a plus d'un produit
            localStorage.setItem('productsList', JSON.stringify(sortByPrice(productsList)));
            productsList = JSON.parse(localStorage.getItem('productsList')) || [];
            displayProducts();
        }
    });

    // On est à l'écoute du clic sur la quantité pour trier par quantité
    sortQuantity.addEventListener('click', () => {
        let productsList = JSON.parse(localStorage.getItem('productsList')) || [];
        if (productsList.length > 1) { // On tri uniquement si on a plus d'un produit
            localStorage.setItem('productsList', JSON.stringify(sortByQuantity(productsList)));
            productsList = JSON.parse(localStorage.getItem('productsList')) || [];
            displayProducts();
        }
    });

    // Si l'utilisateur clique sur l'icone alors on efface tout
    deleteIcon.addEventListener("click", () => {
        let productsList = JSON.parse(localStorage.getItem('productsList')) || [];
        if (window.confirm("Voulez-vous supprimer la totalité des produits du stock ?")) {
            //console.log("Suppression totale");
            productsList = [];
            localStorage.setItem("productsList", JSON.stringify(productsList));
            warningEmptyStock();
            displayProducts();
        }
    });

    deleteAll.appendChild(deleteIcon);

    // On ajoute les éléments à la ligne
    tableRow.append(sortName, sortPrice, sortQuantity, deleteAll);

    headTable.appendChild(tableRow); // On ajoute la ligne au tableau

    const form = document.getElementById("form");

    // Formulaire d'ajout d'un produit dans le stock
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Empêche le fonctionnement normal du formulaire
        let productsList = JSON.parse(localStorage.getItem('productsList')) || [];

        // On récupère les éléments du formulaire
        const inputName = document.getElementById("add-name");
        const inputPrice = document.getElementById("add-price");
        const inputStock = document.getElementById("add-stock");

        // On vérifie que les entrées ne sont pas vides
        if (!inputName.value || !inputPrice.value || !inputStock.value) {
            alert("Veuillez remplir tous les champs");
            return;
        }

        // On vérifie que les entrées prix et quantité sont bien des nombres
        if (isNaN(inputPrice.value) || isNaN(inputStock.value)) {
            alert("Veuillez entrer des chiffres dans les champs Prix unitaire et/ou Stock initial");
            return;
        }

        // Vérification de si un produit est déjà dans le tableau (for car forEach ne convient pas ici)
        for (let i = 0; i < productsList.length; i++) {
            if (productsList[i].name.toUpperCase() === inputName.value.toUpperCase()) {
                alert("Ce produit est déjà en stock !");
                inputName.value = "";
                inputPrice.value = "";
                inputStock.value = "";
                return;
            }
        }

        // On créé le produit
        const product = {
            name: inputName.value.toUpperCase(),
            price: parseFloat(inputPrice.value).toFixed(2),
            stock: parseInt(inputStock.value)
        };

        // On l'ajoute à la liste de produit ainsi qu'au localStorage
        productsList.push(product);
        localStorage.setItem("productsList", JSON.stringify(productsList));
        productsList = JSON.parse(localStorage.getItem("productsList")) || [];

        // Une fois le produit créé, on vide les inputs du formulaire
        inputName.value = "";
        inputPrice.value = "";
        inputStock.value = "";

        warningEmptyStock();
        displayProducts();
    });

    warningEmptyStock();
    displayProducts();
});