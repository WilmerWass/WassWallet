export function renderDeudas(contenedor) {
    const deudas = JSON.parse(sessionStorage.getItem('wass_deudas')) || [];

    contenedor.innerHTML = `
        <div class="view-section">
            <h3>Control de Deudas</h3>
            <div class="card-form">
                <h4>Registrar Deuda</h4>
                <input type="text" id="acreedor" placeholder="Acreedor / Persona">
                <input type="number" id="monto-deuda" placeholder="Monto adeudado">
                <button id="btn-add-deuda">Guardar Deuda</button>
            </div>
            <div class="data-list">
                <h4>Deudas Pendientes</h4>
                <ul id="lista-deudas">
                    ${deudas.length === 0 ? '<p style="color: #64748b; font-size: 0.85rem;">No hay deudas registradas.</p>' : ''}
                    ${deudas.map(d => `<li><span>${d.acreedor}</span> <strong style="color: #f43f5e;">$${d.monto}</strong></li>`).join('')}
                </ul>
            </div>
        </div>
    `;

    document.getElementById('btn-add-deuda').addEventListener('click', () => {
        const acreedor = document.getElementById('acreedor').value;
        const monto = document.getElementById('monto-deuda').value;
        if (!acreedor || !monto) return;

        deudas.push({ acreedor, monto });
        sessionStorage.setItem('wass_deudas', JSON.stringify(deudas));
        renderDeudas(contenedor);
    });
}