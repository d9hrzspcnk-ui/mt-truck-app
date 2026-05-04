import React, { useMemo, useState } from 'react';

const navItems = [
  'Dashboard',
  'Customers',
  'Vehicles',
  'Work Orders',
  'Invoices',
  'Inventory',
  'Reports',
  'Settings',
];

const dashboardStats = [
  { title: 'Open Work Orders', value: '27', accent: 'blue' },
  { title: 'Unpaid Invoices', value: '14', accent: 'amber' },
  { title: 'Vehicles Due for Service', value: '18', accent: 'violet' },
  { title: 'Monthly Revenue', value: '$142,500', accent: 'green' },
  { title: 'Monthly Expenses', value: '$96,200', accent: 'rose' },
];

function App() {
  const [selected, setSelected] = useState('Dashboard');

  const headerCopy = useMemo(() => {
    if (selected === 'Dashboard') return 'Shop Performance Overview';
    return `${selected} (Coming Soon)`;
  }, [selected]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <h1>MT Truck</h1>
          <p>Trailer Repair</p>
        </div>
        <nav>
          {navItems.map((item) => (
            <button
              key={item}
              className={`nav-item ${selected === item ? 'active' : ''}`}
              onClick={() => setSelected(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="content">
        <header className="content-header">
          <h2>{selected}</h2>
          <p>{headerCopy}</p>
        </header>

        {selected === 'Dashboard' ? (
          <section className="metrics-grid">
            {dashboardStats.map((stat) => (
              <article key={stat.title} className={`metric-card ${stat.accent}`}>
                <span>{stat.title}</span>
                <strong>{stat.value}</strong>
              </article>
            ))}
          </section>
        ) : (
          <section className="placeholder">
            <p>This section is ready for your data and workflows.</p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
