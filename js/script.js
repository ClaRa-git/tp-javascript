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
    localStorage.setItem('listeProduits', JSON.stringify(products));
}
//fillLocalStorage();

// Fonction de tri par nom
function sortByName(tableau) {
    //[...tableau] permet de copier le tableau pour ne pas modifier l'original
    return [...tableau].sort((a, b) => { return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0; });
}

// Fonction de tri par prix
function sortByPrice(tableau) {
    return [...tableau].sort((a, b) => { return a.price - b.price; });
}

// Fonction de tri par stock
function sortByQuantity(tableau) {
    return [...tableau].sort((a, b) => { return a.stock - b.stock; });
}

//Fonction pour vérifier si le stock est vide ou non et affichier l'alerte ainsi que la ligne de tri
function alerteVide() {
    let listeProduits = JSON.parse(localStorage.getItem("listeProduits")) || []; // Récupération des produits, si vide alors []

    const divAlert = document.getElementById("alert");
    const ligneTri = document.getElementById("tri");

    if (listeProduits.length <= 0) {
        divAlert.style.display = "block"; // Si le stock est vide, on affiche l'alerte
        ligneTri.style.display = "none"; // On cache la ligne de tri
    } else {
        divAlert.style.display = "none"; // Sinon on cache l'alerte
        ligneTri.style.display = "table-row"; // On affiche la ligne de tri
    }
}

// Fonction pour afficher les produits dans le tableau
function displayProducts() {
    let listeProduits = JSON.parse(localStorage.getItem("listeProduits")) || []; // Récupération des produits, si vide alors []

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

        // Ajout de couleur pour voir l'état du stock. Vert >10 ; Orange (0 < et < 10) ; Rouge = 0
        // On enlève les classes qui ne sont pas pertinente (pas d'erreur si elles n'existent pas)
        if (element.stock === 0) {
            tableRow.classList.add("table-danger");
            tableRow.classList.remove("table-warning");
            tableRow.classList.remove("table-success");
        } else if (element.stock < 10) {
            tableRow.classList.remove("table-danger");
            tableRow.classList.add("table-warning");
            tableRow.classList.remove("table-success");
        } else {
            tableRow.classList.remove("table-danger");
            tableRow.classList.remove("table-warning");
            tableRow.classList.add("table-success");
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
                localStorage.setItem("listeProduits", JSON.stringify(listeProduits));
                listeProduits = JSON.parse(localStorage.getItem("listeProduits")) || [];
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
            localStorage.setItem("listeProduits", JSON.stringify(listeProduits));
            listeProduits = JSON.parse(localStorage.getItem("listeProduits")) || [];
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
            //console.log("Suppresion");
            // On affiche une popup d'alerte pour confirmer la suppression
            if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
                // console.log("Suppression");
                listeProduits = listeProduits.filter((produit) => produit.name !== element.name);
                localStorage.setItem("listeProduits", JSON.stringify(listeProduits));
                alerteVide();
                displayProducts();
            }
        });

        tdDelete.appendChild(buttonDelete); // Ajout du bouton à la cellule

        tableRow.append(tdButtonAddMinus, tdDelete); // Ajout des case à la ligne du tableau
        bodyTableau.appendChild(tableRow);
    });
}


// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {

    // On récupère la thead du tableau
    const headTableau = document.getElementById("th-table");
    const tr = document.createElement('tr'); // On créé une ligne pour le tableau
    tr.id = "tri";

    // On créé les éléments de la ligne tri du tableau
    // Tri par nom
    const sortName = document.createElement("td");
    sortName.innerHTML = "Tri par nom";
    sortName.className = "tri";

    // Tri par prix
    const sortPrice = document.createElement("td");
    sortPrice.innerHTML = "Tri par prix";
    sortPrice.className = "tri";

    // Tri par quantité
    const sortQuantity = document.createElement("td");
    sortQuantity.colSpan = 2;
    sortQuantity.innerHTML = "Tri par quantité";
    sortQuantity.className = "tri";

    // Icone de suppression totale
    const deleteAll = document.createElement("td");
    let deleteIcon = document.createElement("i");
    deleteIcon.className = "bi bi-trash icon delete-icon";

    // On est à l'écoute du clic sur le nom pour trier par nom
    sortName.addEventListener('click', () => {
        let listeProduits = JSON.parse(localStorage.getItem('listeProduits')) || [];
        if (listeProduits.length > 1) { // On tri uniquement si on a plus d'un produit
            localStorage.setItem('listeProduits', JSON.stringify(sortByName(listeProduits)));
            listeProduits = JSON.parse(localStorage.getItem('listeProduits')) || [];
            displayProducts();
        }
    });

    // On est à l'écoute du clic sur le prix pour trier par prix
    sortPrice.addEventListener('click', () => {
        let listeProduits = JSON.parse(localStorage.getItem('listeProduits')) || [];
        if (listeProduits.length > 1) { // On tri uniquement si on a plus d'un produit
            localStorage.setItem('listeProduits', JSON.stringify(sortByPrice(listeProduits)));
            listeProduits = JSON.parse(localStorage.getItem('listeProduits')) || [];
            displayProducts();
        }
    });

    // On est à l'écoute du clic sur la quantité pour trier par quantité
    sortQuantity.addEventListener('click', () => {
        let listeProduits = JSON.parse(localStorage.getItem('listeProduits')) || [];
        if (listeProduits.length > 1) { // On tri uniquement si on a plus d'un produit
            localStorage.setItem('listeProduits', JSON.stringify(sortByQuantity(listeProduits)));
            listeProduits = JSON.parse(localStorage.getItem('listeProduits')) || [];
            displayProducts();
        }
    });

    // Si l'utilisateur clique sur l'icone alors on efface tout
    deleteIcon.addEventListener("click", () => {
        let listeProduits = JSON.parse(localStorage.getItem('listeProduits')) || [];
        if (window.confirm("Voulez-vous supprimer la totalité des produits du stock ?")) {
            //console.log("Suppression totale");
            listeProduits = [];
            localStorage.setItem("listeProduits", JSON.stringify(listeProduits));
            alerteVide();
            displayProducts();
        }
    });

    deleteAll.appendChild(deleteIcon);

    // On ajoute les éléments à la ligne
    tr.append(sortName, sortPrice, sortQuantity, deleteAll);

    headTableau.appendChild(tr); // On ajoute la ligne au tableau

    const formulaire = document.getElementById("ajoutForm");

    // Formulaire d'ajout d'un produit dans le stock
    formulaire.addEventListener('submit', (e) => {
        e.preventDefault(); // Empêche le fonctionnement normal du formulaire
        let listeProduits = JSON.parse(localStorage.getItem('listeProduits')) || [];

        // On récupère les éléments du formulaire
        const inputName = document.getElementById("add-name");
        const inputPrice = document.getElementById("add-price");
        const inputStock = document.getElementById("add-stock");

        // On vérifie que les entrées ne sont pas vides
        if (!inputName.value || !inputPrice.value || !inputStock.value) {
            alert("Veuillez remplir tous les champs");
            return;
        }

        // Vérification de si un produit est déjà dans le tableau (for car forEach ne convient pas ici)
        for (let i = 0; i < listeProduits.length; i++) {
            if (listeProduits[i].name.toUpperCase() === inputName.value.toUpperCase()) {
                alert("Ce produit est déjà en stock !");
                inputName.value = "";
                inputPrice.value = "";
                inputStock.value = "";
                return;
            }
        }

        // On créé le produit
        const produit = {
            name: inputName.value.toUpperCase(),
            price: parseFloat(inputPrice.value).toFixed(2),
            stock: parseInt(inputStock.value)
        };

        // On l'ajoute à la liste de produit ainsi qu'au localStorage
        listeProduits.push(produit);
        localStorage.setItem("listeProduits", JSON.stringify(listeProduits));
        listeProduits = JSON.parse(localStorage.getItem("listeProduits")) || [];

        // Une fois le produit créé, on vide les inputs du formulaire
        inputName.value = "";
        inputPrice.value = "";
        inputStock.value = "";

        alerteVide();
        displayProducts();
    });

    alerteVide();
    displayProducts();
});