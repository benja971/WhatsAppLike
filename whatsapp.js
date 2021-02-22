const api = "https://trankillprojets.fr/wal/wal.php?";
let user = { id: 0, name: "", email: "" },
    ints,
    discs = new Map();

const isEmail = (val) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val);

const checkinputsinscrp = () => {
    let isemail = isEmail(document.getElementById("inscrp_inp2").value);
    let m = document.getElementById("checkemail");
    if (isemail && document.getElementById("inscrp_inp1").value.length > 2) {
        document.getElementById("inscrp_btn").classList.remove("disabled");
        m.innerHTML = "Valid email";
        m.setAttribute("style", "color: green");
    } else if (isemail) {
        let m = document.getElementById("checkemail");
        m.innerHTML = "Email valid";
        m.setAttribute("style", "color: green");
    } else {
        document.getElementById("inscrp_btn").classList.add("disabled");
        m.innerHTML = "Invalid email";
        m.setAttribute("style", "color: red");
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

const checkinputsNewC = () => {
    if (isEmail(document.getElementById("newC_inp1").value)) {
        document.getElementById("newC_btn").classList.remove("disabled");
    } else {
        document.getElementById("inscrp_btn").classList.add("disabled");
    }
};

document.getElementById("inscrp_inp1").addEventListener("input", (e) => checkinputsinscrp());
document.getElementById("inscrp_inp2").addEventListener("input", (e) => checkinputsinscrp());
document.getElementById("connex_inp1").addEventListener("input", (e) => checkinputsconnex());
document.getElementById("newC_inp1").addEventListener("input", (e) => checkinputsNewC());

const inscription = (pseudo, email) =>
    fetch(api + "inscription&identite=" + pseudo.trim().replace(" ", "%20") + "&mail=" + email)
        .then((res) => {
            res.json().then(() => {
                if (!document.getElementById("inscrp_btn").classList.contains("disabled")) {
                    document.getElementById("msg_insc").innerHTML = "An email has been sent to you";
                    document.getElementById("inscrp_inp1").value = "";
                    document.getElementById("inscrp_inp2").value = "";
                    setTimeout(() => showConnexPage(), 30);
                }
            });
        })
        .catch((err) => console.error("Erreur:", err));

const activation = (cle_activation) =>
    fetch(api + "activation=" + cle_activation)
        .then((res) => res.json())
        .then(() => {
            if (!document.getElementById("connex_btn").classList.contains("disabled")) {
                user.id = document.getElementById("connex_inp1").value;
                showContactsPage();
                getRelations(user.id);
                getParameters(user.id);
            }
        })
        .catch((err) => console.error("Erreur:", err));

const getParameters = (id) => {
    fetch(api + "information&identifiant=" + id)
        .then((res) => res.json())
        .then((json) => {
            user.id = json.identifiant;
            user.name = json.identite;
            user.email = json.mail;
            document.getElementById("user_id").innerHTML = "ID: " + json.identifiant;
            document.getElementById("user_name").innerHTML = "Name: " + json.identite;
            document.getElementById("user_email").innerHTML = "Email: " + json.mail;
        })
        .catch((err) => console.error("Erreur:", err));
};

const addRelation = (id, email) => {
    fetch(api + "lier&identifiant=" + id + "&mail=" + email)
        .then((res) => res.json())
        .then(() => {
            if (!document.getElementById("newC_btn").classList.contains("disabled")) {
                hideNewCpage();
                showContactsPage();
                getRelations(id);
                document.getElementById("newC_inp1").value = "";
            }
        })
        .catch((err) => console.error("Erreur:", err));
};

const getRelations = (id) =>
    fetch(api + "relations&identifiant=" + id)
        .then((res) => res.json())
        .then((json) => {
            document.getElementById("contacts_list").innerHTML = "";
            for (let i in json.relations) {
                let nc = document.createElement("div");
                nc.classList.add("cts");

                let n = document.createElement("span");
                n.id = json.relations[i].relation;
                n.innerHTML = json.relations[i].identite;
                n.classList.add("name");

                let pp = document.createElement("i");
                pp.classList.add("fas");
                pp.classList.add("fa-id-badge");
                pp.classList.add("pp");

                let m = document.createElement("i");
                m.classList.add("fas");
                m.classList.add("fa-trash-alt");
                m.classList.add("del_c");
                m.onclick = (e) => delContact(id, json.relations[i].relation);

                nc.appendChild(pp);
                nc.appendChild(n);
                nc.appendChild(m);
                nc.onclick = (e) => {
                    if (!e.target.classList.contains("fas")) {
                        showTchatPage(e);
                    }
                };
                setTimeout(() => document.getElementById("contacts_list").appendChild(nc), 30 * (i + 1));
            }
        })
        .catch((err) => console.error("Erreur:", err));

const delContact = (id, idrel) =>
    fetch(api + "delier&identifiant=" + id + "&relation=" + idrel)
        .then((res) => res.json())
        .then(() => getRelations(id))
        .catch((err) => console.error("Erreur:", err));

const sendMessage = (id, id_relation, texte) =>
    fetch(api + "ecrire&identifiant=" + id + "&relation=" + id_relation + "&message=" + texte)
        .then((res) => {
            console.log(res.url);
            res.json();
        })
        .then(() => {
            document.getElementById("newmsg_w").innerHTML = "";
            readMessage(id, id_relation);
        })
        .catch((err) => console.error("Erreur:", err));

const readMessage = (id, id_relation) =>
    fetch(api + "lire&identifiant=" + id + "&relation=" + id_relation)
        .then((res) => res.json())
        .then((json) => {
            for (let m of json.messages) {
                let nm = document.createElement("div");
                if (m.identite == user.name) nm.classList.add("right");
                else nm.classList.add("left");

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
        })
        .catch((err) => {
            console.error("Erreur:", err);
        });

function showConnexPage() {
    document.getElementById("locate").innerHTML = "Connexion";
    document.getElementById("inscrp").classList.add("hide_at_right");
    document.getElementById("connex").classList.remove("hide_at_right");
}

function showContactsPage() {
    okforclick();
    document.getElementById("profilepage").classList.add("hide_at_right");
    document.getElementById("newC").classList.add("hide_at_right");
    document.getElementById("locate").innerHTML = "Contacts";
    hideTchatPage();
    document.getElementById("profile").classList.add("visible");
    document.getElementById("connex").classList.add("hide_at_right");
    document.getElementById("newmsg").classList.add("hide_at_right");
    document.getElementById("contacts").classList.remove("hide_at_right");
    document.getElementById("add_c").classList.remove("hide_at_right");
    document.getElementById("tchat").classList.remove("hide_at_right");
}

function showNewCPage() {
    dontclick();
    document.getElementById("newC").classList.remove("hide_at_right");
    document.getElementById("profile").classList.remove("visible");
    document.getElementById("back").classList.add("visible");
}

function showTchatPage(e) {
    document.getElementById("locate").innerHTML = e.target.innerHTML;
    document.getElementById("more-infos").innerHTML = e.target.id;
    document.getElementById("back").classList.add("visible");
    document.getElementById("profile").classList.remove("visible");
    document.getElementById("newmsg").hidden = false;
    let contactsList = [...document.querySelectorAll(".cts")];
    for (let i in contactsList) {
        setTimeout(contactsList[i].classList.add("reverse"), 30 * (i + 1));
    }
    setTimeout(() => {
        document.getElementById("contacts").classList.add("mobile");
    }, 120 * contactsList.length);
}

function hideTchatPage() {
    document.getElementById("more-infos").innerHTML = "";
    document.getElementById("contacts").classList.remove("mobile");
    document.getElementById("back").classList.remove("visible");
    document.getElementById("newmsg").hidden = true;
    let contactsList = [...document.querySelectorAll(".cts")];
    for (let i in contactsList) setTimeout(contactsList[i].classList.remove("reverse"), 300 * (i + 1));
}

function showProfilePage() {
    dontclick();
    document.getElementById("locate").innerHTML = "Profile";
    document.getElementById("back").classList.add("visible");
    document.getElementById("profile").classList.remove("visible");
    document.getElementById("profilepage").classList.remove("hide_at_right");
    document.getElementById("profilepage").focus;
}

function hideProfilePage() {}

function dontclick() {
    document.getElementById("contacts").setAttribute("style", "pointer-events: none");
    document.getElementById("tchat").setAttribute("style", "pointer-events: none");
}
function okforclick() {
    console.log(document.getElementById("contacts"), document.getElementById("tchat"));
    document.getElementById("contacts").setAttribute("style", "pointer-events: all");
    document.getElementById("tchat").setAttribute("style", "pointer-events: all");
}
