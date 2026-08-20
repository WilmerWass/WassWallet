# WassWallet — Definición del proyecto

> Documento base para tomar decisiones de producto y desarrollo. Refleja el estado del repositorio a 7 de agosto de 2026 y propone una dirección concreta para su evolución.

## 1. Propósito

**WassWallet** es una aplicación web de finanzas personales para que una persona lleve un control simple, visual y confiable de su dinero: cuánto tiene disponible, en qué lo gasta, qué debe pagar y cómo se comporta frente a sus presupuestos.

La propuesta prioriza una experiencia rápida para el contexto colombiano: montos en pesos colombianos (COP), cuentas como Nequi, Bancolombia y efectivo, y registro de movimientos en pocos pasos.

## 2. Problema que resuelve

Las personas suelen repartir su dinero entre efectivo, billeteras digitales, bancos, tarjetas y deudas. Sin una fuente única de verdad, es difícil responder preguntas cotidianas:

- ¿Cuánto puedo gastar hoy?
- ¿En qué se fue mi dinero este mes?
- ¿Qué pagos están próximos o vencidos?
- ¿Qué presupuesto ya está en riesgo?
- ¿Cuál es mi deuda real?

WassWallet reúne esa información y la presenta de forma clara, sin depender inicialmente de integraciones bancarias.

## 3. Usuario objetivo

Persona que administra sus finanzas personales desde el celular y necesita una herramienta sencilla para registrar y consultar sus movimientos. No se requiere conocimiento contable.

Necesidades principales:

- Registrar ingresos, gastos y transferencias con rapidez.
- Separar el dinero por cuenta o bolsillo.
- Ver saldos, deuda y pagos pendientes antes de tomar decisiones.
- Definir límites de gasto por categoría.
- Mantener sus datos privados en el dispositivo mientras la aplicación no tenga autenticación ni sincronización.

## 4. Objetivos del producto

### Objetivo principal

Ofrecer una lectura confiable del dinero disponible y de los compromisos financieros de la persona usuaria.

### Objetivos específicos

- Centralizar cuentas, movimientos, presupuestos, deudas y vencimientos.
- Reducir el tiempo de registro de un movimiento a menos de un minuto.
- Mostrar indicadores mensuales comprensibles.
- Funcionar correctamente en pantallas móviles y de escritorio.
- Conservar la información local entre sesiones.

### Fuera de alcance por ahora

- Conexión automática con entidades financieras.
- Transferencias reales de dinero.
- Asesoría financiera o tributaria.
- Multiusuario, sincronización en nube y recuperación de cuenta.
- Sustituir un sistema contable profesional.

## 5. Alcance funcional

| Área | Comportamiento esperado |
| --- | --- |
| Inicio | Resumen del disponible, ingresos, gastos, próximos pagos y alertas. |
| Movimientos | Crear, consultar, editar y eliminar ingresos, gastos y transferencias; cada uno afecta una o dos cuentas según corresponda. |
| Cuentas | Crear y administrar efectivo, ahorro, corrientes, billeteras y tarjetas de crédito. |
| Presupuestos | Definir un límite por categoría y período; comparar límite, gasto acumulado y saldo restante. |
| Deudas | Registrar deudas, acreedor, monto, fecha de pago y estado. |
| Calendario | Visualizar movimientos y vencimientos por fecha; crear y gestionar eventos. |
| Persistencia | Guardar el estado localmente y permitir, en una etapa posterior, exportar e importar respaldos. |

## 6. Reglas de negocio esenciales

- La moneda por defecto es COP; los valores se almacenan como números enteros, sin decimales.
- Un **ingreso** incrementa el saldo de la cuenta seleccionada.
- Un **gasto** disminuye el saldo de la cuenta seleccionada y se clasifica por categoría.
- Una **transferencia** disminuye una cuenta origen e incrementa una cuenta destino por el mismo monto.
- Una tarjeta de crédito no se suma al dinero disponible; registra cupo, deuda y cupo restante.
- El disponible es la suma de cuentas marcadas como incluidas en disponible. La opción de restar deudas debe ser explícita y visible.
- Un pago de deuda o vencimiento debe generar un movimiento asociado, en vez de cambiar únicamente su etiqueta visual.
- Un presupuesto compara exclusivamente gastos de su categoría y período.
- No se aceptan montos nulos, negativos ni fechas inválidas.

## 7. Arquitectura objetivo

La primera versión se mantiene como una SPA estática, sin backend:

```text
index.html
  └─ js/app.js                 Orquestación de navegación, estado y renderizado
       ├─ módulos de vista      Inicio, calendario, presupuestos, cuentas y deudas
       ├─ capa de dominio       Cálculos, validaciones y operaciones financieras
       └─ repositorio local     localStorage, versionado y migración de datos
  └─ css/styles.css             Diseño responsivo y sistema visual
```

Principios técnicos:

- Una sola fuente de verdad para el estado financiero.
- Separar la lógica financiera del HTML de las vistas.
- Usar módulos ES de forma consistente o, mientras se mantenga un solo script, no conservar módulos sin uso.
- Renderizar contenido dinámico de forma segura; no interpolar texto de usuario sin escaparlo.
- Versionar el esquema almacenado para poder migrarlo sin perder información.

