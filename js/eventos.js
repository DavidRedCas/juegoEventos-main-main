function seleccionarPreguntasAleatorias(preguntas, cantidad) {
    const preguntasBarajadas = preguntas.sort(() => Math.random() - 0.5);
    return preguntasBarajadas.slice(0, cantidad);
}

var preguntasSeleccionadas = seleccionarPreguntasAleatorias(preguntas, 1);

var contenedorPregunta = document.querySelectorAll(".contenedorPregunta");
var textoPregunta = document.getElementById("pregunta");
var contenedorOpciones = document.getElementById("opciones");
var preguntaActual = 0;

let resultados = [];
let aciertos = 0;
let fallos = 0;

function cargarPregunta(indice) {
    if (indice < preguntasSeleccionadas.length) {
        textoPregunta.textContent = preguntasSeleccionadas[indice].pregunta;
        contenedorOpciones.innerHTML = '';

        var respuestas = preguntasSeleccionadas[indice].respuesta;
        for (var clave in respuestas) {
            var opcion = document.createElement("p");
            opcion.textContent = respuestas[clave];
            opcion.setAttribute("data-respuesta", clave);
            opcion.classList.add("opcion");
            contenedorOpciones.appendChild(opcion);
        }

        var opciones = document.querySelectorAll(".opcion");
        for (var i = 0; i < opciones.length; i++) {
            opciones[i].addEventListener("click", function () {
                for (var j = 0; j < opciones.length; j++) {
                    opciones[j].style.pointerEvents = "none";
                }

                var respuestaSeleccionada = this.getAttribute("data-respuesta");
                var esCorrecta = respuestaSeleccionada === preguntasSeleccionadas[indice].respuestaCorrecta;
                var elementoSeleccionado = this;

                elementoSeleccionado.classList.add("parpadeando");
                elementoSeleccionado.addEventListener("animationend", function () {
                    elementoSeleccionado.classList.remove("parpadeando");
                    elementoSeleccionado.classList.add(esCorrecta ? "correcta" : "incorrecta");
                    if (!esCorrecta) {
                        var opcionCorrecta = document.querySelector(`[data-respuesta="${preguntasSeleccionadas[indice].respuestaCorrecta}"]`);
                        opcionCorrecta.classList.add("parpadeando-correcta");
                    }

                    resultados.push(esCorrecta ? "acertada" : "fallada");
                    esCorrecta ? aciertos++ : fallos++;
                    var carta = document.querySelectorAll(".carta")[indice];
                    carta.classList.add(esCorrecta ? "correcta" : "incorrecta");
                    var tiempoDeEspera = esCorrecta ? 1200 : 3400;

                    setTimeout(function () {
                        cargarPregunta(indice + 1);
                    }, tiempoDeEspera);
                });
            });
        }
    } else {
        setTimeout(finalizarQuiz, 500);
    }
}

let clickFinalizado = false;

function finalizarQuiz() {
    const cartas = document.querySelectorAll(".carta");
    cartas.forEach(carta => {
        carta.style.pointerEvents = "none";
    });

    document.removeEventListener('keydown', manejarTecla);

    contenedorPregunta[0].style.display = "none";
    contenedorOpciones.style.display = "none";
    const numCartas = cartas.length;
    const distanciaEntreCartas = 30;
    const espacioTotal = (numCartas - 1) * distanciaEntreCartas;
    const margenIzquierda = -(espacioTotal / 2);

    cartas.forEach((carta, index) => {
        setTimeout(() => {
            carta.style.transition = "transform 1s ease-in-out, margin 1s ease-in-out";
            carta.style.transform = `translate(0px, 250px) scale(3.2) translateX(${margenIzquierda + index * distanciaEntreCartas}px)`;
            if (!carta.querySelector("span")) {
                const numero = document.createElement("span");
                numero.textContent = index + 1;
                numero.classList.add("numero-carta");
                carta.appendChild(numero);
            }

            setTimeout(() => {
                carta.style.transform = `translate(0px, 250px) scale(3.2) translateX(${margenIzquierda + index * distanciaEntreCartas}px) rotateY(180deg)`;
                setTimeout(() => {
                    carta.classList.add("gris");
                }, 500);
                setTimeout(() => {
                    carta.style.transition = "transform 1s ease-in-out";
                    carta.style.transform = `translate(0px, 450px) scale(3.2) translateX(${margenIzquierda + index * -12}px)`;
                }, 1300);
                setTimeout(() => {
                    carta.style.transform = `translate(0px, 450px) scale(3.2) translateX(${margenIzquierda + index * distanciaEntreCartas}px) rotateY(360deg)`;
                    setTimeout(() => {
                        const numero = carta.querySelector("span");
                        if (numero) {
                            numero.style.display = "flex";
                        }
                        iniciarEventosTeclado();
                    }, 800);
                }, 3000);
            }, 1500);
        }, 200 * index);
    });
    for (let i = resultados.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [resultados[i], resultados[j]] = [resultados[j], resultados[i]];
    }
    console.log(resultados);
}

function manejarTecla(event) {
    if (event.key >= 1 && event.key <= 5 && !clickFinalizado) {
        let numeroCarta = parseInt(event.key) - 1;
        let cartaSeleccionada = document.querySelectorAll(".carta")[numeroCarta];
        if (cartaSeleccionada) {
            voltearCarta(cartaSeleccionada, numeroCarta);
            clickFinalizado = true;
        }
    }
}

function iniciarEventosTeclado() {
    document.addEventListener('keydown', manejarTecla);
}

function voltearCarta(carta, indice) {
    if (carta.style.transform !== 'rotateY(180deg)') {
        carta.style.transform = 'rotateY(180deg) translate(0px, 250px) scale(4)';
        setTimeout(function() {
            carta.querySelector(".numero-carta").style.visibility = "hidden";
            carta.classList.remove('gris');
            
            if (resultados[indice] === 'acertada') {
                carta.style.backgroundColor = 'rgb(65, 220, 65)';
            } else {
                carta.style.backgroundColor = 'rgb(245, 50, 50)';
            }

            let contenido = carta.querySelector(".contenido");
            let ganador = document.querySelector(".ganador");
            let perdedor = document.querySelector(".perdedor");
            if (resultados[indice] === 'acertada') {
            //    contenido.textContent = "Correcta";
                ganador.style.visibility = "visible";
            } else {
                contenido.textContent = "Incorrecta";
                perdedor.style.visibility = "visible";
            }

            carta.querySelector(".numero-carta").style.visibility = "visible";
        }, 500);
    }
}

cargarPregunta(preguntaActual);


//animacion titulo
const h1 = document.querySelector("h1");
const originalColor = "#212427";
const waveInterval = 10000;

function waveEffect() {
    const letters = h1.textContent.split("");
    h1.innerHTML = "";

    letters.forEach((letter, index) => {
        const span = document.createElement("span");
        span.textContent = letter === " " ? "\u00A0" : letter;
        h1.appendChild(span);

        setTimeout(() => {
            span.style.color = Math.random() > 0.5 ? "red" : "green";
        }, index * 100);

        setTimeout(() => {
            span.style.color = originalColor;
        }, index * 100 + 3000);
    });
}
setInterval(waveEffect, waveInterval);
