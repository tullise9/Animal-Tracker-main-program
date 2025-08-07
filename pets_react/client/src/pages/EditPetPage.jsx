import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../App.css';

function EditPetPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [funfact, setFunfact] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await fetch(`http://localhost:3000/pets/${id}`);
        const data = await res.json();

        if (res.status === 404) {
          setError(data.message || 'Pet not found');
        } else {
          setName(data.name || '');
          setBirthday(data.birthday ? data.birthday.split('T')[0] : '');
          setFunfact(data.funfact || '');
          setPhotoUrl(data.photoUrl || '');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch pet details.');
      }
    };

    fetchPet();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();

    // Fix birthday by shifting local date to UTC
    const localDate = new Date(birthday);
    localDate.setDate(localDate.getDate() + 1);

    try {
      const res = await fetch(`http://localhost:3000/pets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          birthday: localDate.toISOString(),
          funfact,
          photoUrl,
        }),
      });

      const updatedPet = await res.json();

      if (!res.ok) {
        setError(updatedPet.message || 'Failed to update pet');
        return;
      }

      navigate(`/pet/${id}`);
    } catch (err) {
      console.error(err);
      setError('An error occurred while updating the pet.');
    }
  };

  const handleCancel = () => {
    setShowPopup(true);
  };

  const confirmCancel = () => {
    navigate(`/pet/${id}`);
  };

  return (
    <div className="editpet-form">
      <h2>Edit Pet Details</h2>
      {error && <p className="profile-error">{error}</p>}

      <form onSubmit={handleSave} className="editpet-form-fields">
        <label>
          Name:
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Birthday:
          <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} required />
        </label>
        <label>
          Care Notes:
          <input value={funfact} onChange={(e) => setFunfact(e.target.value)} />
        </label>
        

        <div className="editpet-buttons">
          <button type="submit" className="editpet-save">Save</button>
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
  );
}

export default EditPetPage;
