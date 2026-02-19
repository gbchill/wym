import NavLink from './NavLink';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-56 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="px-5 py-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white tracking-tight">
            <span className="text-indigo-400">WYM</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Where's Your Money?</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink to="/dashboard" icon="📊">Dashboard</NavLink>
          <NavLink to="/transactions" icon="📋">Transactions</NavLink>
          <NavLink to="/budget" icon="💰">Budget</NavLink>
          <NavLink to="/upload" icon="📤">Upload CSV</NavLink>
        </nav>

        <div className="px-5 py-4 border-t border-slate-800">
          <p className="text-xs text-slate-600">Personal Finance Analyzer</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-56 p-8">
        {children}
      </main>
    </div>
  );
}
