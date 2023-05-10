const express = require("express");
const { bookRoutes } = require("./routes/book.routes.js");
const { authorRoutes } = require("./routes/author.routes.js");
const cors = require("cors");

const corsWhiteList = ["http://localhost:3000", "http://localhost:3001", "https://s7validationcors.vercel.app"];

// const corsWhiteList = "*";

// La intencion del main es que sea una funcion async para poder hacer await en connect
// para el despliegue en Vercel
const main = async () => {
  // Conexion a la BBDD
  const { connect } = require("./db.js");
  const database = await connect();

  // Configuracion del servidor
  const PORT = 3000;
  const server = express();
  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));
  server.use(cors({ origin: corsWhiteList }));

  // Rutas
  const router = express.Router();
  router.get("/", (req, res) => {
    res.send(`Library API en entorno ${database.connection.name}`);
  });
  router.get("*", (req, res) => {
    res.status(404).send("La pagina solicitada no existe");
  });

  // Uso del router
  server.use("/book", bookRoutes);
  server.use("/author", authorRoutes);
  server.use("/", router);

  // Ejecución del servidor
  server.listen(PORT, () => {
    console.log(`Servidor funcionando en puerto ${PORT}`);
  });
};

main();
