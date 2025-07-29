import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../App.css';

function PetProfilePage() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await fetch(`http://localhost:3000/pets/${id}`);
        const data = await res.json();

        if (res.status === 404) {
          setError(data.message || 'Pet not found');
        } else {
          setPet(data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch pet.');
      }
    };

    fetchPet();
  }, [id]);

  if (error) return <p className="profile-error">{error}</p>;
  if (!pet) return <p className="profile-loading">Loading pet...</p>;

  return (
    <div className="profile-container">
      <h1 className="profile-name">{pet.name}</h1>
      <img
        src={pet.photoUrl || '/default-pet.png'}
        alt={pet.name}
        className="profile-photo"
      />
      <p className="profile-birthday">
        <strong>Birthday:</strong>{' '}
        {pet.birthday ? new Date(pet.birthday).toLocaleDateString() : 'Unknown'}
      </p>
      {pet.funfact && <p className="profile-funfact">{pet.funfact}</p>}
      <button className="profile-edit-btn" onClick={() => navigate(`/pet/${id}/edit`)}>
        Edit Details
      </button>
    </div>
  );
}

export default PetProfilePage;
