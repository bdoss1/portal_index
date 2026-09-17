import { useMemo, useState } from 'react'
import './App.css'

const destinations = [
  { id: 1, name: 'Command center', description: 'Live operational overview and incident pulse.', category: 'Operations', status: 'Live', color: 'coral', glyph: '⌁', updated: '2 min ago', favorite: true },
  { id: 2, name: 'Atlas workspace', description: 'Shared docs, plans, and working notes.', category: 'Workspaces', status: 'Active', color: 'mint', glyph: '▦', updated: '18 min ago', favorite: true },
  { id: 3, name: 'Signal room', description: 'Research briefs and customer intelligence.', category: 'Research', status: 'New', color: 'blue', glyph: '◌', updated: '41 min ago', favorite: false },
  { id: 4, name: 'Launch board', description: 'Milestones, owners, and release readiness.', category: 'Projects', status: 'Active', color: 'yellow', glyph: '↗', updated: '1 hr ago', favorite: false },
  { id: 5, name: 'People directory', description: 'Find the right person, team, or expertise.', category: 'People', status: 'Active', color: 'violet', glyph: '✦', updated: 'Yesterday', favorite: false },
  { id: 6, name: 'Archive index', description: 'A quiet record of decisions and artifacts.', category: 'Reference', status: 'Read only', color: 'slate', glyph: '≡', updated: '3 days ago', favorite: false },
]

const categories = ['All spaces', 'Favorites', 'Operations', 'Workspaces', 'Research', 'Projects']

function App() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All spaces')
  const [favorites, setFavorites] = useState(destinations.filter((item) => item.favorite).map((item) => item.id))
  const [view, setView] = useState('grid')

  const filteredDestinations = useMemo(() => destinations.filter((destination) => {
    const matchesQuery = `${destination.name} ${destination.description} ${destination.category}`.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = activeCategory === 'All spaces'
      || (activeCategory === 'Favorites' ? favorites.includes(destination.id) : destination.category === activeCategory)
    return matchesQuery && matchesCategory
  }), [activeCategory, favorites, query])

  const toggleFavorite = (id) => {
    setFavorites((current) => current.includes(id) ? current.filter((favoriteId) => favoriteId !== id) : [...current, id])
  }

  return (
    <main className="portal-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">+</span><span>portal<span className="brand-dot">.</span></span></div>
        <div className="workspace-switcher"><span className="workspace-avatar">R</span><span><b>Ricky Morty</b><small>Personal index</small></span><span className="chevron">⌄</span></div>
        <nav className="primary-nav" aria-label="Primary navigation">
          <button className="nav-item active"><span>⌂</span> Overview</button>
          <button className="nav-item"><span>◫</span> All spaces <em>{destinations.length}</em></button>
          <button className="nav-item"><span>☆</span> Favorites <em>{favorites.length}</em></button>
        </nav>
        <div className="nav-label">COLLECTIONS</div>
        <nav className="collection-nav" aria-label="Collections">
          <button><i className="dot coral" />Quick access</button>
          <button><i className="dot mint" />Team spaces</button>
          <button><i className="dot yellow" />Reference</button>
        </nav>
        <div className="sidebar-footer"><button className="nav-item"><span>⚙</span> Settings</button><div className="help-card"><span>?</span><div><b>Need a hand?</b><small>Visit the help center</small></div><span>↗</span></div></div>
      </aside>

      <section className="content">
        <header className="topbar"><div className="breadcrumb"><span>Workspace</span><b>/</b><strong>Overview</strong></div><div className="top-actions"><button className="icon-button" aria-label="Notifications">♧<span className="notification-dot" /></button><button className="avatar-button" aria-label="Open profile">RM</button></div></header>
        <div className="content-inner">
          <div className="welcome-row"><div><p className="eyebrow">THURSDAY, SEPTEMBER 17, 2026</p><h1>Good morning, <span>Ricky.</span></h1><p className="intro">Your work, neatly gathered in one place.</p></div><button className="add-button"><span>+</span> Add space</button></div>
          <section className="status-strip"><div className="status-copy"><span className="pulse" /><div><b>All systems nominal</b><p>Everything is running smoothly</p></div></div><div className="status-divider" /><div className="status-metric"><span>6</span><p>active spaces</p></div><div className="status-divider" /><div className="status-metric"><span>12</span><p>updates this week</p></div><div className="status-time">Updated just now</div></section>

          <div className="section-heading"><div><h2>Your spaces</h2><p>Jump back into something familiar or explore a new corner.</p></div><div className="view-toggle"><button className={view === 'grid' ? 'selected' : ''} onClick={() => setView('grid')} aria-label="Grid view">⊞</button><button className={view === 'list' ? 'selected' : ''} onClick={() => setView('list')} aria-label="List view">☷</button></div></div>
          <div className="toolbar"><div className="search-wrap"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search spaces..." aria-label="Search spaces" /><kbd>⌘ K</kbd></div><div className="filters">{categories.map((category) => <button key={category} className={activeCategory === category ? 'filter active' : 'filter'} onClick={() => setActiveCategory(category)}>{category}</button>)}</div></div>

          <div className={view === 'grid' ? 'space-grid' : 'space-list'}>{filteredDestinations.map((destination) => <article className="space-card" key={destination.id}><div className={`space-icon ${destination.color}`}>{destination.glyph}</div><div className="space-main"><div className="card-title"><h3>{destination.name}</h3><button className={favorites.includes(destination.id) ? 'star starred' : 'star'} onClick={() => toggleFavorite(destination.id)} aria-label={`${favorites.includes(destination.id) ? 'Remove' : 'Add'} ${destination.name} favorite`}>★</button></div><p>{destination.description}</p><div className="card-meta"><span className="category-tag">{destination.category}</span><span className="status-tag"><i />{destination.status}</span><time>{destination.updated}</time></div></div><button className="open-arrow" aria-label={`Open ${destination.name}`}>↗</button></article>)}</div>
          {filteredDestinations.length === 0 && <div className="empty-state"><span>⌕</span><h3>No spaces found</h3><p>Try another search or choose a different collection.</p></div>}
          <footer className="content-footer"><span>Portal index <b>·</b> v1.4.0</span><span>Last synced 09:42:18 <i className="sync-dot" /></span></footer>
        </div>
      </section>
    </main>
  )
}

export default App
