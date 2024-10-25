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
    localStorage.setItem('listeProduits', JSON.stringify(products));
}
fillLocalStorage();

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {

    //Fonction pour véifier si le stock est vide ou non et affichier l'alerte
    function alerteVide() {
        let listeProduits = JSON.parse(localStorage.getItem("listeProduits")) || []; // Récupération des produits, si vide alors []

        const divAlert = document.getElementById('alert');

        if (listeProduits.lenght <= 0) {
            divAlert.style.display = "block"; // Si le stock est vide, on affiche l'alerte
        } else {
            divAlert.style.display = "none"; // Sinon on cache l'alerte
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

            const tdButtonAddMinus = document.createElement("td"); // Création de la cellule pour les boutons +/-
            tdButtonAddMinus.className = "text-nowrap";

            const buttonMinus = document.createElement("button"); // Création du bouton de retrait
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
                    alerteVide();
                    displayProducts();
                }
            });

            const buttonAdd = document.createElement("button"); // Création du bouton d'ajout
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

            const tdDelete = document.createElement("td"); // Création de la cellule pour le bouton Delete
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

    // Création de la div contenant l'icone de suppression totale du stock
    const divDeleteAll = document.getElementById("delete-all");
    // Icone de suppression
    let deleteIcon = document.createElement("i");
    deleteIcon.className = "bi bi-trash icon delete-icon";

    // Si l'utilisateur clique sur l'icone alors on efface tout
    deleteIcon.addEventListener("click", () => {
        if (window.confirm("Voulez-vous supprimer la totalité des produits du stock ?")) {
            //console.log("Suppression totale");
            listeProduits = [];
            localStorage.setItem("listeProduits", JSON.stringify(listeProduits));
            alerteVide();
            displayProducts();
        }
    });

    // Ajout de l'icone dans le html
    divDeleteAll.appendChild(deleteIcon);

    const formulaire = document.getElementById("ajoutForm");

    // Formulaire d'ajout d'un produit dans le stock
    formulaire.addEventListener('submit', (e) => {
        e.preventDefault(); // Empêche le fonctionnement normal du formulaire

        let listeProduits = JSON.parse(localStorage.getItem("listeProduits")) || [];

        // On récupère les éléments du formulaire
        const inputName = document.getElementById("add-name");
        const inputPrice = document.getElementById("add-price");
        const inputStock = document.getElementById("add-stock");

        // On vérifie que les entrées ne sont pas vides
        if (!inputName.value || !inputPrice || !inputStock) {
            alert("Veuillez remplir tous les champs");
            return;
        }

        // On créé le produit
        const produit = {
            name: inputName.value,
            price: parseFloat(inputPrice.value),
            stock: parseInt(inputStock.value)
        };

        // Une fois le produit créé, on vide les inputs du formulaire
        inputName.value = "";
        inputPrice.value = "";
        inputStock.value = "";

        // On l'ajoute à la liste de produit ainsi qu'au localStorage
        listeProduits.push(produit);
        localStorage.setItem("listeProduits", JSON.stringify(listeProduits));
        listeProduits = JSON.parse(localStorage.getItem("listeProduits")) || [];

        alerteVide();
        displayProducts();
    });

    alerteVide();
    displayProducts();
});