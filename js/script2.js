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
function triParNom(tableau) {
    return [...tableau].sort((a, b) => { return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0; });
}

// Fonction de tri par prix
function triParPrix(tableau) {
    return [...tableau].sort((a, b) => { return a.price - b.price; });
}

// Fonction de tri par stock
function triParStock(tableau) {
    return [...tableau].sort((a, b) => { return a.stock - b.stock; });
}


// Vérifie si le stock est vide ou non
function alerteVide() {
    let listeProduits = JSON.parse(localStorage.getItem('listeProduits')) || [];

    const divAlert = document.getElementById('alert');

    if (listeProduits.length <= 0) {
        divAlert.style.display = 'block';
    } else {
        divAlert.style.display = 'none';
    }
}

function displayProducts() {
    let listeProduits = JSON.parse(localStorage.getItem('listeProduits')) || [];

    const thName = document.getElementById('productName');
    thName.title = "Cliquez pour trier par nom";

    thName.addEventListener('click', () => {
        localStorage.setItem('listeProduits', JSON.stringify(triParNom(listeProduits)));
        listeProduits = JSON.parse(localStorage.getItem('listeProduits')) || [];
        displayProducts();
    });

    const thPrice = document.getElementById('productPrice');
    thPrice.title = "Cliquez pour trier par prix";

    thPrice.addEventListener('click', () => {
        localStorage.setItem('listeProduits', JSON.stringify(triParPrix(listeProduits)));
        listeProduits = JSON.parse(localStorage.getItem('listeProduits')) || [];
        displayProducts();
    });

    const thStock = document.getElementById('productStock');
    thStock.title = "Cliquez pour trier par stock";

    thStock.addEventListener('click', () => {
        localStorage.setItem('listeProduits', JSON.stringify(triParStock(listeProduits)));
        listeProduits = JSON.parse(localStorage.getItem('listeProduits')) || [];
        displayProducts();
    });

    const bodyTableau = document.getElementById('products');
    bodyTableau.innerHTML = '';

    listeProduits.forEach((element, key) => {
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
            <td class="w-100">${element.name.toUpperCase()}</td>
            <td>${element.price}</td>
            <td class="stock">${element.stock}</td>
        `;
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

        const tdButtonAddMinus = document.createElement('td'); // Création de la cellule pour les boutons d'ajout et de suppression
        tdButtonAddMinus.classList.add('text-nowrap');

        const buttonMinus = document.createElement('button'); // Création du bouton de soustraction
        buttonMinus.classList.add('btn', 'btn-primary', 'btn-sm', 'stock-del');
        buttonMinus.innerHTML = '&minus;';
        buttonMinus.addEventListener('click', function () {
            if (element.stock > 0) {
                element.stock--;
                localStorage.setItem('listeProduits', JSON.stringify(listeProduits));
                listeProduits = JSON.parse(localStorage.getItem('listeProduits')) || [];
                displayProducts();
            }
        });

        const buttonAdd = document.createElement('button'); // Création du bouton d'ajout
        buttonAdd.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'stock-add');
        buttonAdd.innerHTML = '&plus;';
        buttonAdd.addEventListener('click', function () {
            element.stock++;
            localStorage.setItem('listeProduits', JSON.stringify(listeProduits));
            listeProduits = JSON.parse(localStorage.getItem('listeProduits')) || [];
            displayProducts();
        });

        tdButtonAddMinus.append(buttonMinus, buttonAdd); // Ajout des boutons dans la cellule

        const tdDelete = document.createElement('td'); // Création de la cellule pour le bouton de suppression
        tdDelete.style.textAlign = "center";
        const buttonDelete = document.createElement('button');
        buttonDelete.classList.add('btn', 'btn-danger', 'btn-sm', 'product-del');
        buttonDelete.innerHTML = '&Cross;';
        buttonDelete.addEventListener('click', function () {
            if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
                //listeProduits = listeProduits.filter((produit) => produit.name !== element.name); Ne fonctionne que si le nom est unique sinon supprime tous les produits du même nom
                listeProduits.splice(key, 1); // Suppression de l'élément du tableau à l'endroit donné. Permet les doublons.
                localStorage.setItem('listeProduits', JSON.stringify(listeProduits));
                alerteVide();
                displayProducts();
            }
        });

        tdDelete.append(buttonDelete);

        tableRow.append(tdButtonAddMinus, tdDelete);
        bodyTableau.appendChild(tableRow);
    });
}

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {

    const divDeleteAll = document.getElementById("deleteAll");
    let iconDelete = document.createElement("i");
    iconDelete.className = "bi bi-trash icon delete-icon";

    iconDelete.addEventListener('click', () => {
        if (window.confirm("Voulez-vous supprimer tout le stock ?")) {
            console.log("Suppression totale");
            listeProduits = [];
            localStorage.setItem('listeProduits', JSON.stringify(listeProduits));
            alerteVide();
            displayProducts();
        }
    });

    divDeleteAll.appendChild(iconDelete);

    const formulaire = document.getElementById("ajoutForm");

    formulaire.addEventListener('submit', (e) => {
        e.preventDefault();

        let listeProduits = JSON.parse(localStorage.getItem('listeProduits')) || [];
        const inputName = document.getElementById("add-name");
        const inputPrice = document.getElementById("add-price");
        const inputStock = document.getElementById("add-stock");

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

        const produit = {
            name: inputName.value.toUpperCase(),
            price: parseFloat(inputPrice.value).toFixed(2),
            stock: parseInt(inputStock.value)
        };

        inputName.value = '';
        inputPrice.value = '';
        inputStock.value = '';

        listeProduits.push(produit);
        localStorage.setItem("listeProduits", JSON.stringify(listeProduits));
        listeProduits = JSON.parse(localStorage.getItem('listeProduits')) || [];
        alerteVide();
        displayProducts();
    });

    alerteVide();
    displayProducts();
});