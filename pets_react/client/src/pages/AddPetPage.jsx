import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';  // Use global styles

function AddPetPage() {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [funfact, setFunfact] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);  // Controls popup visibility
  const navigate = useNavigate();

  const handleCancel = () => {
    setShowPopup(true); // Show confirmation popup
  };

  const confirmCancel = () => {
    navigate('/'); // Go back to Home Page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birthday, funfact, photoUrl }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to add pet');
        return;
      }

      navigate('/');
    } catch (err) {
      console.error(err);
      setError('An error occurred while adding the pet.');
    }
  };

  return (
    <div className="addpet-container">
      <h1 className="addpet-title">Add a New Pet</h1>
      {error && <p className="addpet-error">{error}</p>}

      <form onSubmit={handleSubmit} className="addpet-form">
        <label>
          Name: <span className="required">*</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Birthday: <span className="required">*</span>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
          />
        </label>

        <label>
          Fun Fact:
          <input
            type="text"
            value={funfact}
            onChange={(e) => setFunfact(e.target.value)}
          />
        </label>

        <label>
          Photo URL:
          <input
            type="url"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://example.com/pet.jpg"
          />
        </label>

        <button type="submit" className="addpet-submit">Save Pet</button>
        <button type="button" className="addpet-cancel" onClick={handleCancel}>Cancel</button>
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
  );
}

export default AddPetPage;