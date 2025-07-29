import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function HomePage() {
  const [pets, setPets] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const url = search
          ? `http://localhost:3000/pets?name=${encodeURIComponent(search)}`
          : `http://localhost:3000/pets`

        const res = await fetch(url)
        const data = await res.json()

        if (res.status === 404) {
          setPets([])
          setError(data.message || 'No pet found')
        } else {
          setPets(data)
          setError('')
        }
      } catch (err) {
        console.error(err)
        setError('Failed to fetch pets.')
      }
    };

    fetchPets()
  }, [search])

  return (
    <div className="home-container">
      <h1>Pet Library</h1>

      <div className="home-header">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="home-search"
        />
        <button className="home-add-btn"><Link to="/add">Add Pet</Link></button>
      </div>

      {error && <p className="home-error">{error}</p>}

      <div className="pet-grid">
        {pets.map((pet) => (
          <div key={pet._id} className="pet-card">
            <img src={pet.photoUrl || '/default-pet.png'}/>
            <h3>{pet.name}</h3>
            <Link to={`/pet/${pet._id}`}>View Profile</Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage;

