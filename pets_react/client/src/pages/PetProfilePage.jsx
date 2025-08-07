import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import 'chart.js/auto'
import '../App.css'

function PetProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pet, setPet] = useState(null)
  const [weights, setWeights] = useState([])
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState('')
  const [error, setError] = useState('')
  const [showDeletePopup, setShowDeletePopup] = useState(false)

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await fetch(`http://localhost:3000/pets/${id}`, { cache: 'no-store' })
        const data = await res.json()
        res.status === 404 ? setError(data.message || 'Pet not found') : setPet(data)
      } catch (err) {
        console.error(err)
        setError('Failed to fetch pet.')
      }
    }

    const fetchWeights = async () => {
      try {
        const res = await fetch(`http://localhost:5001/weights/${id}`, { cache: 'no-store' })
        const data = await res.json()
        const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date))
        setWeights(sorted)
      } catch (err) {
        console.error(err)
        setWeights([])
      }
    }

    fetchPet()
    fetchWeights()
  }, [id])

  const handleAddWeight = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`http://localhost:5001/weights/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight, date })
      })

      const newEntry = await res.json()
      const updated = [...weights, newEntry].sort((a, b) => new Date(a.date) - new Date(b.date))
      setWeights(updated)
      setWeight('')
      setDate('')
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeletePet = async () => {
    try {
      const res = await fetch(`http://localhost:3000/pets/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message || 'Failed to delete pet.')
        return
      }

      navigate('/')
    } catch (err) {
      console.error(err)
      setError('Error deleting pet.')
    }
  }

  if (error) return <p className="profile-error">{error}</p>
  if (!pet) return <p className="profile-loading">Loading pet...</p>

  const chartData = {
    labels: weights.map(entry =>
      new Date(entry.date).toLocaleDateString('en-US', { timeZone: 'UTC' })
    ),
    datasets: [
      {
        label: 'Weight (lbs)',
        data: weights.map(entry => entry.weight),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }

  return (
    <div className="profile-container">
      <h1 className="profile-name">{pet.name}</h1>
    
      <div className="photo-wrapper">
        <img
          src={
            pet.photoUrl
              ? `${pet.photoUrl}?t=${Date.now()}`
              : '/default-pet.png'
          }
          alt={pet.name}
          className="profile-photo"
        />

        <button
          className="profile-edit-btn"
          onClick={() => navigate(`/pet/${id}/edit-photo`)}
        >
          Edit Photo
        </button>
      </div>

      <p className="profile-birthday">
        <strong>Birthday:</strong>{' '}
        {pet.birthday ? new Date(pet.birthday).toLocaleDateString() : 'Unknown'}
      </p>

      <p className="profile-funfact">
        <strong>Care Notes:</strong> {pet.funfact || 'None'}
      </p>

      <Line data={chartData} />

      <form onSubmit={handleAddWeight} className="weight-form">
        <label>
          Weight (lbs):
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            required
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </label>
        <button type="submit">Add Weight</button>
      </form>

      <div className="profile-buttons">
        <button
          className="profile-edit-btn"
          onClick={() => navigate(`/pet/${id}/edit-weights`)}
        >
          Edit Weight History
        </button>
        <button
          className="profile-edit-btn"
          onClick={() => navigate(`/pet/${id}/edit`)}
        >
          Edit Pet Info
        </button>
      </div>

      <div className="delete-pet-container">
        <button className="delete-pet-btn" onClick={() => setShowDeletePopup(true)}>
          Delete Pet
        </button>
      </div>

      {showDeletePopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>Are you sure you want to delete this profile? All pet data will be lost.</p>
            <button onClick={handleDeletePet}>Yes, Delete</button>
            <button onClick={() => setShowDeletePopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PetProfilePage








