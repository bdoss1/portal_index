'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const duo = [
  { id: 1, name: 'Rick Sanchez', role: 'The smartest man in the universe. Probably.', image: '/images/rick.jpeg', label: 'GENIUS. SCIENTIST. GRANDPA.' },
  { id: 2, name: 'Morty Smith', role: 'A regular kid. Extremely irregular adventures.', image: '/images/morty.jpeg', label: 'RELUCTANT MULTIVERSE EXPLORER.' },
]

export default function Hero() {
  const [active, setActive] = useState(0)
  const [jumping, setJumping] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function surpriseMe() {
    if (jumping) return
    setJumping(true)
    setError('')
    try {
      const response = await fetch('https://rickandmortyapi.com/api/character', { signal: AbortSignal.timeout(10000) })
      if (!response.ok) throw new Error('Portal unavailable')
      const initial = await response.json()
      const { info } = initial
      const page = Math.floor(Math.random() * info.pages) + 1
      const pageResponse = page === 1 ? null : await fetch(`https://rickandmortyapi.com/api/character?page=${page}`, { signal: AbortSignal.timeout(10000) })
      if (pageResponse && !pageResponse.ok) throw new Error('Portal unavailable')
      // Select an existing result rather than assuming character IDs are consecutive.
      const results = pageResponse ? (await pageResponse.json()).results : initial.results
      router.push(`/characters/${results[Math.floor(Math.random() * results.length)].id}`)
    } catch {
      setError('Portal signal lost. Give it another try.')
    } finally {
      setJumping(false)
    }
  }

  return <section className="hero character-hero">
    <div className="hero-copy">
      <div className="eyebrow"><span/> THE MULTIVERSE, CATALOGUED</div>
      <h1>Infinite realities.<br/><em>Familiar faces.</em></h1>
      <p>Your field guide to the wonderfully weird universe of Rick & Morty. Find a familiar face. Discover a new dimension. Get schwifty.</p>
      <div className="hero-actions"><a href="#explore" className="primary-button">Explore the multiverse <span>↗</span></a><button className="surprise-button" onClick={surpriseMe} disabled={jumping}><span aria-hidden="true">⤨</span> {jumping ? 'Opening portal…' : 'Surprise me'}</button></div>
      {error && <p className="hero-error" role="alert">{error}</p>}
      <div className="hero-note"><span>✳</span> Infinite adventures. Zero responsible adults.</div>
    </div>
    <div className="duo-stage">
      <div className="comic-ring" aria-hidden="true"/>
      <span className="duo-sticker" aria-hidden="true">OH, GEEZ!</span>
      <span className="duo-star" aria-hidden="true">✳</span>
      <div className="duo-cards">
        {duo.map((character, index) => <Link key={character.id} href={`/characters/${character.id}`} className={`duo-card duo-${index} ${active === index ? 'featured' : ''}`} aria-label={`Explore ${character.name}`}>
          <div className="duo-photo"><img src={character.image} alt={character.name} width="300" height="300" fetchPriority="high"/><span className="duo-number">FILE / 00{character.id}</span><span className="duo-open" aria-hidden="true">↗</span></div>
          <div className="duo-caption"><small>{character.label}</small><h2>{character.name}</h2><span>View character file ↗</span></div>
        </Link>)}
      </div>
      <div className="duo-controls"><div className="duo-tabs" aria-label="Featured character">{duo.map((character, index) => <button key={character.id} aria-pressed={active === index} onClick={() => setActive(index)}>{character.name.split(' ')[0]}</button>)}</div><p aria-live="polite">{duo[active].role}</p></div>
    </div>
  </section>
}
