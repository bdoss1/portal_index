import CharacterDetail from '../../../components/CharacterDetail'
export default async function CharacterPage({ params }) { const { id } = await params; return <CharacterDetail id={id}/> }
