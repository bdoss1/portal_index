'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
const API = 'https://rickandmortyapi.com/api'
export default function Explorer({ kind }) {
  const [query, setQuery] = useState(''), [filter, setFilter] = useState(''), [page, setPage] = useState(1)
  const [data, setData] = useState(null), [loading, setLoading] = useState(true), [error, setError] = useState(''), [retry, setRetry] = useState(0)
  const episodes = kind === 'episode'
  useEffect(() => {
    const controller = new AbortController()
    // This effect synchronizes loading state with an abortable external API request.
    // oxlint-disable-next-line react/set-state-in-effect
    setLoading(true); setError('')
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ page: String(page), name: query.trim() })
        if (filter) params.set(episodes ? 'episode' : 'status', filter)
        const response = await fetch(`${API}/${kind}?${params}`, { signal: controller.signal })
        if (response.status === 404) { setData({ info: { count: 0, pages: 0 }, results: [] }); return }
        if (!response.ok) throw new Error('The portal connection was interrupted. Please try again.')
        setData(await response.json())
      } catch (e) { if (e.name !== 'AbortError') setError('The portal connection was interrupted. Please try again.') }
      finally { if (!controller.signal.aborted) setLoading(false) }
    }, 250)
    return () => { clearTimeout(timer); controller.abort() }
  }, [kind, query, filter, page, retry, episodes])
  const filters = episodes ? [['', 'All seasons'], ['S01', 'Season 1'], ['S02', 'Season 2'], ['S03', 'Season 3'], ['S04', 'Season 4'], ['S05', 'Season 5']] : [['', 'All characters'], ['alive', 'Alive'], ['dead', 'Dead'], ['unknown', 'Unknown']]
  return <section id="explore" className="explorer"><div className="section-title"><div><p className="eyebrow">{episodes ? 'TRANSMISSION ARCHIVE' : 'MEET THE LOCALS'}</p><h2>{episodes ? 'Episode' : 'Character'} index<span>.</span></h2></div><span className="result-count" aria-live="polite">{loading ? 'Scanning the multiverse…' : error ? 'Connection interrupted' : `${data?.info.count ?? 0} ${episodes ? 'episodes' : 'characters'} discovered`}</span></div><div className="toolbar"><label className="search"><span aria-hidden="true">⌕</span><input type="search" aria-label={`Search ${kind}s`} placeholder={episodes ? 'Search episodes by name…' : 'Search across the multiverse…'} value={query} onChange={e => { setQuery(e.target.value); setPage(1) }}/></label><div className="filters" aria-label={episodes ? 'Season filters' : 'Status filters'}>{filters.map(([value, label]) => <button key={value} aria-pressed={filter === value} className={filter === value ? 'selected' : ''} onClick={() => { setFilter(value); setPage(1) }}>{value && !episodes && <i className={`dot ${value}`}/ >}{label}</button>)}</div></div>{!episodes && <div className="quick-search"><span>QUICK JUMP</span>{['Rick', 'Morty', 'Summer', 'Beth', 'Jerry'].map(name => <button key={name} className={query === name ? 'active' : ''} onClick={() => { setQuery(query === name ? '' : name); setPage(1) }}>{name}<span aria-hidden="true">↗</span></button>)}{(query || filter) && <button className="clear-search" onClick={() => { setQuery(''); setFilter(''); setPage(1) }}>Clear filters ×</button>}</div>}<div aria-busy={loading}>{loading ? <div className="character-grid">{Array.from({ length: 8 }, (_, i) => <div key={i} className="skeleton"/>)}</div> : error ? <div className="empty" role="alert"><h3>Signal lost</h3><p>{error}</p><button onClick={() => setRetry(n => n + 1)}>Reconnect ↻</button></div> : !data?.results.length ? <div className="empty"><h3>Nobody in this dimension.</h3><p>Try a different name or reset your filters.</p><button onClick={() => { setQuery(''); setFilter(''); setPage(1) }}>Reset search</button></div> : <div className={episodes ? 'episode-grid' : 'character-grid'}>{data.results.map(item => episodes ? <article key={item.id} className="episode-card"><span className="episode-code">{item.episode}</span><h3>{item.name}</h3><p>{item.air_date}</p><details><summary>{item.characters.length} characters · View cast</summary><div className="cast">{item.characters.map(url => <Link key={url} href={`/characters/${url.split('/').pop()}`} aria-label={`View character ${url.split('/').pop()}`}><img src={`${API}/character/avatar/${url.split('/').pop()}.jpeg`} alt="" loading="lazy" width="48" height="48"/></Link>)}</div></details></article> : <Link className="character-card" key={item.id} href={`/characters/${item.id}`}><div className="portrait"><img src={item.image} alt={item.name} loading="lazy" width="300" height="300"/><span className={`status ${item.status.toLowerCase()}`}><i/>{item.status}</span><span className="card-arrow">↗</span></div><div className="card-body"><span className="card-id">#{String(item.id).padStart(3, '0')}</span><h3>{item.name}</h3><p>{item.species}<span>·</span>{item.gender}</p><div className="location"><span>⌖</span><div><small>LAST KNOWN LOCATION</small><p>{item.location.name}</p></div></div></div></Link>)}</div>}</div>{!loading && !error && data?.info.pages > 1 && <div className="pagination"><span>Page {page} of {data.info.pages}</span><div><button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Previous</button><button disabled={page === data.info.pages} onClick={() => { setPage(p => p + 1); document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' }) }}>Next dimension →</button></div></div>}</section>
}
