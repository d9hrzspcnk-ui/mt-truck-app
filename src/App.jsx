import React, { useMemo, useState } from 'react';

const navItems = [
  'Dashboard',
  'Customers',
  'Companies',
  'Vehicles',
  'Work Orders',
  'Invoices',
  'Parts Inventory',
  'Maintenance',
  'Shop Calculator',
];

const customers = [
  { id: 'C-1001', name: 'John Miller', phone: '(406) 555-0192', company: 'Big Sky Freight' },
  { id: 'C-1002', name: 'Sara James', phone: '(406) 555-0158', company: 'North Ridge Logistics' },
  { id: 'C-1003', name: 'Evan Brooks', phone: '(406) 555-0100', company: 'Independent Owner/Operator' },
];

const companies = [
  { id: 'CO-21', name: 'Big Sky Freight', fleetSize: 14, contact: 'Operations Manager' },
  { id: 'CO-44', name: 'North Ridge Logistics', fleetSize: 9, contact: 'Shop Coordinator' },
  { id: 'CO-77', name: 'Summit Hauling', fleetSize: 21, contact: 'Fleet Director' },
];

const vehicles = [
  { vin: '1XKYDP9X8KJ251201', unit: 'BSF-102', plate: 'MT 7D-4412', mileage: 412340, customer: 'John Miller', truck: 'Kenworth T680' },
  { vin: '1FUJA6CV87LX91922', unit: 'NRL-208', plate: 'MT 1C-9040', mileage: 301194, customer: 'Sara James', truck: 'Freightliner Cascadia' },
  { vin: '3AKJHHDR5LSKT8831', unit: 'SUM-055', plate: 'MT 3A-7731', mileage: 512774, customer: 'Evan Brooks', truck: 'Western Star 49X' },
];

const workOrdersSeed = [
  {
    id: 'WO-9052',
    customer: 'John Miller',
    company: 'Big Sky Freight',
    unit: 'BSF-102',
    vin: '1XKYDP9X8KJ251201',
    status: 'In Progress',
    concern: 'Air leak + brake warning light',
    checklist: [
      { task: 'Road test + verify concern', done: true },
      { task: 'Inspect brake chambers and lines', done: true },
      { task: 'Replace damaged air line', done: false },
      { task: 'Final brake system test', done: false },
    ],
    photos: [],
  },
  {
    id: 'WO-9053',
    customer: 'Sara James',
    company: 'North Ridge Logistics',
    unit: 'NRL-208',
    vin: '1FUJA6CV87LX91922',
    status: 'Waiting Parts',
    concern: 'DPF regen failure and low power',
    checklist: [
      { task: 'Scan ECM for fault codes', done: true },
      { task: 'Inspect DPF differential pressure sensor', done: true },
      { task: 'Install new pressure sensor', done: false },
    ],
    photos: [],
  },
];

const invoices = [
  { id: 'INV-3201', workOrder: 'WO-9050', customer: 'Big Sky Freight', amount: 2840, status: 'Unpaid' },
  { id: 'INV-3202', workOrder: 'WO-9051', customer: 'Summit Hauling', amount: 1185, status: 'Paid' },
  { id: 'INV-3203', workOrder: 'WO-9052', customer: 'Big Sky Freight', amount: 450, status: 'Draft' },
];

const inventory = [
  { part: 'Air Brake Line 3/8"', sku: 'AB-38-100', qty: 24, reorderAt: 10 },
  { part: 'DEF Pump Assembly', sku: 'DP-9982', qty: 3, reorderAt: 2 },
  { part: 'Wheel Seal Kit', sku: 'WS-2201', qty: 9, reorderAt: 6 },
];

const reminders = [
  { unit: 'BSF-102', task: 'PM Service B', dueMileage: 420000, currentMileage: 412340 },
  { unit: 'SUM-055', task: 'Transmission service', dueMileage: 515000, currentMileage: 512774 },
];

