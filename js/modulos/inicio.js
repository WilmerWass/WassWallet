export function renderInicio(contenedor) {
    const movimientos = JSON.parse(sessionStorage.getItem('wass_movimientos')) || [];

    contenedor.innerHTML = `
        <div class="view-section">
            <h3>Panel de Inicio</h3>
            <div class="card-form">
                <h4>Registrar Movimiento Rápido</h4>
                <input type="text" id="desc-mov" placeholder="Descripción">
                <input type="number" id="monto-mov" placeholder="Monto">
                <button id="btn-add-mov">Agregar Movimiento</button>
            </div>
            <div class="data-list">
                <h4>Movimientos Recientes</h4>
                <ul id="lista-movimientos">
                    ${movimientos.length === 0 ? '<p style="color: #64748b; font-size: 0.85rem;">Sin movimientos recientes.</p>' : ''}
                    ${movimientos.map(m => `<li><span>${m.desc}</span> <strong style="color: #10b981;">$${m.monto}</strong></li>`).join('')}
                </ul>
            </div>
        </div>
    `;

    document.getElementById('btn-add-mov').addEventListener('click', () => {
        const desc = document.getElementById('desc-mov').value;
        const monto = document.getElementById('monto-mov').value;
        if (!desc || !monto) return;

        movimientos.push({ desc, monto });
        sessionStorage.setItem('wass_movimientos', JSON.stringify(movimientos));
        renderInicio(contenedor);
    });
}