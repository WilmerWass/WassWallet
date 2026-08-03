export function renderCuentas(contenedor) {
    const cuentas = JSON.parse(sessionStorage.getItem('wass_cuentas')) || [];

    contenedor.innerHTML = `
        <div class="view-section">
            <h3>Cuentas y Billeteras</h3>
            <div class="card-form">
                <h4>Agregar Cuenta</h4>
                <input type="text" id="nombre-cuenta" placeholder="Nombre (ej. Nequi)">
                <input type="number" id="saldo-inicial" placeholder="Saldo Inicial">
                <button id="btn-add-cuenta">Registrar Cuenta</button>
            </div>
            <div class="data-list">
                <h4>Mis Cuentas</h4>
                <ul id="lista-cuentas">
                    ${cuentas.length === 0 ? '<p style="color: #64748b; font-size: 0.85rem;">No hay cuentas registradas.</p>' : ''}
                    ${cuentas.map(c => `<li><span>${c.nombre}</span> <strong style="color: #10b981;">$${c.saldo}</strong></li>`).join('')}
                </ul>
            </div>
        </div>
    `;

    document.getElementById('btn-add-cuenta').addEventListener('click', () => {
        const nombre = document.getElementById('nombre-cuenta').value;
        const saldo = document.getElementById('saldo-inicial').value;
        if (!nombre || !saldo) return;

        cuentas.push({ nombre, saldo });
        sessionStorage.setItem('wass_cuentas', JSON.stringify(cuentas));
        renderCuentas(contenedor);
    });
}