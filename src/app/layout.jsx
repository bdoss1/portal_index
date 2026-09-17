import Link from 'next/link'
import './globals.css'
export const metadata = { title: 'Portal Index — A Rick & Morty field guide', description: 'Explore characters and episodes across the Rick and Morty multiverse.' }
export default function Layout({ children }) {
  return <html lang="en"><body><header className="topbar"><Link href="/" className="brand"><span className="brand-portal">◎</span> PORTAL<span className="brand-light">INDEX</span></Link><nav aria-label="Main navigation"><Link href="/">Characters</Link><Link href="/episodes">Episodes</Link></nav><span className="online"><i/> DIMENSION C-137</span></header><main>{children}</main><footer><Link href="/" className="footer-brand">◎ PORTAL INDEX</Link><span>Site designed by <a href="https://barondoss.com" target="_blank" rel="noreferrer">Baron Doss</a>.</span><a href="https://rickandmortyapi.com/documentation" target="_blank" rel="noreferrer">Powered by Rick and Morty API ↗</a></footer></body></html>
}
