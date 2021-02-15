const api = "https://trankillprojets.fr/wal/wal.php?";
let id = 0;

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
                    showConnexPage();
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

                    document.getElementById("connex").classList.add("invisible");
                    console.log("add invisible to connex");

                    document.getElementById("contacts").hidden = false;
                    setTimeout(() => {
                        document.getElementById("connex").hidden = true;
                    }, 500);

                    getRelations(id);
                    document.getElementById("locate").innerHTML = "Contacts";
                }
            })
        )
        .catch((err) => console.error("Erreur:", err));

const addRelation = (email) => {
    fetch(api + "lier&identifiant=" + id + "&mail=" + email)
        .then((res) =>
            res.json().then(() => {
                document.getElementById("newC").hidden = true;
                document.getElementById("contacts").hidden = false;
                getRelations(id);
            })
        )
        .catch((err) => console.error("Erreur:", err));
};

const getRelations = (id) =>
    fetch(api + "relations&identifiant=" + id)
        .then((res) =>
            res.json().then((json) => {
                document.getElementById("contacts_list").innerHTML = "";
                let i = 0;
                for (let c of json.relations) {
                    let nc = document.createElement("div");
                    nc.classList.add("cts");

                    let n = document.createElement("span");
                    n.id = c.relation;
                    n.innerHTML = c.identite;
                    n.classList.add("name");

                    let pp = document.createElement("div");
                    pp.classList.add("pp");
                    pp.innerHTML = '<i class="fas fa-id-badge"></i>';

                    let m = document.createElement("i");
                    m.setAttribute("id", "del_c");
                    m.classList.add("fas");
                    m.classList.add("fa-trash-alt");
                    m.onclick = (e) => delContact(id.innerHTML);

                    nc.appendChild(pp);
                    nc.appendChild(n);
                    nc.appendChild(m);
                    nc.onclick = (e) => {
                        document.getElementById("back").classList.add("visible3");
                        document.getElementById("locate").innerHTML = e.target.innerHTML;
                        document.getElementById("more-infos").innerHTML = e.target.id;
                        document.getElementById("contacts").hidden = true;
                        document.getElementById("contacts").classList.add("invisible");
                        document.getElementById("tchat").hidden = false;
                        document.getElementById("tchat").classList.remove("invisible");
                        readMessage(e.target.id);
                        let i = setInterval(() => readMessage(document.getElementById("more-infos").innerHTML), 500);
                    };
                    setTimeout(() => {
                        document.getElementById("contacts_list").appendChild(nc);
                    }, 250 * i++);
                }
            })
        )
        .catch((err) => console.error("Erreur:", err));

const delContact = (idrel) =>
    fetch(api + "delier&identifiant=" + id + "&relation=" + idrel)
        .then((res) =>
            res.json().then((json) => {
                getRelations(id);
            })
        )
        .catch((err) => console.error("Erreur:", err));

const sendMessage = (id_relation, texte) =>
    fetch(api + "ecrire&identifiant=" + id + "&relation=" + id_relation + "&message=" + texte)
        .then((res) => {
            // console.log(res.url);
            res.json().then((json) => {
                // console.log(json);
                document.getElementById("newmsg_w").innerHTML = "";
                readMessage(id_relation);
            });
        })
        .catch((err) => console.error("Erreur:", err));

const readMessage = (id_relation) =>
    fetch(api + "lire&identifiant=" + id + "&relation=" + id_relation)
        .then((res) => {
            // console.log(res.url);
            res.json().then((json) => {
                console.log(json.messages);
                for (let m of json.messages) {
                    console.log(m);
                    let nm = document.createElement("div");
                    nm.classList.add("left");

                    let o = document.createElement("div");
                    o.classList.add("owner");
                    o.innerHTML = m.identite;

                    let msg = document.createElement("div");
                    msg.classList.add("msg");
                    msg.innerHTML = m.message;

                    nm.appendChild(o);
                    nm.appendChild(msg);

                    document.getElementById("messages").appendChild(nm);
                }
            });
        })
        .catch((err) => console.error("Erreur:", err));

function showConnexPage() {
    setTimeout(() => {
        document.getElementById("locate").innerHTML = "Connexion";

        document.getElementById("inscrp").classList.add("invisible");

        setTimeout(() => {
            document.getElementById("inscrp").hidden = true;
            document.getElementById("connex").hidden = false;
            setTimeout(() => {
                document.getElementById("connex").classList.remove("invisible");
            }, 200);
        }, 500);
    }, 300);
}
function showNewCPage() {
    setTimeout(() => {
        document.getElementById("contacts").hidden = true;
        document.getElementById("newC").hidden = false;
        document.getElementById("newC").focus;
    }, 300);
}

function showContactsPage() {
    document.getElementById("back").classList.remove("visible3");
    document.getElementById("locate").innerHTML = "Contacts";
    document.getElementById("more-infos").innerHTML = "";
    document.getElementById("contacts").hidden = false;
    document.getElementById("contacts").classList.remove("invisible");
}
