

// Referencia HTML
const lblEscritorio = document.querySelector('h1');
const lblTicket = document.querySelector('small');
const btnAtender = document.querySelector('button');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');


const searchParams = new URLSearchParams( window.location.search );

if( !searchParams.has('escritorio') ){
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get( 'escritorio' );
lblEscritorio.innerText = escritorio;
divAlerta.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', ( pendientes ) => {
    
    if( pendientes === 0 ) {
        lblPendientes.style.display = 'none';
        divAlerta.style.display = '';
        btnAtender.disabled = true;
    } else {
        lblPendientes.innerText = pendientes;
        lblPendientes.style.display = '';
        divAlerta.style.display = 'none';
        btnAtender.disabled = false;
    }

})


btnAtender.addEventListener('click', () => {

    socket.emit('atender-ticket', { escritorio }, ( { ok, ticket } ) => {
        if(!ok) {
            lblTicket.innerText = 'Nadie'
            return divAlerta.style.display = '';
        }

        lblTicket.innerText = `Ticket ${ ticket.numero }`
    })

})