import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../App.css'

function EditPetPhotoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pet, setPet] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Fetch the pet info
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await fetch(`http://localhost:3000/pets/${id}`)
        const data = await res.json()
        console.log('Fetched pet:', data)
        setPet(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load pet info.')
      }
    }

    fetchPet()
  }, [id])

  const handleReplace = async e => {
    e.preventDefault()
    if (!imageFile) {
      setError('Please select a new image.')
      return
    }
  
    const formData = new FormData()
    formData.append('image', imageFile)
  
    try {
      const uploadRes = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData
      })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) {
        setError(uploadData.message || 'Failed to upload image.')
        return
      }
  
      const newUrl = uploadData.url
  
      const updateRes = await fetch(`http://localhost:3000/pets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoUrl: newUrl })
      })
      const updated = await updateRes.json()
      if (!updateRes.ok) {
        setError(updated.message || 'Failed to update pet image URL.')
        return
      }
  
      setSuccess(true)
      setTimeout(() => navigate(`/pet/${id}`), 800)
    } catch (err) {
      console.error(err)
      setError('Error during image update.')
    }
  }
  

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3002/delete/${id}`, {
        method: 'DELETE',
      })
  
      const result = await res.json()
      console.log('Delete response:', result)
  
      if (!res.ok) {
        setError(result.message || 'Failed to delete image.')
        return
      }
  
      setSuccess(true)
      setTimeout(() => navigate(`/pet/${id}`), 1500)
    } catch (err) {
      console.error(err)
      setError('Error deleting image.')
    }
  }
  


  if (!pet) return <p>Loading pet info...</p>

  return (
    <div className="edit-photo-container">
      <h1>Update {pet.name}'s Photo</h1>

      <img
        src={pet.photoUrl || '/default-pet.png'}
        alt={pet.name}
        className="profile-photo"
      />

      <form onSubmit={handleReplace} className="edit-photo-form">
        <label>
          Choose new image:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </label>
        <button type="submit">Save</button>
      </form>

      <button onClick={handleDelete} className="delete-photo-btn">
        Delete Photo
      </button>

      {success && <p className="success-message">Photo updated!</p>}
      {error && <p className="error-message">{error}</p>}

      <button onClick={() => navigate(`/pet/${id}`)}>Back to Profile</button>
    </div>
  )
}

export default EditPetPhotoPage



