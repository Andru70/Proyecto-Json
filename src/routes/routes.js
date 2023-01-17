const session = require("express-session");
const fs = require("fs");
const path = require('path')

const pathJson = path.join(__dirname, '../../clientes.json')
const file_clientes = fs.readFileSync(pathJson, 'utf-8');
let clientes  = JSON.parse(file_clientes);

const pathJson1 = path.join(__dirname, '../../usuarios.json')
const file_usuarios = fs.readFileSync(pathJson1, 'utf-8');
let usuarios  = JSON.parse(file_usuarios);

module.exports = (app) => {
  var nombre_user;
  app.use(
    session({
      secret: "secret",
      resave: true,
      loggedin: false,
      nombre: String,
      saveUninitialized: true,
    })
  );

  app.get("/", (req, res) => {
    if (req.session.loggedin) {
      let jsonData = require("../db_json/productos.json");
      var json = [];
      for (let i = 0; i < jsonData.productos.length; i++) {
        // console.log(jsonData.productos[i]);
        json.push(jsonData.productos[i]);
      }
      // console.log(nombre_user)
      res.render("index", {
        json: json,
        nombre: nombre_user
      });
    } else {
      res.redirect("/login");
    }
  });

  app.get("/login", (req, res) => {
    res.render("login");
  });

  app.get("/register", (req, res) => {
    res.render("register");
  });

  app.get("/new_product", (req, res) => {
    res.render("new_product");
  });

  app.post("/login", (req, res) => {
    let jsonData = require("../../usuarios.json");
    var json = [];
    var user = req.body.email;
    var pass = req.body.password;
    var rol;

    var userbuscado = jsonData.find(dato => dato.email === user)

    rol = userbuscado.rol

    console.log(rol)

    if (userbuscado && userbuscado.password == pass) {

      req.session.loggedin = true;
      req.session.nombre = userbuscado.nombre
      nombre_user = req.session.nombre

      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  });

  app.post("/register", (req, res) => {
    let nombre = req.body.nombre;
    //let apellido = req.body.apellido;
    let email = req.body.email;
    let password = req.body.password;
    let rol = "User";

    var nuevo_usuario = {
        nombre,
        email,
        password,
        rol
    }

    //clientes.push(nuevo_cliente)
    usuarios.push(nuevo_usuario)

    fs.writeFileSync("usuarios.json",JSON.stringify(usuarios),
      "utf8", (err) => {
        if (err) throw err;
        console.log("The file has been saved!");
      }
    );
    console.log(nuevo_usuario);
    ;
    res.redirect("/");
  });

  app.post("/new_product", (req, res) => {
    res.render("new_product");  
  });

  app.get('/compra', (req, res)=>{
      console.log(nombre_user)
      let nombre = document.getElementById("nombre")
      res.redirect('/')
  })

  app.get("/logout", function (req, res) {
    req.session.destroy(() => {
      res.redirect("/login"); // siempre se ejecutará después de que se destruya la sesión
    });
  });
};
