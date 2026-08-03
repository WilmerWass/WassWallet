export function renderPresupuesto(contenedor) {
    const presupuestos = JSON.parse(sessionStorage.getItem('wass_presupuesto')) || [];

    contenedor.innerHTML = `
        <div class="view-section">
            <h3>Gestión de Presupuesto</h3>
            <div class="card-form">
                <h4>Definir Límite</h4>
                <input type="text" id="cat-presupuesto" placeholder="Categoría (ej. Comida)">
                <input type="number" id="limite-presupuesto" placeholder="Límite Máximo">
                <button id="btn-add-presupuesto">Crear Presupuesto</button>
            </div>
            <div class="data-list">
                <h4>Presupuestos Establecidos</h4>
                <ul id="lista-presupuestos">
                    ${presupuestos.length === 0 ? '<p style="color: #64748b; font-size: 0.85rem;">No hay presupuestos definidos.</p>' : ''}
                    ${presupuestos.map(p => `<li><span>${p.categoria}</span> <strong>$${p.limite}</strong></li>`).join('')}
                </ul>
            </div>
        </div>
    `;

    document.getElementById('btn-add-presupuesto').addEventListener('click', () => {
        const categoria = document.getElementById('cat-presupuesto').value;
        const limite = document.getElementById('limite-presupuesto').value;
        if (!categoria || !limite) return;

        presupuestos.push({ categoria, limite });
        sessionStorage.setItem('wass_presupuesto', JSON.stringify(presupuestos));
        renderPresupuesto(contenedor);
    });
}