export const state = {
  subtractDebtsFromAvailable: false,
  activeTab: 'home',

  accounts: [
    { id: 'acc-1', entity: 'Nequi', name: 'Cuenta Principal', type: 'SAVINGS', balance: 1250000, inAvailable: true },
    { id: 'acc-2', entity: 'Efectivo', name: 'Bolsillo Billetes', type: 'CASH', balance: 400000, inAvailable: true },
    { id: 'acc-3', entity: 'Banco Nu', name: 'Ahorros Rendimiento', type: 'SAVINGS', balance: 1800000, inAvailable: false },
    { id: 'acc-4', entity: 'Bancolombia', name: 'Tarjeta Crédito Amex', type: 'CREDIT', limit: 3000000, debt: 1200000 }
  ],

  transactions: [
    { id: 'tx-1', type: 'INCOME', amount: 3500000, account: 'Nequi', category: 'Salario', note: 'Pago Quincena', date: '2026-07-28' },
    { id: 'tx-2', type: 'EXPENSE', amount: 450000, account: 'Nequi', category: 'Mercado', note: 'Mercado del Mes', date: '2026-07-29' },
    { id: 'tx-3', type: 'EXPENSE', amount: 120000, account: 'Efectivo', category: 'Restaurante', note: 'Almuerzo familiar', date: '2026-07-30' }
  ]
};

export function getTotals() {
  const totalAvailableAccounts = state.accounts
    .filter(a => a.type !== 'CREDIT' && a.inAvailable)
    .reduce((acc, a) => acc + a.balance, 0);

  const totalDebts = state.accounts
    .filter(a => a.type === 'CREDIT')
    .reduce((acc, a) => acc + (a.debt || 0), 0);

  const totalIncomes = state.transactions
    .filter(t => t.type === 'INCOME')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = state.transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0);

  const finalAvailableToSpend = state.subtractDebtsFromAvailable
    ? Math.max(0, totalAvailableAccounts - totalDebts)
    : totalAvailableAccounts;

  return {
    totalAvailableAccounts,
    totalDebts,
    totalIncomes,
    totalExpenses,
    finalAvailableToSpend
  };
}

export function formatMoney(val) {
  return new Intl.NumberFormat('es-CO').format(val || 0);
}

export function addTransaction(amount, category, note) {
  state.transactions.unshift({
    id: 'tx-' + Date.now(),
    type: 'EXPENSE',
    amount: parseFloat(amount),
    account: 'Nequi',
    category: category,
    note: note || 'Gasto registrado',
    date: new Date().toISOString().split('T')[0]
  });
}