function Stat({ label, value }) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function App() {
  const [selected, setSelected] = useState('Dashboard');
  const [search, setSearch] = useState('');
  const [workOrders, setWorkOrders] = useState(workOrdersSeed);
  const [shopCosts, setShopCosts] = useState({
    monthlyExpenses: 96200,
    targetProfit: 20,
    billableHours: 1450,
  });

  const searchableRows = useMemo(
    () =>
      workOrders.map((wo) => ({
        ...wo,
        haystack: `${wo.customer} ${wo.company} ${wo.vin} ${wo.unit}`.toLowerCase(),
      })),
    [workOrders],
  );

  const filteredWorkOrders = useMemo(() => {
    if (!search.trim()) return searchableRows;
    return searchableRows.filter((row) => row.haystack.includes(search.toLowerCase()));
  }, [search, searchableRows]);

  const toggleChecklist = (woId, idx) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id !== woId) return wo;
        return {
          ...wo,
          checklist: wo.checklist.map((item, itemIdx) =>
            itemIdx === idx ? { ...item, done: !item.done } : item,
          ),
        };
      }),
    );
  };

  const addPhotos = (woId, files) => {
    const imageUrls = Array.from(files || []).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setWorkOrders((prev) =>
      prev.map((wo) => (wo.id === woId ? { ...wo, photos: [...wo.photos, ...imageUrls] } : wo)),
    );
  };

  const suggestedRate = useMemo(() => {
    const expenses = Number(shopCosts.monthlyExpenses);
    const margin = Number(shopCosts.targetProfit) / 100;
    const hours = Number(shopCosts.billableHours) || 1;
    return ((expenses * (1 + margin)) / hours).toFixed(2);
  }, [shopCosts]);

  const renderContent = () => {
    switch (selected) {
      case 'Dashboard':
        return (
          <section className="grid cols-4">
            <Stat label="Open Work Orders" value={filteredWorkOrders.length} />
            <Stat label="Unpaid Invoices" value={invoices.filter((i) => i.status === 'Unpaid').length} />
            <Stat label="Low Stock Parts" value={inventory.filter((p) => p.qty <= p.reorderAt).length} />
            <Stat label="Maintenance Due Soon" value={reminders.length} />
          </section>
        );
      case 'Customers':
        return <SimpleTable headers={['ID', 'Name', 'Phone', 'Company']} rows={customers.map((x) => [x.id, x.name, x.phone, x.company])} />;
      case 'Companies':
        return <SimpleTable headers={['ID', 'Company', 'Fleet Size', 'Primary Contact']} rows={companies.map((x) => [x.id, x.name, x.fleetSize, x.contact])} />;
      case 'Vehicles':
        return <SimpleTable headers={['VIN', 'Unit', 'License Plate', 'Mileage', 'Customer', 'Truck']} rows={vehicles.map((x) => [x.vin, x.unit, x.plate, x.mileage.toLocaleString(), x.customer, x.truck])} />;
      case 'Work Orders':
        return (
          <section className="stack">
            {filteredWorkOrders.map((wo) => (
              <article key={wo.id} className="card">
                <div className="card-header">
                  <div>
                    <h3>{wo.id} • {wo.unit}</h3>
                    <p>{wo.customer} • {wo.company} • VIN {wo.vin}</p>
                    <p><strong>Concern:</strong> {wo.concern}</p>
                  </div>
                  <span className="status">{wo.status}</span>
                </div>

                <h4>Mechanic Checklist</h4>
                {wo.checklist.map((item, idx) => (
                  <label key={item.task} className="check-item">
                    <input type="checkbox" checked={item.done} onChange={() => toggleChecklist(wo.id, idx)} />
                    {item.task}
                  </label>
                ))}

                <div className="upload-row">
                  <label className="upload-btn">
                    Upload Work Order Pictures
                    <input type="file" accept="image/*" multiple onChange={(e) => addPhotos(wo.id, e.target.files)} />
                  </label>
                  <div className="photo-strip">
                    {wo.photos.map((photo) => (
                      <img key={`${photo.name}-${photo.url}`} src={photo.url} alt={photo.name} />
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </section>
        );
      case 'Invoices':
        return <SimpleTable headers={['Invoice #', 'Work Order', 'Customer/Company', 'Amount', 'Status']} rows={invoices.map((x) => [x.id, x.workOrder, x.customer, `$${x.amount.toLocaleString()}`, x.status])} />;
      case 'Parts Inventory':
        return <SimpleTable headers={['Part', 'SKU', 'Qty', 'Reorder At']} rows={inventory.map((x) => [x.part, x.sku, x.qty, x.reorderAt])} />;
      case 'Maintenance':
        return <SimpleTable headers={['Unit', 'Service Task', 'Current Mileage', 'Due Mileage']} rows={reminders.map((x) => [x.unit, x.task, x.currentMileage.toLocaleString(), x.dueMileage.toLocaleString()])} />;
      case 'Shop Calculator':
        return (
          <section className="card calc-card">
            <h3>Basic Shop Expense Calculator</h3>
            <p>Use this to estimate a suggested hourly labor rate based on overhead and target margin.</p>
            <div className="grid cols-3">
              <InputMoney label="Monthly Shop Expenses ($)" value={shopCosts.monthlyExpenses} onChange={(value) => setShopCosts((prev) => ({ ...prev, monthlyExpenses: value }))} />
              <InputNumber label="Target Profit Margin (%)" value={shopCosts.targetProfit} onChange={(value) => setShopCosts((prev) => ({ ...prev, targetProfit: value }))} />
              <InputNumber label="Estimated Billable Hours / Month" value={shopCosts.billableHours} onChange={(value) => setShopCosts((prev) => ({ ...prev, billableHours: value }))} />
            </div>
            <div className="rate">Suggested labor rate: <strong>${suggestedRate}/hr</strong></div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <h1>MT Truck</h1>
          <p>& Trailer Repair</p>
        </div>
        <nav>
          {navItems.map((item) => (
            <button key={item} className={`nav-item ${selected === item ? 'active' : ''}`} onClick={() => setSelected(item)}>
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="content">
        <header className="content-header">
          <div>
            <h2>{selected}</h2>
            <p>Simple shop workflow for diesel truck and trailer repair.</p>
          </div>
          <input
            className="search"
            placeholder="Search customer, company, VIN, truck, unit number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </header>
        {renderContent()}
      </main>
    </div>
  );
}

function SimpleTable({ headers, rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={`${row[0]}-${idx}`}>{row.map((cell, cellIdx) => <td key={`${idx}-${cellIdx}`}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InputNumber({ label, value, onChange }) {
  return <label className="field">{label}<input type="number" value={value} onChange={(e) => onChange(e.target.value)} /></label>;
}

function InputMoney(props) {
  return <InputNumber {...props} />;
}

export default App;
