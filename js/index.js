import DB from "./classes/BD.js";
import Funciones from "./classes/Funciones.js";
import UI from "./classes/UI.js";

(function () {
  // <!-- VARIABLES -->
  const formulario = document.querySelector("#formulario");
  // Inputs
  const nombreClienteInput = document.querySelector("#nombre-cliente");
  const apellidosClienteInput = document.querySelector("#apellidos-cliente");
  const telefonoInput = document.querySelector("#telefono-cliente");
  const emailInput = document.querySelector("#email-cliente");
  const direccionInput = document.querySelector("#direccion-cliente");
  const nombreMascotaInput = document.querySelector("#nombre-mascota");
  const razaInput = document.querySelector("#raza-mascota");
  const edadMascotaInput = document.querySelector("#edad-mascota");
  const tipoMacotaInput = document.querySelector("#tipo-mascota");
  const sexoMascotaInput = document.querySelector("#sexo-mascota");

  let editando;
  let idCliente;

  // <!-- INSTANCIAS -->
  const db = new DB();
  const funciones = new Funciones();
  const ui = new UI();

  // <!-- EVENTOS -->
  eventListeners();
  function eventListeners() {
    formulario.addEventListener("submit", validarCliente);

    // Cuando el HTML ya esta listo
    document.addEventListener("DOMContentLoaded", () => {
      // Creamos la base de datos
      db.crearDB();

      // No conectamos a la base de datos
      db.conectarDB();

      // Verificar si el cliente existe
      const parametrosURL = new URLSearchParams(window.location.search);
      idCliente = parametrosURL.get("id");
      if (idCliente) {
        obtenerClienteEditar(idCliente);
      }
    });
  }

  // <!-- FUNCIONES -->
  async function validarCliente(e) {
    e.preventDefault();

    if (
      [
        nombreClienteInput,
        apellidosClienteInput,
        telefonoInput,
        emailInput,
        nombreMascotaInput,
        razaInput,
        edadMascotaInput,
        tipoMacotaInput,
        sexoMascotaInput,
        direccionInput,
      ].some((campo) => campo.value.trim() === "")
    ) {
      ui.motrarAlerta(
        formulario.querySelector(".datos-mascota"),
        "Todos los campos son obligatorios",
        "error"
      );
      return;
    }

    if (!funciones.validarEmail(emailInput.value)) {
      ui.motrarAlerta(
        formulario.querySelector(".datos-mascota"),
        "El email ingresado es incorrecto",
        "error"
      );
      return;
    }

    if (!funciones.validarTelefono(telefonoInput.value).numero) {
      ui.motrarAlerta(
        formulario.querySelector(".datos-mascota"),
        "Solo se puede ingresar numeros",
        "error"
      );
      return;
    }

    if (funciones.validarTelefono(telefonoInput.value).digitos) {
      ui.motrarAlerta(
        formulario.querySelector(".datos-mascota"),
        "Solo puedes ingresar numeros de telefono de 9 digitos",
        "error"
      );
      return;
    }

    if (!funciones.validarEdad(edadMascotaInput.value)) {
      ui.motrarAlerta(
        formulario.querySelector(".datos-mascota"),
        "¡Error! ingresa una edad válida",
        "error"
      );
      return;
    }

    const cliente = {
      nombreCliente: nombreClienteInput.value,
      apellidos: apellidosClienteInput.value,
      telefono: telefonoInput.value,
      email: emailInput.value,
      direccion: direccionInput.value,
      nombreMascota: nombreMascotaInput.value,
      raza: razaInput.value,
      edadMascota: edadMascotaInput.value,
      tipo: tipoMacotaInput.value,
      sexoMascota: sexoMascotaInput.value,
      fecha: new Date().toLocaleDateString("es-ES"),
    };

    try {
      if (editando) {
        console.log("Modo editando activado");
  
        cliente.id = idCliente;
        await db.editarClienteDB(cliente);
  
        // Mosatramos la alerta de que se reservo correctamente
        ui.motrarAlerta(
          formulario.querySelector(".datos-mascota"),
          "Servicios actualizado correctamente"
        );
  
        formulario.querySelector('button[type="submit"]').textContent = 'Insertar cliente';
        editando = false;

        setTimeout( () => window.location.href = 'reservas.html', 3000 )

        
      } else {
        // Creamos el nuevo cliente
        cliente.id = funciones.generarID();
        await db.nuevoClienteDB(cliente);
  
        // Mostramos la alerta de que se reservó correctamente
        ui.motrarAlerta(
          formulario.querySelector(".datos-mascota"),
          "Servicios reservado correctamente"
        );
      }
      // Reiniciamos el formulario
      formulario.reset();

    } catch (error) {
      ui.motrarAlerta(
        formulario.querySelector(".datos-mascota"),
        error,
        "error"
      );
    }
  }

  async function obtenerClienteEditar(id) {
    const clienteSeleccionado = await db.obtenerClienteID(id);

    const {
      nombreCliente,
      apellidos,
      telefono,
      email,
      direccion,
      nombreMascota,
      raza,
      edadMascota,
      tipo,
      sexoMascota,
    } = clienteSeleccionado;

    // Llenamos los inputs
    nombreClienteInput.value = nombreCliente;
    apellidosClienteInput.value = apellidos;
    telefonoInput.value = telefono;
    emailInput.value = email;
    direccionInput.value = direccion;
    nombreMascotaInput.value = nombreMascota;
    razaInput.value = raza;
    edadMascotaInput.value = edadMascota;
    tipoMacotaInput.value = tipo,
    sexoMascotaInput.value = sexoMascota;

    editando = true;

    formulario.querySelector('button[type="submit"]').textContent = 'Editar cliente';



  }
})();
