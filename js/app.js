// WassWallet: control de gastos y finanzas

let estadoFinanciero = JSON.parse(localStorage.getItem('wass_wallet_state')) || {
    disponible: 1650000,
    ingresos: 3500000,
    gastos: 620000,
    vencimientos: [
        { id: 1, titulo: 'Factura Internet Clarovideo', fecha: '2026-08-04', pagado: false, tipo: 'normal' },
        { id: 2, titulo: 'Cuota Crédito Salvavidas Nequi', fecha: 'VENCIDO', pagado: false, tipo: 'danger' }
    ],
    eventosCalendario: [{ id: 1, fecha: '2026-08-04', titulo: 'Pago Internet Clarovideo' }],
    presupuestos: [{ id: 1, categoria: 'Mercado del Mes', limite: 450000 }],
    cuentas: [
        { id: 1, nombre: 'Nequi', saldo: 1200000 },
        { id: 2, nombre: 'Bancolombia', saldo: 450000 }
    ],
    deudasLista: [{ id: 1, acreedor: 'Préstamo Nequi', monto: 300000 }]
};

function guardarEstado() {
    localStorage.setItem('wass_wallet_state', JSON.stringify(estadoFinanciero));
}

function renderInicio(contenedor) {
    const { disponible, ingresos, gastos, vencimientos } = estadoFinanciero;
    contenedor.innerHTML = `
        <div class="view-section">
            <div class="balance-card">
                <span class="balance-title">DISPONIBLE EN MI$ LUCA$</span>
                <div class="balance-circle">
                    <div class="balance-circle-inner">
                        <span class="balance-amount">$${disponible.toLocaleString()}</span>
                        <span class="balance-status">Balance Sano</span>
                    </div>
                </div>
                <div class="balance-footer">
                    <div class="stat-group">
                        <span>Ingresos Mes</span>
                        <strong class="stat-income">+$${ingresos.toLocaleString()}</strong>
                    </div>
                    <div class="stat-group" style="text-align: right;">
                        <span>Gastos Mes</span>
                        <strong class="stat-expense">-$${gastos.toLocaleString()}</strong>
                    </div>
                </div>
            </div>

            <div class="grid-cards">
                <div class="mini-card">
                    <span class="mini-card-title">📉 Gasto Más Alto</span>
                    <span class="mini-card-amount">$450.000</span>
                    <span class="mini-card-sub">Mercado del Mes</span>
                </div>
                <div class="mini-card">
                    <span class="mini-card-title">⏱️ Último Gasto</span>
                    <span class="mini-card-amount">$450.000</span>
                    <span class="mini-card-sub">Mercado del Mes</span>
                </div>
            </div>

            <h4 style="font-size: 0.9rem; color: #94a3b8; margin-top: 0.5rem;">PRÓXIMO VENCIMIENTO</h4>
            <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                ${vencimientos.map(v => `
                    <div class="vencimiento-card" style="${v.pagado ? 'opacity: 0.5;' : ''} ${v.tipo === 'danger' && !v.pagado ? 'border-color: rgba(244, 63, 94, 0.3);' : ''}">
                        <div class="vencimiento-info">
                            <div class="vencimiento-icon ${v.tipo === 'danger' ? 'danger' : ''}">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            </div>
                            <div class="vencimiento-text">
                                <h5>${v.titulo}</h5>
                                <p class="${v.tipo === 'danger' ? 'danger-text' : ''}">${v.pagado ? '✅ PAGADO' : (v.tipo === 'danger' ? '⚠️ PAGO VENCIDO' : 'Vence: ' + v.fecha)}</p>
                            </div>
                        </div>
                        <button class="btn-pagar btn-accion-pago" data-id="${v.id}" style="${v.pagado ? 'background-color: #334155; color: #94a3b8; cursor: not-allowed;' : (v.tipo === 'danger' ? 'background-color: #f43f5e; color: #fff;' : '')}">
                            ${v.pagado ? 'Pagado' : 'Pagar'}
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.querySelectorAll('.btn-accion-pago').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            const item = estadoFinanciero.vencimientos.find(v => v.id === id);
            if (item && !item.pagado) {
                item.pagado = true;
                guardarEstado();
                renderInicio(contenedor);
            }
        });
    });
}

function renderCalendario(contenedor) {
    const { eventosCalendario } = estadoFinanciero;
    contenedor.innerHTML = `
        <div class="view-section">
            <h3 style="color: #f8fafc; font-size: 1.2rem;">Calendario Financiero - WassWallet</h3>
            <div class="form-box">
                <input type="date" id="cal-fecha">
                <input type="text" id="cal-titulo" placeholder="Título del evento">
                <button id="btn-add-evento">Guardar Evento</button>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                ${eventosCalendario.map(ev => `
                    <div style="background-color: #1e293b; padding: 1rem; border-radius: 12px; border: 1px solid #334155; display: flex; justify-content: space-between;">
                        <span style="color: #f8fafc;">${ev.titulo}</span>
                        <strong style="color: #10b981;">${ev.fecha}</strong>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.getElementById('btn-add-evento').addEventListener('click', () => {
        const fecha = document.getElementById('cal-fecha').value;
        const titulo = document.getElementById('cal-titulo').value;
        if (!fecha || !titulo) return;
        estadoFinanciero.eventosCalendario.push({ id: Date.now(), fecha, titulo });
        guardarEstado();
        renderCalendario(contenedor);
    });
}

