const session = require("express-session");
const fs = require("fs");
const path = require('path')

const pathJson = path.join(__dirname, '../../clientes.json')
const file_clientes = fs.readFileSync(pathJson, 'utf-8');
let clientes  = JSON.parse(file_clientes);

const pathJson1 = path.join(__dirname, '../../usuarios.json')
const file_usuarios = fs.readFileSync(pathJson1, 'utf-8');
let usuarios  = JSON.parse(file_usuarios);

const pathJson2 = path.join(__dirname, '../db_json/productos.json')
const file_productos = fs.readFileSync(pathJson2, 'utf-8');
let listproductos  = JSON.parse(file_productos);

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

  app.get("/new_product", (req, res) => {
    res.render("new_product");
  });

  app.post("/login", (req, res) => {
    let jsonData = require("../../usuarios.json");
    let jsonData2 = require("../../clientes.json");
    var json = [];
    var user = req.body.email;
    var pass = req.body.password;
    var userbuscado
    var rol;

    userbuscado = jsonData.find(dato => dato.email === user)
    userbuscado2 = jsonData2.find(dato => dato.email === user)

    if(userbuscado){
      rol = userbuscado.rol
      //console.log("Este es un usuario")
    } else if(userbuscado2){
      rol = userbuscado2.rol
      //console.log("Este es un admin")
    } else {
      console.log("Este usuario no ha sido encontrado")
      res.redirect("/login");
    }

    if(userbuscado){

      //console.log(rol)

      if (userbuscado && userbuscado.password == pass && rol == "User") {

        req.session.loggedin = true;
        req.session.nombre = userbuscado.nombre
        nombre_user = req.session.nombre

        res.redirect("/");

      } else {
        res.redirect("/login");
      }
    } else if(userbuscado2){

      console.log(rol)

      if (userbuscado2 && userbuscado2.password == pass && rol == "Admin") {

        req.session.loggedin = true;
        req.session.nombre = userbuscado2.rol
        //nombre_user = req.session.nombre

        // console.log("Este es un admin 2")
        res.redirect("/admin");

      } else {
        res.redirect("/login");
      }
      
    } else{
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

    fs.writeFileSync("usuarios.json",JSON.stringify(usuarios),
      "utf8", (err) => {
        if (err) throw err;
        console.log("The file has been saved!");
      }
    );
    console.log(nuevo_usuario);
  
    res.redirect("/");
  });

  app.post("/new_product", (req, res) => {

    let products = require("../db_json/productos.json")

    let num_pro = products.productos.length;
    let id = num_pro + 1;
    let id_cat = id;

    // console.log(typeof(num_new))

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

    console.log(pathJson2)

    // const anadir = async () => {

    //   await fetch('productos.json').then(function(res) {
    //     console.log(res)
    //   })

    // }

    // anadir();
    // .then(data => {

    //   data.productos.push(nuevo_producto)
    //   console.log(data)

    //   const json = JSON.stringify(data);

    //   fetch('productos.json', {
    //     method: "PUT",
    //     body: json
    //   })
    // })

    

    //console.log(data)
    //console.log(listproductos)
    //listproductos.push(nuevo_producto)
    //products.parse.push(nuevo_producto)
    //console.log(json)
    // fs.writeFileSync("productos.json",JSON.stringify(listproductos),
    //   "utf8", (err) => {
    //     if (err) throw err;
    //     console.log("The file has been saved!");
    //   }
    // );
    // console.log(nuevo_producto);
    
    res.redirect("/admin");
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
