const session = require("express-session");
const fs = require("fs");
const path = require('path')
const express = require("express");


const pathJson1 = path.join(__dirname, '../../usuarios.json')
const file_usuarios = fs.readFileSync(pathJson1, 'utf-8');
let usuarios = JSON.parse(file_usuarios);

const pathJson2 = path.join(__dirname, '../db_json/productos.json')
const file_productos = fs.readFileSync(pathJson2, 'utf-8');
let listproductos = JSON.parse(file_productos);

// const pathtest = path.join(__dirname, '../../productos.json')
// const file_test = fs.readFileSync(pathtest, 'utf-8');
// let listtest = JSON.parse(file_test);

module.exports = (app) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
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

  app.get("/admin", (req, res) => {
    if (req.session.loggedin) {
      res.render("indexadmin");
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

  app.get("/json", (req, res) => {
    let ruta = path.join(__dirname, '../db_json/productos.json')
    res.sendFile(ruta)
  });

  app.get("/jsontest", (req, res) => {
    res.sendFile('C:\\xampp\\htdocs\\manejo_json\\productos.json')
  });

  app.get("/new_product", (req, res) => {
    res.render("new_product");
  });

  app.get("/edit_product", (req, res) => {
    res.render("edit_product");
  });

  app.get("/delete_product", (req, res) => {
    res.render("delete_product");
  });

  app.post("/login", (req, res) => {

    let jsonData = require("../../usuarios.json");

    var user = req.body.email;
    var pass = req.body.password;
    var userbuscado
    var rol;

    userbuscado = jsonData.find(dato => dato.email === user)

    rol = userbuscado.rol
    // console.log(rol)

    if (userbuscado && userbuscado.password == pass && rol == "User") {

      req.session.loggedin = true;
      req.session.nombre = userbuscado.nombre
      nombre_user = req.session.nombre

      res.redirect("/");

    } else if (userbuscado && userbuscado.password == pass && rol == "Admin") {
      req.session.loggedin = true;
      req.session.nombre = userbuscado.nombre
      nombre_user = req.session.nombre
      res.redirect("/admin");
    } else {
      res.redirect("/login");
    }
  });


  app.post("/register", (req, res) => {
    let nombre = req.body.nombre;
    let email = req.body.email;
    let password = req.body.password;
    let rol = "User";

    var nuevo_usuario = {
      nombre,
      email,
      password,
      rol
    }

    usuarios.push(nuevo_usuario)

    fs.writeFileSync("usuarios.json", JSON.stringify(usuarios),
      "utf8", (err) => {
        if (err) throw err;
        console.log("The file has been saved!");
      }
    );

    res.redirect("/");
  });

  app.post("/new_product", (req, res) => {
    let num_pro = listproductos.productos.length;
    let id = num_pro + 1;
    let id_cat = id;

    // console.log("Cantidad actual" + num_pro + " , nuevo seria" + id) 
    console.log(num_pro)
    console.log(id)

    let nombre = req.body.nom_producto;
    let precio = req.body.precio;
    let descripcion = req.body.descripcion;
    let imagen = req.body.url_imagen;

    var nuevo_producto = {
      id,
      id_cat,
      nombre,
      precio,
      descripcion,
      imagen
    }

    // console.log(__dirname)

    fetch('http://localhost:3031/json')
      .then(response => response.json())
      .then(data => {
        data.productos.push(nuevo_producto);

        fs.writeFile(pathJson2, JSON.stringify(data), (err) => {
          if (err) {
            console.error(err);
          }
        });
      })
      .catch(error => {
        console.error(error);
      });

    res.redirect("/admin")

  });

  app.post("/act_jsonp", (req, res) => {

    let data = {
      "productos": req.body
    }

    //console.log(JSON.stringify(data))

    fs.writeFile(pathJson2, JSON.stringify(data), (err) => {
      if (err) {
        console.error(err);
      }
    });

    res.redirect("/admin")
  })

  app.get('/compra', (req, res) => {
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