## 8. Modelo de datos propuesto

```js
{
  version: 1,
  settings: { currency: 'COP', subtractDebtsFromAvailable: false },
  accounts: [{ id, name, entity, type, balance, creditLimit, debt, inAvailable }],
  transactions: [{ id, type, amount, accountId, destinationAccountId, category, note, date }],
  budgets: [{ id, category, limit, period: 'YYYY-MM' }],
  debts: [{ id, creditor, amount, dueDate, status, accountId }],
  dueDates: [{ id, title, amount, dueDate, status, accountId }],
  calendarEvents: [{ id, title, date, relatedType, relatedId }]
}
```

`type` de cuenta: `CASH`, `SAVINGS`, `CHECKING`, `WALLET` o `CREDIT`.

`type` de transacción: `INCOME`, `EXPENSE`, `TRANSFER`, `DEBT_PAYMENT` o `CREDIT_PAYMENT`.

## 9. Estado actual del repositorio

La aplicación actual es una interfaz estática en español, con navegación entre Inicio, Calendario, Presupuesto, Cuentas y Deudas. El punto de entrada carga `js/app.js`, que persiste un objeto `wass_wallet_state` en `localStorage` y permite crear eventos, presupuestos, cuentas y deudas, además de marcar vencimientos como pagados.

También existen archivos en `js/modulos/` que exportan otras vistas y un estado diferente. Actualmente no son cargados por `index.html`; contienen un modelo más cercano a cuentas y transacciones, pero no están integrados. Esto debe resolverse antes de seguir añadiendo funcionalidades para evitar dos fuentes de verdad.

Hallazgos a atender:

- Los saldos, ingresos y gastos iniciales son valores semilla y no se recalculan desde transacciones.
- No hay registro integral de transacciones ni transferencias en la aplicación que se ejecuta.
- Marcar un vencimiento como pagado no actualiza saldos ni crea un movimiento.
- Se mezclan estructuras de datos y estrategias de almacenamiento (`localStorage` y `sessionStorage`).
- El texto del repositorio presenta problemas de codificación en algunos archivos, que deben normalizarse a UTF-8.
- El README nombra backend, base de datos y despliegue como ejemplos, no como componentes implementados.

## 10. Enfoque de implementación

La evolución se hará en etapas pequeñas, manteniendo siempre una aplicación utilizable:

1. **Fundación:** consolidar un único modelo de estado, normalizar codificación, decidir el punto de entrada y retirar o integrar código duplicado.
2. **Libro de movimientos:** implementar el CRUD de transacciones y los cálculos derivados de saldos, ingresos, gastos y disponible.
3. **Planificación:** conectar presupuestos, deudas, vencimientos y calendario con los movimientos reales.
4. **Confiabilidad:** validaciones, estados vacíos, confirmaciones, accesibilidad, pruebas manuales y respaldo/importación local.
5. **Evolución:** PWA real, autenticación y sincronización solo si existe una necesidad validada; requerirán backend y una política de privacidad.

## 11. Criterios de aceptación de la primera versión sólida

- La recarga del navegador conserva los datos creados por la persona usuaria.
- Todo movimiento modifica correctamente los saldos e indicadores relacionados.
- Una transferencia conserva el total global entre cuentas.
- Los totales del inicio coinciden con el historial filtrado del mes.
- Los presupuestos muestran gasto, límite y diferencia de la categoría correspondiente.
- Pagar una deuda o vencimiento queda registrado como movimiento y actualiza su estado.
- La interfaz funciona desde 320 px de ancho y es navegable con teclado.
- No hay datos de ejemplo mezclados con datos reales una vez iniciada la aplicación.

## 12. Calidad, privacidad y seguridad

Mientras se use almacenamiento local, los datos quedan en el navegador y dispositivo de la persona usuaria. La aplicación debe indicarlo claramente y ofrecer exportación de respaldo antes de migraciones relevantes. No se deben solicitar ni almacenar credenciales bancarias.

Se priorizarán validaciones de entrada, escape de contenido dinámico, manejo de errores de almacenamiento, diseño accesible (contraste, etiquetas y foco) y pruebas de los cálculos financieros antes de cada publicación.

## 13. Decisiones pendientes

- Definir si el nombre de producto conservará la escritura estilizada de “MI$ LUCA$” usada en la interfaz o si se unificará como WassWallet.
- Definir las categorías iniciales y si cada persona puede administrarlas.
- Decidir si las deudas se modelarán únicamente como cuentas de crédito o también como entidades independientes.
- Acordar la política de reinicio de datos de demostración y de exportación/importación.
- Definir el mecanismo de despliegue de la versión estática cuando el producto esté listo.

## 14. Métrica de éxito inicial

La primera señal de éxito es que una persona pueda registrar durante un mes sus ingresos, gastos y pagos, y que al abrir Inicio encuentre un disponible y unos compromisos que reconozca como correctos.
