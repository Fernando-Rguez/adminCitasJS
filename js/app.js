//Campos del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');
//UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

//Clases globales
class Citas{
    constructor(){
        this.citas = [];
    }

    agregarCita(cita){
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id){
        this.citas = this.citas.filter( cita => cita.id !== id );
    }
    
    editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }
}

class UI {

    imprimirAlerta(mensaje, tipo ) {
        //crear div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        //Agregar clase en base al tipo de error
        if ( tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else if (tipo === 'war'){
            divMensaje.classList.add('alert-warning');
        }else if (tipo === 'info'){
            divMensaje.classList.add('alert-info');
        }else {
            divMensaje.classList.add('alert-success');
        }

        //Mensaje Error 
        divMensaje.textContent = mensaje;

        //Agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        //Quitar alerta
        setTimeout( ()=>{
            divMensaje.remove();
        }, 5000 );
    }

    imprimirCitas({citas}){

        this.limpiarHtml();

        citas.forEach(cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;
        
            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;
            
            //Scriping de los elementos de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
                <span class="font-weigth-bolder">Propietario: </span> ${propietario}
            `;
            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
                <span class="font-weigth-bolder">Teléfono: </span> ${telefono}
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
                <span class="font-weigth-bolder">Fecha: </span> ${fecha}
            `;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
                <span class="font-weigth-bolder">Hora: </span> ${hora}
            `;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
                <span class="font-weigth-bolder">Síntomas: </span> ${sintomas}
            `;

            //Botón para eliminar la cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>';

            btnEliminar.onclick = () => eliminarCita(id);

            //Añade un botón para editar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>'

            btnEditar.onclick = () => cargarEdicion(cita);
            //Agregar los parrafos al div
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            //Agregar las citas al HTML
            contenedorCitas.appendChild(divCita);
        });
    }

    limpiarHtml(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild( contenedorCitas.firstChild);
        }
    }
}

const administrarCitas = new Citas();
const ui = new UI();

//Registrar eventos
eventlisteners();
function eventlisteners(){
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}
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
function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
    // console.log(citaObj);
}

//Valida y agrega nueva cita a la clase de citas
function nuevaCita(e){
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


function reiniciarObj () {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';

}

function eliminarCita(id){
    //Eliminar
    administrarCitas.eliminarCita(id);
    //mostrar mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente', 'war');
    //Refresacar
    ui.imprimirCitas(administrarCitas);
}

//Cargar los datos y el modo edición
function cargarEdicion(cita){
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