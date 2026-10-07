// ============================================
// CONFIGURACIÓN
// ============================================

// Coloca aquí tu API Key de OpenWeatherMap
const API_KEY = 'ce09a891a33f28565a519d6b2fe16063';

const API_URL = 'https://api.openweathermap.org/data/2.5/weather';


// ============================================
// REFERENCIAS AL DOM
// ============================================

const formulario = document.getElementById('formulario');
const inputCiudad = document.getElementById('inputCiudad');
const resultado = document.getElementById('resultado');
const estado = document.getElementById('estado');


// ============================================
// FUNCIÓN PRINCIPAL: CONSULTAR CLIMA
// ============================================

async function consultarClima(ciudad) {

    estado.textContent = 'Consultando el clima...';

    resultado.classList.remove('visible');

    try {

        const ciudadCodificada = encodeURIComponent(ciudad);

        const url = `${API_URL}?q=${ciudadCodificada}&appid=${API_KEY}&units=metric&lang=es`;

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

        estado.textContent = '✅ Datos actualizados correctamente.';

    } catch (error) {

        console.error('Error:', error);

        estado.textContent =
            `❌ ${error.message}. Intenta con otra ciudad.`;

        resultado.classList.remove('visible');
    }
}


// ============================================
// FUNCIÓN: MOSTRAR EL CLIMA EN EL DOM
// ============================================

function mostrarClima(datos) {

    const ciudad = datos.name;
    const pais = datos.sys.country;

    const temperatura = Math.round(datos.main.temp);

    const sensacion = Math.round(datos.main.feels_like);

    const humedad = datos.main.humidity;

    const presion = datos.main.pressure;

    const viento = datos.wind.speed;

    const descripcion = datos.weather[0].description;

    const icono = datos.weather[0].icon;


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


    // Mostrar resultado
    resultado.classList.add('visible');


    // Cambiar fondo según el clima
    cambiarFondoSegunClima(datos.weather[0].main);
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

    const climaLower = clima.toLowerCase();


    // Clima soleado
    if (climaLower.includes('clear')) {

        document.body.classList.add('clima-soleado');


    // Clima nublado
    } else if (climaLower.includes('cloud')) {

        document.body.classList.add('clima-nublado');


    // Clima lluvioso
    } else if (
        climaLower.includes('rain') ||
        climaLower.includes('drizzle') ||
        climaLower.includes('thunderstorm')
    ) {

        document.body.classList.add('clima-lluvioso');


    // Clima con nieve
    } else if (climaLower.includes('snow')) {

        document.body.classList.add('clima-nieve');
    }
}


// ============================================
// EVENTO DEL FORMULARIO
// ============================================

formulario.addEventListener('submit', (e) => {

    e.preventDefault();

    const ciudad = inputCiudad.value.trim();

    if (!ciudad) {

        estado.textContent =
            'Escribe el nombre de una ciudad.';

        return;
    }

    consultarClima(ciudad);
});


// ============================================
// MENSAJE INICIAL
// ============================================

estado.textContent =
    'Escribe una ciudad y presiona "Consultar".';


// ============================================
// CONSULTAR CLIMA AL CARGAR
// ============================================

// consultarClima('Mexico City');