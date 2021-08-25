let pagina = 1;
const cita = {
    nombre: '',
    fecha: '',
    hora: '20:20',
    servicios: []
}
document.addEventListener('DOMContentLoaded', () => {
    iniciarApp();
});
function iniciarApp(){
    consultarDB();
    mostrarSeccion();
    cambiarSeccion();

    //paginacion siguiente y anterior
    paginaSiguiente();
    paginaAnterior();

    //Comprueba la pagina actual para mostrar o ocultar el boton
    botonesPaginador();

    //Muestra el resumen dela cita o mensaje de error en caso de no pasar la validacion
    mostrarResumen();

    nombreCita();
    fechaCita();
    desabilitarFechaAnterior();
    horaCita();
}
function mostrarSeccion(){
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    const tabAnterior = document.querySelector('.tabs .actual');
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }

    //Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');

    //llamara la funcion de mostrar la seccion 
}
function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button');
    enlaces.forEach(enlace =>{
        enlace.addEventListener('click', e =>{
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            mostrarSeccion();
            botonesPaginador();
        });
    });
}
async function consultarDB(){
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const {servicios} = db;

        servicios.forEach(servicio => {
            const {id, nombre, precio} = servicio;

            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            //general el precio del servicio
            const precioServicio = document.createElement('p');
            precioServicio.textContent = `$${precio}`;
            precioServicio.classList.add('precio-servicio');
            //Generar el contenedor servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicios');
            servicioDiv.dataset.idServicio = id;

            //Seeccion de un div para una cita
           servicioDiv.onclick = seleccionarServicio;

            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);
            document.querySelector('#servicios').appendChild(servicioDiv); 
        });
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e){
    let elemento;
    if(e.target.tagName === 'P'){
        elemento = e.target.parentElement;
    }else{
        elemento = e.target;
    }

    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');
        const id = parseInt(elemento.dataset.idServicio);
        eliminarServicios(id);
    }
    else{
        elemento.classList.add('seleccionado');
        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent

        }
        agregarServicios(servicioObj);
    }
}
function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', ()=>{
        pagina++;
        botonesPaginador();
    });
}
function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', ()=>{
        pagina--;
        botonesPaginador();
    });
}
function botonesPaginador(){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');
    if(pagina === 1){
        paginaAnterior.style.visibility = 'hidden';
    }
    else{
        paginaAnterior.style.visibility = 'visible';
    }
    if(pagina === 3){
        paginaSiguiente.style.visibility = 'hidden';
        mostrarResumen();
    }
    else{
        paginaSiguiente.style.visibility = 'visible';
    }
    mostrarSeccion();
}
function mostrarResumen(){
    const { nombre, fecha, hora, servicios } = cita;
    const resumenDiv = document.querySelector('.contenido-resumen');

    while(resumenDiv.firstChild){
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    if(Object.values(cita).includes('')){
        const noServicios = document.createElement('P');
        noServicios.textContent = "Faltan datos de servicios como nombre, hora o fecha";
        noServicios.classList.add('invalidar-cita');
        resumenDiv.appendChild(noServicios);

        return;
    }
    const headingCitas = document.createElement('H3');
    headingCitas.textContent = "Resumen de citas";

    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre: </span>${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha: </span>${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora: </span>${hora}`;

    //iterar sobre los servicios
    const servicioCita = document.createElement('DIV');
    servicioCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = "Resumen de servicios";
    servicioCita.appendChild(headingServicios);
    let cantida = 0;

    servicios.forEach(servicio => {
        const {nombre, precio} = servicio
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');
        const totalServicios = precio.split('$');
        cantida += parseInt(totalServicios[1].trim());

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);
        servicioCita.appendChild(contenedorServicio);
    });
    resumenDiv.appendChild(headingCitas)
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(servicioCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>La cantidad a pagar es de: </span>$${cantida}`;
    resumenDiv.appendChild(cantidadPagar);
}
function eliminarServicios(id){
    const {servicios} = cita;
    cita.servicios = servicios.filter(servicios => servicios.id !== id);
    console.log(cita);
}
function agregarServicios(servicioObj){
    const {servicios} = cita;
    cita.servicios = [...servicios, servicioObj];
    console.log(cita);
}
function nombreCita(){
    const nombreInput = document.querySelector('#nombre');
    nombreInput.addEventListener('input', e =>{
        const nombreTexto = e.target.value.trim();
        if(nombreTexto==='' || nombreTexto.length < 3){
            mostrarAlerta('nombre no valido!', 'error');
        }
        else{
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    });
}
function mostrarAlerta(mensaje, tipo){
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia)
    {
        return;
    }
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error');
    alerta.classList.add('error');

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    setTimeout(()=>{
        alerta.remove();
    }, 3000);
}
function fechaCita(){
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e =>{
        const dia = new Date(e.target.value).getUTCDay();
        if([0, 6].includes(dia)){
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Los fines de semana no ofrecemos servicios, selecciona otro dia', 'error');
        }
        else{
            cita.fecha = fechaInput.value;
            console.log(cita);
        }
    });
}
function desabilitarFechaAnterior(){
    const inputFecha = document.querySelector('#fecha');
    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate();

    const fechaDesabilitar = `${year}-${mes}-${dia}`;
    inputFecha.min = fechaDesabilitar;
}
function horaCita(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e =>{
        const horaCita = e.target.value;
        const hora = horaCita.split(':')
        if(hora[0] < 10 ||  hora[0] > 18){
            mostrarAlerta('A esa hora no estamos laborando!', 'error');
            setTimeout(()=>{
                inputHora.value = '';
            },3000);
        }
        else{
            cita.hora = horaCita;
        }
    });
}