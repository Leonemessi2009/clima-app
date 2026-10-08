// ============================================
// CONFIGURACIÓN
// ============================================

// Coloca aquí tu API Key de OpenWeatherMap
const API_KEY = 'a51aef3d69fa3f62fff8c7e1a6803fb7';

const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// ============================================
// REFERENCIAS AL DOM
// ============================================

const formulario = document.getElementById('formulario');
const inputCiudad = document.getElementById('inputCiudad');
const resultado = document.getElementById('resultado');
const estado = document.getElementById('estado');
const pronostico = document.getElementById('pronostico');
const btnWhatsApp = document.getElementById('btnWhatsApp');
const historial = document.getElementById('historial');
const btnTema = document.getElementById('btnTema');


// ============================================
// BOTÓN: MI UBICACIÓN
// ============================================

document.getElementById('btnUbicacion').addEventListener('click', () => {

    navigator.geolocation.getCurrentPosition(async (posicion) => {

        const lat = posicion.coords.latitude;
        const lon = posicion.coords.longitude;

        const url =
            `${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;

        const respuesta = await fetch(url);

        const datos = await respuesta.json();

        mostrarClima(datos);

    });

});

btnTema.addEventListener('click', () => {
    document.body.classList.toggle('claro');
});


// ============================================
// FUNCIÓN PRINCIPAL: CONSULTAR CLIMA
// ============================================

async function consultarClima(ciudad) {

    estado.textContent = 'Consultando el clima...';

    resultado.classList.remove('visible');

    try {

        const ciudadCodificada =
            encodeURIComponent(ciudad);

        const url =
            `${API_URL}?q=${ciudadCodificada}&appid=${API_KEY}&units=metric&lang=es`;

        const respuesta = await fetch(url);

        if (!respuesta.ok) {

            if (respuesta.status === 404) {

                throw new Error('Ciudad no encontrada');

            } else if (respuesta.status === 401) {

                throw new Error('API Key inválida');

            } else {

                throw new Error(
                    'Error en la petición: ' + respuesta.status
                );
            }
        }

        const datos = await respuesta.json();

        mostrarClima(datos);

        estado.textContent =
            '✅ Datos actualizados correctamente.';

    } catch (error) {

        console.error('Error:', error);

        estado.textContent =
            `❌ ${error.message}. Intenta con otra ciudad.`;

        resultado.classList.remove('visible');
    }
}


// ============================================
// FUNCIÓN: CONSULTAR PRONÓSTICO
// ============================================

async function consultarPronostico(ciudad) {

    const ciudadCodificada =
        encodeURIComponent(ciudad);

    const url =
        `https://api.openweathermap.org/data/2.5/forecast?q=${ciudadCodificada}&appid=${API_KEY}&units=metric&lang=es`;

    const respuesta = await fetch(url);

    const datos = await respuesta.json();

    mostrarPronostico(datos);
}


// ============================================
// FUNCIÓN: MOSTRAR PRONÓSTICO
// ============================================

function mostrarPronostico(datos) {

    pronostico.innerHTML =
        '<h2>Pronóstico de 5 días</h2>';

    datos.list.forEach((item, index) => {

        if (index % 8 === 0) {

            const fecha =
                new Date(item.dt * 1000);

            const temperatura =
                Math.round(item.main.temp);

            const descripcion =
                item.weather[0].description;

            const icono =
                item.weather[0].icon;

            const iconoUrl =
                `https://openweathermap.org/img/wn/${icono}.png`;

            pronostico.innerHTML += `
                <div class="dia-pronostico">

                    <h3>
                        ${fecha.toLocaleDateString('es-MX', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                        })}
                    </h3>

                    <img
                        src="${iconoUrl}"
                        alt="${descripcion}"
                    >

                    <p>
                        ${temperatura}°C
                    </p>

                    <p>
                        ${descripcion}
                    </p>

                </div>
            `;
        }
    });
}


// ============================================
// FUNCIÓN: GUARDAR HISTORIAL
// ============================================

function guardarHistorial(ciudad) {

    let historialGuardado =
        JSON.parse(localStorage.getItem('historial')) || [];

    historialGuardado.push(ciudad);

    historialGuardado =
        historialGuardado.slice(-5);

    localStorage.setItem(
        'historial',
        JSON.stringify(historialGuardado)
    );

    mostrarHistorial();
}


// ============================================
// FUNCIÓN: MOSTRAR HISTORIAL
// ============================================

function mostrarHistorial() {

    let historialGuardado =
        JSON.parse(localStorage.getItem('historial')) || [];

    historial.innerHTML =
        '<h3>Últimas búsquedas</h3>';

    historialGuardado.forEach((ciudad) => {

        const boton =
            document.createElement('button');

        boton.textContent = ciudad;

        boton.addEventListener('click', () => {

            consultarClima(ciudad);

            consultarPronostico(ciudad);

        });

        historial.appendChild(boton);
    });
}


// ============================================
// FUNCIÓN: MOSTRAR EL CLIMA EN EL DOM
// ============================================

function mostrarClima(datos) {

    const ciudad =
        datos.name;

    const pais =
        datos.sys.country;

    const temperatura =
        Math.round(datos.main.temp);

    const sensacion =
        Math.round(datos.main.feels_like);

    const humedad =
        datos.main.humidity;

    const presion =
        datos.main.pressure;

    const viento =
        datos.wind.speed;

    const descripcion =
        datos.weather[0].description;

    const icono =
        datos.weather[0].icon;


    // ============================================
    // URL DEL ICONO
    // ============================================

    const iconoUrl =
        `https://openweathermap.org/img/wn/${icono}@2x.png`;


    // ============================================
    // CONSTRUIR HTML DEL RESULTADO
    // ============================================

    resultado.innerHTML = `
        <div class="ciudad">
            ${ciudad}
        </div>

        <div class="pais">
            ${pais}
        </div>

        <img
            class="icono-clima"
            src="${iconoUrl}"
            alt="${descripcion}"
        >

        <div class="temperatura">
            ${temperatura}°C
        </div>

        <div class="descripcion">
            ${descripcion}
        </div>

        <div class="detalles">

            <div class="detalle">

                <div class="etiqueta">
                    Sensación
                </div>

                <div class="valor">
                    ${sensacion}°C
                </div>

            </div>

            <div class="detalle">

                <div class="etiqueta">
                    Humedad
                </div>

                <div class="valor">
                    ${humedad}%
                </div>

            </div>

            <div class="detalle">

                <div class="etiqueta">
                    Presión
                </div>

                <div class="valor">
                    ${presion} hPa
                </div>

            </div>

            <div class="detalle">

                <div class="etiqueta">
                    Viento
                </div>

                <div class="valor">
                    ${viento} m/s
                </div>

            </div>

        </div>
    `;


    // ============================================
    // MOSTRAR RESULTADO
    // ============================================

    resultado.classList.add('visible');


    // ============================================
    // CAMBIAR FONDO SEGÚN EL CLIMA
    // ============================================

    cambiarFondoSegunClima(
        datos.weather[0].main
    );
}


// ============================================
// FUNCIÓN: CAMBIAR FONDO SEGÚN EL CLIMA
// ============================================

function cambiarFondoSegunClima(clima) {

    document.body.classList.remove(
        'clima-soleado',
        'clima-nublado',
        'clima-lluvioso',
        'clima-nieve'
    );

    const climaLower =
        clima.toLowerCase();


    // Clima soleado
    if (climaLower.includes('clear')) {

        document.body.classList.add(
            'clima-soleado'
        );


    // Clima nublado
    } else if (climaLower.includes('cloud')) {

        document.body.classList.add(
            'clima-nublado'
        );


    // Clima lluvioso
    } else if (
        climaLower.includes('rain') ||
        climaLower.includes('drizzle') ||
        climaLower.includes('thunderstorm')
    ) {

        document.body.classList.add(
            'clima-lluvioso'
        );


    // Clima con nieve
    } else if (climaLower.includes('snow')) {

        document.body.classList.add(
            'clima-nieve'
        );
    }
}


// ============================================
// BOTÓN: COMPARTIR EN WHATSAPP
// ============================================

btnWhatsApp.addEventListener('click', () => {

    const ciudad =
        document.querySelector('.ciudad').textContent;

    const temperatura =
        document.querySelector('.temperatura').textContent;

    const mensaje =
        `El clima en ${ciudad} es de ${temperatura}`;

    const url =
        `https://wa.me/?text=${encodeURIComponent(mensaje)}`;

    window.open(url, '_blank');

});


// ============================================
// EVENTO DEL FORMULARIO
// ============================================

formulario.addEventListener('submit', (e) => {

    e.preventDefault();

    const ciudad =
        inputCiudad.value.trim();

    if (!ciudad) {

        estado.textContent =
            'Escribe el nombre de una ciudad.';

        return;
    }

    consultarClima(ciudad);

    consultarPronostico(ciudad);

    guardarHistorial(ciudad);

});


// ============================================
// MENSAJE INICIAL
// ============================================

estado.textContent =
    'Escribe una ciudad y presiona "Consultar".';


// ============================================
// MOSTRAR HISTORIAL AL CARGAR
// ============================================

mostrarHistorial();


// ============================================
// CONSULTAR CLIMA AL CARGAR
// ============================================

// consultarClima('Mexico City');