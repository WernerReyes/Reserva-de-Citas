class DB {
  constructor() {
    this.DB;
  }

  crearDB() {
    // Creamos la base de datos con la vesion 1
    const crearDB = window.indexedDB.open("crm", 1);

    // Si hay un error, mostramos un mensaje
    crearDB.onerror = () => console.log("Hubo un error");

    // Si todo esta bien, asignamos a la base de datos el resultado
    crearDB.onsuccess = function () {
      // Asignamos el resultado
      this.DB = crearDB.result;
    };

    // Metodo que corre solo una vez
    crearDB.onupgradeneeded = function (e) {
      const db = e.target.result;

      // Definimos el objectStore
      const objectStore = db.createObjectStore("crm", {
        keyPath: "id",
        autoIncrement: true,
      });

      // Creamos los atributos
      objectStore.createIndex("id", "id", { unique: true });
      objectStore.createIndex("fecha", "fecha", { unique: false });
      objectStore.createIndex("nombreCliente", "nombreCliente", {
        unique: false,
      });
      objectStore.createIndex("apellidos", "apellidos", { unique: false });
      objectStore.createIndex("telefono", "telefono", { unique: false });
      objectStore.createIndex("email", "email", { unique: true });
      objectStore.createIndex("direccion", "direccion", { unique: false });
      objectStore.createIndex("nombreMascota", "nombreMascota", {
        unique: false,
      });
      objectStore.createIndex("raza", "raza", { unique: false });
      objectStore.createIndex("edadMascota", "edadMascota", { unique: false });
      objectStore.createIndex("tipo", "tipo", { unique: false });
      objectStore.createIndex("sexoMascota", "sexoMascota", { unique: false });

      console.log("DB creada correctamente y lista");
    };
  }

  conectarDB() {
    // Abrimos la conexion en la DB
    let abrirConexion = window.indexedDB.open("crm", 1);

    // Si hay algun error
    abrirConexion.onerror = () => console.log("Hubo un error");

    // Si todo sale bien, guardamos el resultado
    abrirConexion.onsuccess = () => (this.DB = abrirConexion.result);

  }

  nuevoClienteDB(cliente) {
    return new Promise((resolve, reject) => {
      const transaction = this.DB.transaction(["crm"], "readwrite");
      const objectStore = transaction.objectStore("crm");

      // Agregamos al cliente
      objectStore.add(cliente);

      transaction.oncomplete = () => {
        console.log("Cliente agregado correctamente");
        resolve(); // Resolvemos la promesa si todo está bien
      };

      transaction.onerror = () => reject('Ya hay un cliente con el mismo correo'); // Rechazamos la promesa con el error
    });
  }

  editarClienteDB(clienteActualizado) {
    return new Promise((resolve, reject) => {
      const transaction = this.DB.transaction(["crm"], "readwrite");
      const objectStore = transaction.objectStore("crm");

      // Actualizamos el cliente
      objectStore.put(clienteActualizado);

      transaction.oncomplete = () => {
        console.log("Cliente editado correctamente");
        resolve(); // Resolvemos la promesa si todo está bien
      };

      transaction.onerror = () => reject('Ya hay un cliente con el mismo correo'); // Rechazamos la promesa con el error
    });
  }

  eliminarClienteDB(id) {
      const transaction = this.DB.transaction(["crm"], "readwrite");
      const objectStore = transaction.objectStore("crm");

      // Eliminamos el cliente
      const request = objectStore.delete(id);

      request.oncomplete = () => {
        console.log("Cliente editado correctamente");
      };

      request.onerror = () => console.log('No se pudo eliminar'); // Rechazamos la promesa con el error
  }

  
  obtenerClientesDB() {
    return new Promise((resolve, reject) => {
      const abrirConexion = window.indexedDB.open("crm", 1);

      // Si hay algun error
      abrirConexion.onerror = () =>
        reject(new Error(console.log("Hubo un error")));

      // Si todo esta correcto
      abrirConexion.onsuccess = function () {
        // Guardamos el resultado
        this.DB = abrirConexion.result;

        const objectStore = this.DB.transaction("crm").objectStore("crm");
        let registros = [];

        objectStore.openCursor().onsuccess = function (e) {
          const cursor = e.target.result;

          if (cursor) {
            // Agregamos los valores al arreglo
            registros = [...registros, cursor.value];
            cursor.continue();
          } else {
            resolve(registros);
          }
        };
      };
    });
  }

  obtenerClienteID(id) {
    return new Promise( resolve => {
      const abrirConexion = window.indexedDB.open("crm", 1);

      // Si hay algun error
      abrirConexion.onerror = () =>
        reject(new Error(console.log("Hubo un error")));

      // Si todo esta correcto
      abrirConexion.onsuccess = function () {
        // Guardamos el resultado
        this.DB = abrirConexion.result;

        const objectStore = this.DB.transaction("crm").objectStore("crm");

        objectStore.openCursor().onsuccess = function (e) {
          const cursor = e.target.result;

          if(cursor) {

            if(cursor.value.id === id ) {
                resolve(cursor.value);
            }
    
            cursor.continue();
    
          }
        };
      };

  } )

  }

  
}


export default DB;
