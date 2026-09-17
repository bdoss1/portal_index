'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
export default function CharacterDetail({ id }) {
  const [character, setCharacter] = useState(null), [episodes, setEpisodes] = useState([]), [error, setError] = useState(''), [episodeError, setEpisodeError] = useState(false), [retry, setRetry] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    // Reset the previous record when synchronizing with a different API resource.
    // oxlint-disable-next-line react/set-state-in-effect
    setCharacter(null); setError(''); setEpisodeError(false); setEpisodes([])
    async function load() {
      try {
        if (!/^\d+$/.test(id)) throw new Error('Character not found in this dimension.')
        const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`, { signal: controller.signal })
        if (!response.ok) throw new Error(response.status === 404 ? 'Character not found in this dimension.' : 'Unable to connect to the character archive.')
        const result = await response.json(); setCharacter(result)
        try {
          const ids = result.episode.map(url => url.split('/').pop()).join(',')
          if (!ids) return
          const episodeResponse = await fetch(`https://rickandmortyapi.com/api/episode/${ids}`, { signal: controller.signal })
          if (!episodeResponse.ok) throw new Error('Episode connection failed')
          const list = await episodeResponse.json(); setEpisodes(Array.isArray(list) ? list : [list])
        } catch (e) { if (e.name !== 'AbortError') setEpisodeError(true) }
      } catch (e) { if (e.name !== 'AbortError') setError(e.message) }
    }
    load(); return () => controller.abort()
  }, [id, retry])
  return <section className="detail"><Link className="back" href="/">← Back to character index</Link>{error ? <div className="empty" role="alert"><h1>Signal lost</h1><p>{error}</p><button onClick={() => setRetry(n => n + 1)}>Try again</button></div> : !character ? <div className="empty" role="status">Opening character portal…</div> : <><div className="detail-header"><div className="detail-image"><img src={character.image} alt={character.name} width="300" height="300"/></div><div><p className="eyebrow">CHARACTER FILE #{String(character.id).padStart(3, '0')}</p><h1>{character.name}</h1><span className={`status inline ${character.status.toLowerCase()}`}><i/>{character.status}</span><dl>{[['Species', character.species], ['Gender', character.gender], ['Origin', character.origin.name], ['Last known location', character.location.name], ['Type', character.type || 'Not specified'], ['Appearances', `${character.episode.length} episodes`]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div></div><h2>Across the episodes<span className="green">.</span></h2>{episodeError ? <p role="alert">Episode data is unavailable. <button onClick={() => setRetry(n => n + 1)}>Retry</button></p> : !episodes.length ? <p role="status">Loading appearances…</p> : <div className="episode-grid">{episodes.map(episode => <article className="episode-card" key={episode.id}><span className="episode-code">{episode.episode}</span><h3>{episode.name}</h3><p>{episode.air_date}</p></article>)}</div>}</>}</section>
}