function renderPresupuesto(contenedor) {
    const { presupuestos } = estadoFinanciero;
    contenedor.innerHTML = `
        <div class="view-section">
            <h3 style="color: #f8fafc; font-size: 1.2rem;">Gestión de Presupuesto - WassWallet</h3>
            <div class="form-box">
                <input type="text" id="pres-cat" placeholder="Categoría">
                <input type="number" id="pres-limite" placeholder="Límite Máximo ($)">
                <button id="btn-add-pres">Crear Presupuesto</button>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                ${presupuestos.map(p => `
                    <div style="background-color: #1e293b; padding: 1rem; border-radius: 12px; border: 1px solid #334155; display: flex; justify-content: space-between;">
                        <span style="color: #f8fafc;">${p.categoria}</span>
                        <strong style="color: #10b981;">$${p.limite.toLocaleString()}</strong>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.getElementById('btn-add-pres').addEventListener('click', () => {
        const categoria = document.getElementById('pres-cat').value;
        const limite = parseFloat(document.getElementById('pres-limite').value);
        if (!categoria || isNaN(limite)) return;
        estadoFinanciero.presupuestos.push({ id: Date.now(), categoria, limite });
        guardarEstado();
        renderPresupuesto(contenedor);
    });
}

function renderCuentas(contenedor) {
    const { cuentas } = estadoFinanciero;
    contenedor.innerHTML = `
        <div class="view-section">
            <h3 style="color: #f8fafc; font-size: 1.2rem;">Cuentas y Billeteras - WassWallet</h3>
            <div class="form-box">
                <input type="text" id="cta-nombre" placeholder="Nombre de cuenta">
                <input type="number" id="cta-saldo" placeholder="Saldo Inicial ($)">
                <button id="btn-add-cta">Registrar Cuenta</button>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                ${cuentas.map(c => `
                    <div style="background-color: #1e293b; padding: 1rem; border-radius: 12px; border: 1px solid #334155; display: flex; justify-content: space-between;">
                        <span style="color: #f8fafc;">${c.nombre}</span>
                        <strong style="color: #10b981;">$${c.saldo.toLocaleString()}</strong>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.getElementById('btn-add-cta').addEventListener('click', () => {
        const nombre = document.getElementById('cta-nombre').value;
        const saldo = parseFloat(document.getElementById('cta-saldo').value);
        if (!nombre || isNaN(saldo)) return;
        estadoFinanciero.cuentas.push({ id: Date.now(), nombre, saldo });
        guardarEstado();
        renderCuentas(contenedor);
    });
}

function renderDeudas(contenedor) {
    const { deudasLista } = estadoFinanciero;
    contenedor.innerHTML = `
        <div class="view-section">
            <h3 style="color: #f8fafc; font-size: 1.2rem;">Control de Deudas - WassWallet</h3>
            <div class="form-box" style="border-color: rgba(244, 63, 94, 0.3);">
                <input type="text" id="deuda-acreedor" placeholder="Acreedor">
                <input type="number" id="deuda-monto" placeholder="Monto adeudado ($)">
                <button id="btn-add-deuda" style="background-color: #f43f5e; color: #fff;">Guardar Deuda</button>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                ${deudasLista.map(d => `
                    <div style="background-color: #1e293b; padding: 1rem; border-radius: 12px; border: 1px solid rgba(244, 63, 94, 0.3); display: flex; justify-content: space-between;">
                        <span style="color: #f8fafc;">${d.acreedor}</span>
                        <strong style="color: #f43f5e;">$${d.monto.toLocaleString()}</strong>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.getElementById('btn-add-deuda').addEventListener('click', () => {
        const acreedor = document.getElementById('deuda-acreedor').value;
        const monto = parseFloat(document.getElementById('deuda-monto').value);
        if (!acreedor || isNaN(monto)) return;
        estadoFinanciero.deudasLista.push({ id: Date.now(), acreedor, monto });
        guardarEstado();
        renderDeudas(contenedor);
    });
}

const vistas = {
    inicio: (cont) => renderInicio(cont),
    calendario: (cont) => renderCalendario(cont),
    presupuesto: (cont) => renderPresupuesto(cont),
    cuentas: (cont) => renderCuentas(cont),
    deudas: (cont) => renderDeudas(cont)
};

function cambiarVista(nombreVista) {
    const contenedor = document.getElementById('app-view');
    if (!contenedor) return;
    contenedor.innerHTML = '';
    if (vistas[nombreVista]) vistas[nombreVista](contenedor);

    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.dataset.view === nombreVista) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    cambiarVista('inicio');
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            cambiarVista(e.currentTarget.dataset.view);
        });
    });
});