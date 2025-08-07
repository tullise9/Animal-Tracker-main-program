import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

function AddPetPage() {
  const [name, setName] = useState('')
  const [birthday, setBirthday] = useState('')
  const [funfact, setFunfact] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [error, setError] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const navigate = useNavigate()

  const handleCancel = () => {
    setShowPopup(true)
  }

  const confirmCancel = () => {
    navigate('/')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    let uploadedImageUrl = ''

    if (imageFile) {
      const formData = new FormData()
      formData.append('image', imageFile)

      try {
        const uploadRes = await fetch('http://localhost:3001/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) {
          const data = await uploadRes.json()
          setError(data.message || 'Failed to upload image')
          return
        }

        const uploadData = await uploadRes.json()
        uploadedImageUrl = uploadData.url
      } catch (err) {
        console.error(err)
        setError('Image upload failed.')
        return
      }
    }

    try {
      const res = await fetch('http://localhost:3000/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          birthday,
          funfact,
          imageUrl: uploadedImageUrl || '',
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message || 'Failed to add pet')
        return
      }

      navigate('/')
    } catch (err) {
      console.error(err)
      setError('An error occurred while adding the pet.')
    }
  }

  return (
    <div className="addpet-container">
      <h2 className="addpet-title">Add a New Pet</h2>
      {error && <p className="addpet-error">{error}</p>}

      <form onSubmit={handleSubmit} className="addpet-form-vertical">
        <label>
          Name: <span className="required"></span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Birthday: <span className="required"></span>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
          />
        </label>

        <label>
          Care Notes:
          <input
            type="text"
            value={funfact}
            onChange={(e) => setFunfact(e.target.value)}
          />
        </label>

        <label>
          Pet Photo:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </label>

        <div className="editpet-buttons">
          <button type="submit" className="editpet-save">Save Pet</button>
          <button type="button" className="editpet-cancel" onClick={handleCancel}>Cancel</button>
        </div>
      </form>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>Changes will not be saved. Are you sure you want to cancel?</p>
            <button onClick={confirmCancel}>Yes</button>
            <button onClick={() => setShowPopup(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddPetPage


