const api = "https://trankillprojets.fr/wal/wal.php?";
const id = "7f3ce10e9240e27e3bedf1495d90b9015eef7becb4a9839a2ced5fa05185cb34";

const inscription = (pseudo, email) =>
    fetch(api + "inscription&identite=" + pseudo + "&mail=" + email)
        .then(
            (res) =>
                setTimeout(() => {
                    document.getElementById("inscrp").innerHTML += "Un email vous a été envoyé";
                }, 100),

            setTimeout(() => {
                document.getElementById("inscrp").hidden = true;
                document.getElementById("connex").hidden = false;
            }, 3000)
        )
        .catch((err) => console.error("Erreur:", err));

const activation = (cle_activation) =>
    fetch(api + "activation=" + cle_activation)
        .then((res) =>
            res.json().then((json) => {
                document.getElementById("connex").hidden = true;
                document.getElementById("commandes").hidden = false;
            })
        )
        .catch((err) => console.error("Erreur:", err));

const addRelation = (email) => {
    fetch(api + "lier&identifiant=" + id + "&mail=" + email)
        .then((res) => res.json().then((json) => console.log(json)))
        .catch((err) => console.error("Erreur:", err));
};

const getRelations = (id) =>
    fetch(api + "relations&identifiant=" + id)
        .then((res) => res.json().then((json) => json.relations))
        .catch((err) => console.error("Erreur:", err));

const delContact = (email) =>
    fetch(api + "delier&identifiant=" + id + "&mail=" + email)
        .then((res) => res.json().then((json) => console.log(json)))
        .catch((err) => console.error("Erreur:", err));

const sendMessage = (id, id_relation, texte) =>
    fetch(api + "ecrire&identifiant=" + id + "&relation=" + id_relation + "&message=" + texte)
        .then((res) => res.json().then((json) => console.log(json)))
        .catch((err) => console.error("Erreur:", err));

const readMessage = (id, id_relation) =>
    fetch(api + "lire&identifiant=" + id + "&relation=" + id_relation)
        .then((res) => res.json().then((json) => console.log(json)))
        .catch((err) => console.error("Erreur:", err));

setInterval(() => {
    // console.clear();
    getRelations(id)
        .then((rels) => {
            for (let rel of rels) {
                console.log(rel.identite);
            }
        })
        .catch((err) => console.error("Erreur:", err));
}, 1000);
