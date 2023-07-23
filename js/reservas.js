import DB from "./classes/BD.js";
import UI from "./classes/UI.js";
import Funciones from "./classes/Funciones.js";

(function () {
  // <!-- VARIABLES -->
  const tbodyCliente = document.querySelector("#container tbody");
  const buscarCliente = document.querySelector("#buscar-cliente");
  const paginacionDiv = document.querySelector(".nav-pagination");
  const listaElementos = tbodyCliente.children;

  let paginasMostrar = 1;

  // <!-- INSTANCIAS -->
  const db = new DB();
  const ui = new UI();
  const funciones = new Funciones();

  // <!-- EVENTOS -->
  eventListeners();
  function eventListeners() {
    // Cuando el HTML ya esta listo
    document.addEventListener("DOMContentLoaded", () => {
      db.conectarDB();

      // Comprobamos si la base de datos existe o se puede abrir
      if (window.indexedDB.open("crm", 1)) {
        obtenerClientes();
      }

      // Editar Clientes
      editarCliente(tbodyCliente);

      // Eliminar Clientes
      eliminarCliente(tbodyCliente);

      // Ver mas informacion
      verMasInformacion(tbodyCliente);

      // Buscar cliente por su codigo
      buscarCliente.addEventListener("input", buscarClienteID);

      // Cambiar de pagina
      cambiarPaginas(paginacionDiv);
    });
  }

  // <!-- FUNCIONES -->
  async function obtenerClientes() {
    try {
      const registros = await db.obtenerClientesDB();

      // Creamos el HTML
      ui.crearFilasHTML(registros, tbodyCliente);

      // Calculamos el total de paginas
      paginasMostrar = funciones.calcularPaginas(registros.length);

      // Imprimimos el paginador
      imprimirPaginador(paginasMostrar);

      // Comensamos por la pagina 1
      funciones.filtrarClientesPaginacion(listaElementos, 1);
      document.querySelector(".paginas").classList.add("active");

      // Cambiar pagina siguiente o anterior
      const paginaAnterior = document.querySelector(".anterior");
      const paginaSiguiente = document.querySelector(".siguiente");
      siguienteAnterior(paginaAnterior, paginacionDiv);
      siguienteAnterior(paginaSiguiente, paginacionDiv);
    } catch (error) {
      console.log(error);
    }
  }

  function editarCliente(container) {
    container.addEventListener("click", (e) => {
      if (e.target.classList.contains("bi-pencil-square")) {
        const idCliente = e.target.dataset.id;

        window.location.href = `index.html?id=${idCliente}`;
      }
    });
  }

  function eliminarCliente(container) {
    container.addEventListener("click", async e => {
      if (e.target.classList.contains("bi-x-circle")) {
        const idCliente = e.target.dataset.id;

        const verificar = await ui.mostrarAvisoEliminar();
        
        // Veridicamos si el usuario quiere eliminar 
        if(verificar) {

          db.eliminarClienteDB(idCliente);

          obtenerClientes();
        }
      
      }
    });
  }

  function verMasInformacion(container) {
    const modal = new bootstrap.Modal(document.querySelector(".modal.fade"));

    container.addEventListener("click", async (e) => {
      if (e.target.classList.contains("bi-book")) {
        // Obtenemos el ID del clientes
        const idCliente = e.target.dataset.id;

        // Obtenemos la informacion del cliente selecciona
        const clienteSeleccionado = await db.obtenerClienteID(idCliente);

        ui.mostrarMasInformacion(
          clienteSeleccionado,
          document.querySelector("#modal-detalles .container")
        );

        // Abrimos el modal
        modal.toggle();
      }
    });
  }

  async function buscarClienteID(e) {
    // Obtenemos todos los registros
    const registros = await db.obtenerClientesDB();

    // Filtramos por la busqueda
    const filtrado = funciones.filtrarClientes(registros, e.target.value);

    // Lo mostramos en el HTML
    ui.crearFilasHTML(filtrado, tbodyCliente);

    // Calculamos el total de paginas
    const paginasMostrar = funciones.calcularPaginas(filtrado.length);

    // Imprimimos el el paginador
    imprimirPaginador(paginasMostrar);

    // Comensamos por la pagina 1
    funciones.filtrarClientesPaginacion(listaElementos, 1);
    if (document.querySelector(".paginas")) {
      document.querySelector(".paginas").classList.add("active");
    }

    // Cambiar pagina siguiente o anterior
    const paginaAnterior = document.querySelector(".anterior");
    const paginaSiguiente = document.querySelector(".siguiente");
    siguienteAnterior(paginaAnterior, paginacionDiv);
    siguienteAnterior(paginaSiguiente, paginacionDiv);
  }

  function imprimirPaginador(paginasMostrar) {
    let iterador = funciones.crearPaginador(paginasMostrar);

    ui.paginadorHTML(iterador, paginacionDiv);
  }

  function cambiarPaginas(container) {
    container.addEventListener("click", (e) => {
      if (e.target.classList.contains("pag")) {
        // Eliminar la clase "active" de todos los botones
        const botonesPagina = container.querySelectorAll(".paginas");
        botonesPagina.forEach((boton) => boton.classList.remove("active"));

        // Agregar la clase "active" al botón presionado
        e.target.parentElement.classList.add("active");

        const paginaActual = Number(e.target.dataset.paf);

        funciones.filtrarClientesPaginacion(listaElementos, paginaActual);

        console.log(listaElementos);
      }
    });
  }

  function siguienteAnterior(pagina, container) {
    // Podemos hacer siguiente y despues con el ANTERIOR y SIGUINTE
    funciones.siguienteAnterior(pagina, container, listaElementos);
  }
})();
