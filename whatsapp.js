const api = "https://trankillprojets.fr/wal/wal.php?";
let id = 0;
//"50b4031d019f97efb98c79cbdd92dcce02e872334ef1de330f8f378fa798dd82";

const isEmail = (val) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val);

const checkinputsinscrp = () => {
    let isemail = isEmail(document.getElementById("inscrp_inp2").value);
    if (isemail && document.getElementById("inscrp_inp1").value.length > 2) {
        document.getElementById("inscrp_btn").classList.remove("disabled");
        let m = document.getElementById("checkemail");
        m.innerHTML = "Email valid";
        m.setAttribute("style", "color: green");
    } else if (isemail) {
        let m = document.getElementById("checkemail");
        m.innerHTML = "Email valid";
        m.setAttribute("style", "color: green");
    } else {
        document.getElementById("inscrp_btn").classList.add("disabled");
    }
};

const checkinputsconnex = () => {
    let i = document.getElementById("connex_inp1").value.length;
    if (i == 64) {
        document.getElementById("connex_btn").classList.remove("disabled");
        let m = document.getElementById("checkconnex");
        m.innerHTML = "Valid id";
        m.setAttribute("style", "color: green");
    } else {
        document.getElementById("connex_btn").classList.add("disabled");
        let m = document.getElementById("checkconnex");
        m.innerHTML = "Inalid id";
        m.setAttribute("style", "color: red");
    }
};

document.getElementById("inscrp_inp1").addEventListener("input", (e) => checkinputsinscrp());
document.getElementById("inscrp_inp2").addEventListener("input", (e) => checkinputsinscrp());
document.getElementById("connex_inp1").addEventListener("input", (e) => checkinputsconnex());

const inscription = (pseudo, email) =>
    fetch(api + "inscription&identite=" + pseudo.trim().replace(" ", "%20") + "&mail=" + email)
        .then((res) => {
            if (!document.getElementById("inscrp_btn").classList.contains("disabled")) {
                setTimeout(() => {
                    document.getElementById("inscrp").innerHTML += "An email has been sent to you";
                }, 100);
                setTimeout(() => {
                    document.getElementById("inscrp").hidden = true;
                    document.getElementById("connex").hidden = false;
                }, 3000);
            }
        })
        .catch((err) => console.error("Erreur:", err));

const activation = (cle_activation) =>
    fetch(api + "activation=" + cle_activation)
        .then((res) =>
            res.json().then((json) => {
                if (!document.querySelector("#connex_btn").classList.contains("disabled")) {
                    id = document.querySelector("#connex_inp1").value;
                    document.getElementById("connex").hidden = true;
                    getRelations(id);
                    document.getElementById("contacts").hidden = false;
                }
            })
        )
        .catch((err) => console.error("Erreur:", err));

const addRelation = (email) => {
    fetch(api + "lier&identifiant=" + id + "&mail=" + email)
        .then((res) =>
            res.json().then((json) => {
                document.getElementById("newC").hidden = true;
                document.getElementById("contacts_list").setAttribute("style", "filter: brightness(1);");
                document.getElementById("contacts").hidden = false;
            })
        )
        .catch((err) => console.error("Erreur:", err));
};

const getRelations = (id) =>
    fetch(api + "relations&identifiant=" + id)
        .then((res) =>
            res.json().then((json) => {
                document.getElementById("contacts_list").innerHTML = "";
                for (let c of json.relations) {
                    let nc = document.createElement("div");
                    nc.classList.add("cts");

                    let n = document.createElement("span");
                    n.setAttribute("id", "name");
                    n.innerHTML = c.identite;

                    let id = document.createElement("span");
                    id.setAttribute("id", "idrel" + n.innerHTML);
                    id.innerHTML = c.relation;
                    id.hidden = true;

                    let pp = document.createElement("div");
                    pp.setAttribute("id", "pp");
                    pp.innerHTML = '<i class="fas fa-id-badge"></i>';

                    let m = document.createElement("i");
                    m.setAttribute("id", "del_c");
                    m.classList.add("fas");
                    m.classList.add("fa-trash-alt");
                    m.onclick = (e) => delContact(id.innerHTML);

                    nc.appendChild(id);
                    nc.appendChild(pp);
                    nc.appendChild(n);
                    nc.appendChild(m);
                    document.getElementById("contacts_list").appendChild(nc);
                }
            })
        )
        .catch((err) => console.error("Erreur:", err));

const delContact = (idrel) =>
    fetch(api + "delier&identifiant=" + id + "&relation=" + idrel)
        .then((res) => {
            console.log(idrel);
            console.log(res.url);
            res.json().then((json) => {
                getRelations(id);
            });
        })
        .catch((err) => console.error("Erreur:", err));

const sendMessage = (id, id_relation, texte) =>
    fetch(api + "ecrire&identifiant=" + id + "&relation=" + id_relation + "&message=" + texte)
        .then((res) => res.json().then((json) => console.log(json)))
        .catch((err) => console.error("Erreur:", err));

const readMessage = (id, id_relation) =>
    fetch(api + "lire&identifiant=" + id + "&relation=" + id_relation)
        .then((res) => res.json().then((json) => console.log(json)))
        .catch((err) => console.error("Erreur:", err));

function showConnexPage() {
    setTimeout(() => {
        document.getElementById("inscrp").hidden = true;
        document.getElementById("connex").hidden = false;
    }, 300);
}
function showNewCPage() {
    setTimeout(() => {
        document.getElementById("contacts").hidden = true;
        document.getElementById("newC").hidden = false;
        document.getElementById("newC").focus;
    }, 300);
}
