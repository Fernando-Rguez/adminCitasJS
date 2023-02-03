import Citas from './classes/Citas.js';
import UI from './classes/UI.js';
import { mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput, formulario } from './selectores.js';
const administrarCitas = new Citas();
const ui = new UI();

let editando;
//objeto con la información de la cita
const citaObj = {
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
        ui.imprimirAlerta('Editado correctamente', 'info');

        //Pasar el objeto de la cita a edición
        administrarCitas.editarCita({...citaObj})

        //Regresar el texto del botón a su estado original
        formulario.querySelector('button[type="submit"]').textContent = "Crear Cita";
        //quitar modo edicón
        editando = false;
    } else {
        //Generar un id único
        citaObj.id = Date.now();

        //Creando nueva cita
        administrarCitas.agregarCita({...citaObj});

        //mensaje de agregado correctamente
        ui.imprimirAlerta('Se agregó correctamente');
    }


    
    //Reiniciar el obj para la validación
    reiniciarObj();
    
    //Reiniciar el formulario
    formulario.reset();

    //Mostrar el HTML de las citas 
    ui.imprimirCitas(administrarCitas);
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
    administrarCitas.eliminarCita(id);
    //mostrar mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente', 'war');
    //Refresacar
    ui.imprimirCitas(administrarCitas);
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