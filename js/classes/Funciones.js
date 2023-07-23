class Funciones {
  // Validar email
  validarEmail(email) {
    const verificar = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    return verificar.test(email);
  }

  // Validad telefono
  validarTelefono(telefono) {
    const verificarNumero = /^[0-9]+$/;
    const verificarDigitos = telefono.length !== 9;
    return {
      numero: verificarNumero.test(telefono),
      digitos: verificarDigitos,
    };
  }

  // Validar edad
  validarEdad(edad) {
    const verificarEdad = /^[0-9]+$/;
    return verificarEdad.test(edad);
  }

  // Generar un idRandom
  generarID() {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";

    for (let i = 0; i < 5; i++) {
      const caracterAleatorio = caracteres.charAt(
        Math.floor(Math.random() * caracteres.length)
      );
      id += caracterAleatorio;
    }

    return id;
  }

  // Filtrar los clientes por busqueda
  filtrarClientes(clientes, busqueda) {
    if (busqueda) {
      const letraBusqueda = busqueda.toLowerCase().trimStart()[0];
      return clientes.filter(
        (cliente) =>
          cliente.id.toLowerCase().startsWith(letraBusqueda) &&
          cliente.id.toLowerCase().includes(busqueda.toLowerCase().trim())
      );
    } else {
      return clientes;
    }
  }

  // Calcular las paginas para el Paginador
  calcularPaginas(total) {
    return parseInt(Math.ceil(total / 5));
  }

  // Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
  *crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
      yield i;
    }
  }

  filtrarClientesPaginacion(listaElementos, numeroPagina) {
    const elementosPorPagina = 5;
    const inicio = (numeroPagina - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;

    for (let i = 0; i < listaElementos.length; i++) {
      if (i >= inicio && i < fin) {
        listaElementos[i].style.display = "table-row"; // Mostrar elemento
      } else {
        listaElementos[i].style.display = "none"; // Ocultar elemento
      }
    }
  }

  siguienteAnterior(pagina, container, listaElementos) {
    if (pagina) {
      pagina.addEventListener("click", (e) => {
        const botonesPagina = container.querySelectorAll(".paginas");

        // Obtenemos la accion a realizar
        const pagina = e.target.dataset.paf;

        switch (pagina) {
          case "anterior":
            // Obtener el número de la página actualmente activa
            const paginaActual1 =
              container.querySelector(".active a").dataset.paf;

            if (Number(paginaActual1) - 1 > 0) {
              botonesPagina.forEach((boton) =>
                boton.classList.remove("active")
              );

              // Ponemos en active la pagina actul
              container
                .querySelector(
                  `.paginas[data-paf="${Number(paginaActual1) - 1}"]`
                )
                .classList.add("active");

              // Calcular el número de página anterior y actualizar el paginador
              this.filtrarClientesPaginacion(
                listaElementos,
                Number(paginaActual1) - 1
              );
            }

            break;

          default:
            // Obtener el número de la página actualmente activa
            const paginaActual2 =
              container.querySelector(".active a").dataset.paf;

            if (Number(paginaActual2) + 1 <= botonesPagina.length) {
              botonesPagina.forEach((boton) =>
                boton.classList.remove("active")
              );

              // Ponemos en active la pagina actul
              container
                .querySelector(
                  `.paginas[data-paf="${Number(paginaActual2) + 1}"]`
                )
                .classList.add("active");

              // Calcular el número de página anterior y actualizar el paginador
              this.filtrarClientesPaginacion(
                listaElementos,
                Number(paginaActual2) + 1
              );
            }

            break;
        }
      });
    }
  }
}

export default Funciones;
