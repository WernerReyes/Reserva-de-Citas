class UI {
  crearFilasHTML(clientes, container) {
    this.limpiarHTML(container);

    if (clientes.length) {
      clientes.forEach((cliente, index) => {
        const {
          id,
          nombreCliente,
          apellidos,
          direccion,
          fecha,
          email,
          telefono,
        } = cliente;

        const trCliente = document.createElement("tr");
        trCliente.classList.add("text-center");
        const nroCliente = document.createElement("TD");
        nroCliente.setAttribute("scope", "row");
        nroCliente.textContent = index + 1;
        const codCliente = document.createElement("TD");
        codCliente.textContent = id;
        const nameCliente = document.createElement("TD");
        nameCliente.textContent = `${nombreCliente} ${apellidos}`;
        const fechaRegistro = document.createElement("TD");
        fechaRegistro.textContent = fecha;
        const direccionCliente = document.createElement("TD");
        direccionCliente.textContent = direccion;
        const emailCliente = document.createElement("TD");
        emailCliente.textContent = email;
        const telefonoCliente = document.createElement("TD");
        telefonoCliente.textContent = telefono;

        // Botones
        const botonesOpciones = document.createElement("TD");
        botonesOpciones.innerHTML = `
           <div class="d-flex justify-content-center">
                <i class="bi bi-pencil-square" data-id="${id}" style="cursor: pointer;"></i>
                <i class="bi bi-x-circle mx-2" data-id="${id}" style="cursor: pointer;"></i>
                <i class="bi bi-book" data-id="${id}" style="cursor: pointer;"></i>
            </div>
           `;

        trCliente.appendChild(nroCliente);
        trCliente.appendChild(codCliente);
        trCliente.appendChild(nameCliente);
        trCliente.appendChild(fechaRegistro);
        trCliente.appendChild(direccionCliente);
        trCliente.appendChild(emailCliente);
        trCliente.appendChild(telefonoCliente);
        trCliente.appendChild(botonesOpciones);

        // Añadimos en el HTML
        container.appendChild(trCliente);
      });
      return;
    }

    const trInfo = document.createElement("TR");
    trInfo.classList.add("text-center");
    const mensajeVacio = document.createElement("TD");
    mensajeVacio.setAttribute("colspan", "8");
    mensajeVacio.classList.add("text-center", "p-2");
    mensajeVacio.style.fontSize = "20px";
    mensajeVacio.textContent = "No hay ningun registro";

    trInfo.appendChild(mensajeVacio);

    container.appendChild(trInfo);
  }

  mostrarMasInformacion(infoCliente, container) {
    console.log(infoCliente);

    this.limpiarHTML(container);

    const {
      nombreCliente,
      apellidos,
      telefono,
      email,
      direccion,
      nombreMascota,
      edadMascota,
      fecha,
      id,
      raza,
      sexoMascota,
      tipo,
    } = infoCliente;

    // SCRIPTING
    const divInfoOne = document.createElement("DIV");
    divInfoOne.className = "row justify-content-center mx-2";
    divInfoOne.innerHTML = `
        <div class="col mx-2">
          <p class="mb-0">Codigo:</p>
          <p class="dato">${id}</p>
        </div>
        <div class="col mx-2">
          <p class="mb-0">Fecha:</p>
          <p class="dato">${fecha}</p>
        </div>
    `;
    const divInfoTwo = document.createElement("DIV");
    divInfoTwo.className = "row justify-content-center mt-3 mx-2";
    divInfoTwo.innerHTML = `
          <div class="col-12 col-md-auto mx-2 mb-3 mb-md-0 pt-2">
            <p><b>DUEÑO: </b>${nombreCliente} ${apellidos}</p>
            <p><b>DIRECCIÓN: </b>${direccion}</p>
            <p><b>TELEFONO: </b>${telefono}</p>
            <p><b>EMAIL: </b>${email}</p>
          </div>
          <div class="col-12 col-md-auto mx-2 mb-3 mb-md-0 pt-2">
            <p><b>MASCOTA: </b>${nombreMascota}</p>
            <p><b>RAZA: </b>${raza}</p>
            <p><b>SEXO: </b>${sexoMascota}</p>
            <p><b>EDAD: </b>${edadMascota} años</p>
            <p><b>TIPO: </b>${tipo}</p>
          </div>
    `;

    // Insertamos en el HTMl
    container.appendChild(divInfoOne);
    container.appendChild(divInfoTwo);
  }

  paginadorHTML(iterador, container) {
  
    this.limpiarHTML(container);
  
    const liAnterior = document.createElement('LI');
    liAnterior.classList.add('page-item','anterior');
    liAnterior.innerHTML = '<a class="page-link" data-paf="anterior">Anterior</a>';
  
    const liNext = document.createElement('LI');
    liNext.classList.add('page-item','siguiente');
    liNext.innerHTML = '<a class="page-link" data-paf="siguiente">Siguiente</a>';
  
    const paginasContainer = document.createElement('UL');
    paginasContainer.classList.add('pagination');
  
    let  { value, done } = iterador.next();
    if (done) return; // Si no hay elementos para paginar, no mostramos el paginador
  
    paginasContainer.appendChild(liAnterior); // Agregar botón "Anterior" al contenedor del paginador
  
    // Agregar botones de paginación al contenedor del paginador
    while (true) {
      const paginas = document.createElement('LI');
      paginas.classList.add('page-item','paginas');
      paginas.dataset.paf = value;
      paginas.innerHTML = `<a class="page-link pag" href="#" data-paf="${value}">${value}</a>`;
      paginasContainer.appendChild(paginas);
  
      const next = iterador.next();
      if (next.done) break;

      ({ value } = next);
    }
  
    paginasContainer.appendChild(liNext); // Agregar botón "Siguiente" al contenedor del paginador
  
    container.appendChild(paginasContainer); // Agregar el paginador completo al contenedor principal
  }


  mostrarAvisoEliminar() {
    return new Promise(resolve => {
    Swal.fire({
      title: '¿Estas seguro que deseas eliminar el registro?',
      text: "¡Recuerda que una vez eliminado, el registro no se podra restaurar!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, deseo eliminarlo!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
        resolve(true);
        return;
      }
      resolve(false);
    })
  })
  }
  

  motrarAlerta(insercion, mensaje, tipo) {
    const existe = document.querySelector(".text-center.alert");

    if (!existe) {
      // Crear el div
      const divMensaje = document.createElement("DIV");
      divMensaje.classList.add("text-center", "alert", "mx-2", "p-2", "my-3");

      if (tipo === "error") {
        divMensaje.classList.add("alert-danger");
      } else {
        divMensaje.classList.add("alert-success");
      }

      // Mensaje de error
      divMensaje.textContent = mensaje;

      // Insertamos en el HTML
      insercion.insertAdjacentElement("afterend", divMensaje);

      // Quitar el mensaje del HTML
      setTimeout(() => {
        divMensaje.remove();
      }, 3000);
    }
  }

  limpiarHTML(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }
}

export default UI;
