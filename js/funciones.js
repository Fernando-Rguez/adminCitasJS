import  Citas  from './classes/Citas.js';
import UI from './classes/UI.js';
import { mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput, formulario } from './selectores.js';
const administrarCitas = new Citas();
const ui = new UI(administrarCitas);

let editando = false;




export let DB;

export function baseDatos() {

    window.onload = () => {
        crearDB();
    }
}

function crearDB(){
  //crear la base de datos 1.0
    const crearDB = window.indexedDB.open('citas', 1);

    //si hay un error al crear la base de datos
    crearDB.onerror = function() {
        console.log('Hubo un Error');
    }
     //si se crea correctamente la base de datos

     crearDB.onsuccess = function(){
        console.log('Base de datos creada');
  //instanciamos la base de datos creada a DB
        DB = crearDB.result;
        //Mostrar citas al cargar (Pero IndexDb ya esta listo)
        ui.imprimirCitas();
     }

     //Definir el schema
     crearDB.onupgradeneeded = function(e) {
        const db = e.target.result;

        const objectStore = db.createObjectStore('citas', {
            keyPath: 'id',
            autoIncrement: true
        });

        //Definir todas las columnas
        objectStore.createIndex('mascota', 'mascota', { unique: false});
        objectStore.createIndex('propietario', 'propietario', { unique: false });
        objectStore.createIndex('telefono', 'telefono', { unique: false });
        objectStore.createIndex('fecha', 'fecha', { unique: false });
        objectStore.createIndex('hora', 'hora', { unique: false });
        objectStore.createIndex('sintomas', 'sintomas', { unique: false });
        objectStore.createIndex('id', 'id', { unique: true });
    
        console.log('Db creada y lista');
    }
}






//objeto con la información de la cita
export const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

//Agrega datos al objeto de cita
export function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
    // console.log(citaObj);
}

//Valida y agrega nueva cita a la clase de citas
export function nuevaCita(e){
    e.preventDefault();

    //Extraer información del objeto de citas 
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    //validar 
    if( mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
        
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');

        return;
    }

    if (editando){
        // ui.imprimirAlerta('Editado correctamente', 'info');

        //Pasar el objeto de la cita a edición
        administrarCitas.editarCita({...citaObj})


        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');
        objectStore.put(citaObj);

        transaction.oncomplete = () => {
            ui.imprimirAlerta('Editado correctamente', 'info');
        //Regresar el texto del botón a su estado original
        formulario.querySelector('button[type="submit"]').textContent = "Crear Cita";
        //quitar modo edicón
        editando = false;
        }
        transaction.onerror = () => {
            console.log('Hubo un error')
        }
    } else {
        //Generar un id único
        citaObj.id = Date.now();

        //Creando nueva cita
        administrarCitas.agregarCita({...citaObj});

        //Insertar Registro en indexdb 
        const transaction = DB.transaction(['citas'], 'readwrite');

        //Habiloitar el objectStore
        const objectStore = transaction.objectStore('citas');
        //Insertar en la BD
        objectStore.add(citaObj);

        transaction.oncomplete = function() {
            console.log('cita agregada')
                //mensaje de agregado correctamente
        ui.imprimirAlerta('Se agregó correctamente');
        }

    
    }
// Imprimir el HTML de citas
    ui.imprimirCitas();
    
    //Reiniciar el obj para la validación
    reiniciarObj();
    
    //Reiniciar el formulario
    formulario.reset();

    //Mostrar el HTML de las citas 
    // ui.imprimirCitas(administrarCitas);
}


export function reiniciarObj () {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';

}

export function eliminarCita(id){
    //Eliminar
    // administrarCitas.eliminarCita(id);
    //mostrar mensaje
    // ui.imprimirAlerta('La cita se eliminó correctamente', 'war');
    //Refresacar
    // ui.imprimirCitas(administrarCitas);
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');
    objectStore.delete(id);

    transaction.oncomplete = () => {
        ui.imprimirAlerta('La cita se eliminó correctamente', 'war');
        ui.imprimirCitas();

    }

    transaction.onerror = () => {
        console.log('Hubo un error');
    }

}

//Cargar los datos y el modo edición
export function cargarEdicion(cita){
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    //Llenar inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;



    formulario.querySelector('button[type="submit"]').textContent = "Guardar Cambios";

    editando = true;
} 