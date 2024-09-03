// Función para obtener una imagen aleatoria de la carpeta /source
function obtenerImagenAleatoria() {
    const imagenes = [
        'source/1.webp',
        'source/2.webp',
        'source/3.webp',
        'source/4.webp',
        'source/5.webp',
        'source/6.webp',
        'source/7.webp',
        'source/8.webp'
    ];
    const indiceAleatorio = Math.floor(Math.random() * imagenes.length);
    return imagenes[indiceAleatorio];
}

// Función para ejecutar la consulta y dibujar la lista de invitados
function drawSheetName(searchTerm = '') {
    let queryString = 'SELECT A, B, C, D';
    const query = new google.visualization.Query(
        'https://docs.google.com/spreadsheets/d/1FJM8OsK-Jc2gM_GVtXuYbBCCOeCXgOL1Z_rmxqkGOS0/gviz/tq?sheet=Lista%20de%20Invitados&headers=1&tq='
        + encodeURIComponent(queryString)
    );
    query.send(response => handleQueryResponse(response, searchTerm));
}

function handleQueryResponse(response, searchTerm) {
    if (response.isError()) {
        console.error('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
        return;
    }

    const data = response.getDataTable();
    const listaDeInvitados = document.getElementById('lista-de-invitados');
    const totalElement = document.getElementById('total-invitados');
    listaDeInvitados.innerHTML = '';

    let total = 0;
    let found = false;

    for (let i = data.getNumberOfRows() - 1; i >= 0; i--) {
        const invitado = data.getValue(i, 0);       // Columna A
        const acompanado = data.getValue(i, 1);     // Columna B
        const cantidad = data.getValue(i, 2);       // Columna C
        const numero = data.getValue(i, 3);         // Columna D
        let imagenUrl = obtenerImagenAleatoria();   // Imagen aleatoria

        // Sumar el total de la columna D
        total += numero ? parseInt(numero, 10) : 0;

        // Convertir valores a cadena y manejar valores null
        const invitadoStr = invitado ? invitado.toString().toLowerCase() : '';
        const acompanadoStr = acompanado ? acompanado.toString().toLowerCase() : '';
        const cantidadStr = cantidad ? cantidad.toString().toLowerCase() : '';

        if (
            searchTerm &&
            !invitadoStr.includes(searchTerm.toLowerCase()) &&
            !acompanadoStr.includes(searchTerm.toLowerCase()) &&
            !cantidadStr.includes(searchTerm.toLowerCase())
        ) {
            continue;
        }

        found = true;
        const card = document.createElement('div');
        card.className = 'card mb-3';

        const img = document.createElement('img');
        img.src = imagenUrl;
        img.className = 'card-img-top';

        const details = document.createElement('div');
        details.className = 'card-body';

        const invitadoDiv = document.createElement('h5');
        invitadoDiv.className = 'card-title';
        invitadoDiv.textContent = `Invitado: ${invitado}`;

        const acompanadoDiv = document.createElement('p');
        acompanadoDiv.className = 'card-text';
        acompanadoDiv.textContent = `Acompañado: ${acompanado}`;

        const cantidadDiv = document.createElement('p');
        cantidadDiv.className = 'card-text';
        cantidadDiv.textContent = `Cantidad: ${cantidad}`;

        details.appendChild(invitadoDiv);
        details.appendChild(acompanadoDiv);
        details.appendChild(cantidadDiv);
        card.appendChild(img);
        card.appendChild(details);
        listaDeInvitados.appendChild(card);
    }

    if (!found) {
        alert('No se encuentra el invitado');
    }

    // Mostrar el total
    totalElement.textContent = total;
}

function search() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.trim();

    if (searchTerm === '') {
        // Si el campo de búsqueda está vacío, mostrar toda la lista
        drawSheetName();
    } else {
        // Si hay algo escrito, buscar con el término de búsqueda
        drawSheetName(searchTerm);
    }
}

// Cargar Google Charts y ejecutar la función drawSheetName cuando esté listo
google.charts.load('current', { 'packages': ['corechart', 'table'] });
google.charts.setOnLoadCallback(() => drawSheetName());

