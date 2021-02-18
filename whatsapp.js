const api = "https://trankillprojets.fr/wal/wal.php?";
let user = { id: 0, name: "", email: "" };

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
        .then(() => {
            if (!document.getElementById("inscrp_btn").classList.contains("disabled")) {
                setTimeout((document.getElementById("inscrp").innerHTML += "An email has been sent to you"), 100);
                setTimeout(showConnexPage(), 3000);
            }
        })
        .catch((err) => console.error("Erreur:", err));

const activation = (cle_activation) =>
    fetch(api + "activation=" + cle_activation)
        .then((res) =>
            res.json().then(() => {
                if (!document.getElementById("connex_btn").classList.contains("disabled")) {
                    user.id = document.getElementById("connex_inp1").value;
                    document.getElementById("connex").classList.add("invisible");
                    showContactsPage();
                    getRelations(user.id);
                    document.getElementById("profile").classList.add("visible");
                    getParameters(user.id);
                }
            })
        )
        .catch((err) => console.error("Erreur:", err));

const getParameters = (id) => {
    fetch(api + "information&identifiant=" + id)
        .then((res) =>
            res.json().then((json) => {
                user.id = json.identifiant;
                user.name = json.identite;
                user.email = json.mail;
                document.getElementById("user_id").innerHTML = "ID: " + json.identifiant;
                document.getElementById("user_name").innerHTML = "Name: " + json.identite;
                document.getElementById("user_email").innerHTML = "Email: " + json.mail;
            })
        )
        .catch((err) => console.error("Erreur:", err));
};

const addRelation = (id, email) => {
    fetch(api + "lier&identifiant=" + id + "&mail=" + email)
        .then((res) =>
            res.json().then(() => {
                document.getElementById("newC").classList.add("invisible");
                setTimeout((document.getElementById("newC").hidden = true), 350);
                showContactsPage();
                getRelations(id);
            })
        )
        .catch((err) => console.error("Erreur:", err));
};

const getRelations = (id) =>
    fetch(api + "relations&identifiant=" + id)
        .then((res) => {
            console.log(res.url);
            res.json().then((json) => {
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
                    m.setAttribute("id", "del_c");
                    m.classList.add("fas");
                    m.classList.add("fa-trash-alt");
                    m.onclick = (e) => delContact(id, c.relation);

                    nc.appendChild(pp);
                    nc.appendChild(n);
                    nc.appendChild(m);
                    nc.onclick = (e) => {
                        showTchatPage(e);
                        setInterval(() => readMessage(user.id, e.target.id), 333);
                    };
                    setTimeout(() => document.getElementById("contacts_list").appendChild(nc), 120 * i);
                }
            });
        })
        .catch((err) => console.error("Erreur:", err));

const delContact = (id, idrel) =>
    fetch(api + "delier&identifiant=" + id + "&relation=" + idrel)
        .then((res) => res.json().then(() => getRelations(id)))
        .catch((err) => console.error("Erreur:", err));

const sendMessage = (id, id_relation, texte) =>
    fetch(api + "ecrire&identifiant=" + id + "&relation=" + id_relation + "&message=" + texte)
        .then((res) =>
            res.json().then(() => {
                document.getElementById("newmsg_w").innerHTML = "";
                readMessage(id, id_relation);
            })
        )
        .catch((err) => console.error("Erreur:", err));

const readMessage = (id, id_relation) =>
    fetch(api + "lire&identifiant=" + id + "&relation=" + id_relation)
        .then((res) => {
            console.log(res.url);
            res.json().then((json) => {
                for (let m of json.messages) {
                    let nm = document.createElement("div");
                    console.log(m);
                    if (m.identite == user.name) {
                        nm.classList.add("right");
                    } else {
                        nm.classList.add("left");
                    }

                    let o = document.createElement("div");
                    o.classList.add("owner");
                    o.innerHTML = m.identite;

                    let msg = document.createElement("div");
                    msg.classList.add("msg");
                    msg.innerHTML = m.message;

                    nm.appendChild(o);
                    nm.appendChild(msg);

                    console.log(nm);
                    document.getElementById("messages").appendChild(nm);
                }
            });
        })
        .catch((err) => {
            console.log("test");
            console.error("Erreur:", err);
        });

function showConnexPage() {
    setTimeout(() => {
        document.getElementById("locate").innerHTML = "Connexion";
        document.getElementById("inscrp").classList.add("invisible");

        setTimeout(() => {
            document.getElementById("inscrp").hidden = true;
            document.getElementById("connex").hidden = false;
            setTimeout(() => document.getElementById("connex").classList.remove("invisible"), 200);
        }, 500);
    }, 300);
}
function showNewCPage() {
    console.log("show new contacts");
    document.getElementById("tchat").hidden = true;
    setTimeout(() => {
        document.getElementById("add_c").classList.add("invisible");
        let contactlist = [...document.querySelectorAll(".cts")];
        for (let i in contactlist) setTimeout(contactlist[i].classList.add("reverse"), 400 * i);
        hideContactsPage();
        document.getElementById("locate").innerHTML = "New contact";
        console.log(document.getElementById("locate").innerHTML);
        document.getElementById("newC").hidden = false;
        setTimeout(() => document.getElementById("newC").classList.remove("invisible"), 500);
    }, 300);
}

function hideNewCpage() {
    console.log("hide new contact");

    document.getElementById("newC").classList.add("invisible");
    setTimeout((document.getElementById("newC").hidden = true), 1000);
}

function showContactsPage() {
    console.log("je show les contacts");
    hideProfilePage();
    hideNewCpage();
    document.getElementById("contacts").classList.remove("flou");

    let contactlist = [...document.querySelectorAll(".cts")];
    for (let i in contactlist) setTimeout(() => contactlist[i].classList.remove("reverse"), 300 * i);
    setTimeout(() => {
        document.getElementById("back").classList.remove("visible");
        document.getElementById("connex").hidden = true;
        document.getElementById("contacts").hidden = false;
        document.getElementById("contacts").classList.remove("invisible");
        document.getElementById("locate").innerHTML = "Contacts";
        document.getElementById("more-infos").innerHTML = "";
        document.getElementById("add_c").hidden = false;
        setTimeout(document.getElementById("add_c").classList.remove("invisible"), 500);
    }, 200);
}

function hideContactsPage() {
    console.log("hide contacts");
    document.getElementById("contacts").classList.add("flou");
    document.getElementById("back").classList.add("visible");
    document.getElementById("contacts").classList.add("invisible");
    let contactlist = [...document.querySelectorAll(".cts")];
    for (let i in contactlist) setTimeout(() => contactlist[i].classList.add("reverse"), 300 * i);

    setTimeout(() => (document.getElementById("contacts").hidden = true), 200 * document.querySelectorAll(".cts").length);
    document.getElementById("more-infos").innerHTML = "";
    document.getElementById("add_c").classList.add("invisible");
    setTimeout(() => (document.getElementById("add_c").hidden = true), 1000);
}

function showTchatPage(e) {
    let contactlist = [...document.querySelectorAll(".cts")];
    for (let i in contactlist) setTimeout(() => contactlist[i].classList.add("reverse"), 300 * i);
    document.getElementById("back").classList.add("visible");
    document.getElementById("locate").innerHTML = e.target.innerHTML;
    document.getElementById("more-infos").innerHTML = e.target.id;
    document.getElementById("contacts").hidden = true;
    document.getElementById("contacts").classList.add("invisible");
    document.getElementById("tchat").hidden = false;
    document.getElementById("tchat").classList.remove("invisible");
}

function showProfilePage() {
    console.log("show profile page");

    document.getElementById("profilepage").hidden = false;
    let contactslist = [...document.querySelectorAll(".cts")];
    document.getElementById("add_c").classList.add("invisible");

    for (let i in contactslist) setTimeout(() => contactslist[i].classList.add("reverse"), 300 * i);

    hideContactsPage();
    document.getElementById("profile").classList.remove("visible");

    document.getElementById("locate").innerHTML = "Profile";

    setTimeout(() => document.getElementById("profilepage").classList.remove("invisible"), 120 * contactslist.length);
}
function hideProfilePage() {
    console.log("hide profile page");
    document.getElementById("profilepage").classList.add("invisible");
    setTimeout(() => {
        document.getElementById("profilepage").hidden = true;
    }, 200);

    document.getElementById("profile").classList.add("visible");
}
