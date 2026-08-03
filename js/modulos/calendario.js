export function renderCalendario(contenedor) {
    let estadoFinanciero = JSON.parse(localStorage.getItem('wass_wallet_state')) || {};
    const movimientos = estadoFinanciero.movimientos || [];

    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = hoy.getMonth();

    const nombresMes = [
        "Enero", "Febrero", "Marzo",
        "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre",
        "Octubre", "Noviembre", "Diciembre"
    ];

    const primerDia = new Date(año, mes, 1).getDay();
    const diasMes = new Date(año, mes + 1, 0).getDate();

    let diasHTML = "";

    for (let i = 0; i < primerDia; i++) {
        diasHTML += `<div class="calendar-day empty"></div>`;
    }

    for (let dia = 1; dia <= diasMes; dia++) {
        const fecha = `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        const tieneMovimiento = movimientos.some(m => m.fecha === fecha);

        diasHTML += `
        <div class="calendar-day ${tieneMovimiento ? 'has-event' : ''} ${dia === hoy.getDate() ? 'today' : ''}">
            ${dia}
        </div>
        `;
    }

    contenedor.innerHTML = `
        <div class="view-section">
            <div class="calendar-card">
                <div class="calendar-header">
                    <h2>${nombresMes[mes]} ${año}</h2>
                    <div>
                        <button class="calendar-btn">‹</button>
                        <button class="calendar-btn">›</button>
                    </div>
                </div>
                <div class="calendar-week">
                    <span>D</span>
                    <span>L</span>
                    <span>M</span>
                    <span>M</span>
                    <span>J</span>
                    <span>V</span>
                    <span>S</span>
                </div>
                <div class="calendar-grid">
                    ${diasHTML}
                </div>
            </div>
            <div class="transactions-card">
                <div class="transactions-title">
                    <h3>Historial de Transacciones</h3>
                    <span>Filtrado: Mes actual</span>
                </div>
                ${movimientos.map(m => `
                <div class="transaction-item">
                    <div class="transaction-icon ${m.tipo}">
                        ${m.tipo === "ingreso" ? "↑" : "↓"}
                    </div>
                    <div class="transaction-info">
                        <strong>${m.titulo}</strong>
                        <small>${m.categoria} • ${m.cuenta}</small>
                    </div>
                    <div class="transaction-value ${m.tipo}">
                        ${m.tipo === "ingreso" ? "+" : "-"}$${m.monto.toLocaleString()}
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
        <button class="floating-add">+</button>
    `;
}
```[cite: 2]