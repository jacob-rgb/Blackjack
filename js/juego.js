

const Module = (() => {
    'use strict'

    let deck = [];
    const tipos = ['C', 'D','H','S'],
         especiales = ['A','J','Q','K'];
    
    let puntosJugador = 0,
        puntosComputadora = 0;
    
    const btnEmpezar = document.querySelector('#btnEmpezar'),
          btnPedir = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener'),
          [puntosJ, puntosC] = document.querySelectorAll('small'),
          jugadorCont = document.querySelector('#jugador-cartas'),
          computadoraCont = document.querySelector('#computadora-cartas'),
          modal = document.querySelector('.modalFinJuego'),
          modalTitle = document.querySelector('#modal-msg'),
          btnCerrarModal = document.querySelector('#cerrar-modal');
    
    
    const crearDeck = () => {
        for( let i = 2; i <= 10; i++) {
            for( let tipo of tipos) {
                deck.push(i + tipo);
            }
        }
        for(let tipo of tipos) {
            for(let esp of especiales) {
                deck.push(esp + tipo);
            }
        }
    }
    
    const barajarDeck = () => {
        deck = deck.map(value => ({value, sort: Math.random()}))
                    .sort((a,b) => a.sort - b.sort)
                    .map(({value}) => value);
    }
    
    const pedirCarta = () => {
        if(!deck.length) throw 'No hay cartas en el deck';
        const carta = deck.pop();
        return carta;
    }
    
    const getValorCarta = ( carta ) => {
       const valorCarta = carta.substr(0, carta.length - 1);
       return (isNaN(valorCarta)) ?
               (valorCarta === 'A') 
                ? (puntosJugador + 11 > 21) 
                    ? 1 
                    : 11 
                : 10 
               : parseInt(valorCarta);
    }
    
    const pintarCarta = (carta, jugador = 'humano') => {
        const newCarta = document.createElement('img');
        newCarta.src = `assets/cartas/${carta}.png`;
        newCarta.classList.add("carta");
        jugador === 'humano' ? jugadorCont.appendChild(newCarta) 
                             : computadoraCont.appendChild(newCarta);  
    }

    const turnoJugador = () => {
        const carta = pedirCarta();
        puntosJugador += getValorCarta(carta);
        puntosJ.innerText = puntosJugador;
        pintarCarta(carta);
        if(puntosJugador > 21) {
            modalTitle.innerText = 'Te has pasado. Lo sentimos.';
            toggleModal();
            btnPedir.disabled = true;
        } else if(puntosJugador === 21)  turnoComputadora();
    }

    const turnoComputadora = ( puntosMinimos ) => {
        let t = 0;
        const intervaloTurno = setInterval(() => {
            t += 1
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            const carta = pedirCarta();
            puntosComputadora += getValorCarta(carta);
            puntosC.innerText = puntosComputadora;
            pintarCarta(carta, 'computadora');
            if(puntosComputadora > 21) {
                modalTitle.innerText = 'La banca se ha pasado. Has ganado.';
                btnEmpezar.disabled = false;
                clearInterval(intervaloTurno);
                toggleModal();
            }  else if(puntosComputadora >= puntosMinimos) {
                 modalTitle.innerText = 'La banca gana, lo sentimos';
                 btnEmpezar.disabled = false;
                 clearInterval(intervaloTurno);
                toggleModal();
            } 
        }, 500);
    }

    const toggleModal = () => {
        modal.classList.contains('modalHidden') 
            ? modal.classList.remove('modalHidden')
            : modal.classList.add('modalHidden');
    }

    const borrarTableros = () => {
        computadoraCont.innerHTML = '';
        jugadorCont.innerHTML = '';
    }

    const limpiarJuego = () => {
        puntosJugador = 0;
        puntosJ.innerText = 0;
        puntosComputadora = 0;
        puntosC.innerHTML = 0;
        borrarTableros();
    }

    const empezarJuego = () => {
        limpiarJuego();
        crearDeck();
        barajarDeck();
        btnPedir.disabled = false;
        btnDetener.disabled = false;
        btnEmpezar.disabled = true;
        turnoJugador();
    }

    btnEmpezar.addEventListener('click', () => empezarJuego());
    btnPedir.addEventListener('click', () => turnoJugador());
    btnDetener.addEventListener('click', () => turnoComputadora(puntosJugador));
    btnCerrarModal.addEventListener('click', () => {
        toggleModal();
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        btnEmpezar.disabled = false;
    });

   
})();


