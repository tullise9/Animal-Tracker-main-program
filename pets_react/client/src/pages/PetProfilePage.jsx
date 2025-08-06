import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../App.css';

function PetProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [weights, setWeights] = useState([]);
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await fetch(`http://localhost:3000/pets/${id}`);
        const data = await res.json();
        res.status === 404 ? setError(data.message || 'Pet not found') : setPet(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch pet.');
      }
    };

    const fetchWeights = async () => {
      try {
        const res = await fetch(`http://localhost:5001/weights/${id}`);
        const data = await res.json();

        // Sort by date ascending
        const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setWeights(sorted);
      } catch (err) {
        console.error(err);
        setWeights([]);
      }
    };

    fetchPet();
    fetchWeights();
  }, [id]);

  const handleAddWeight = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5001/weights/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight, date }),
      });

      const newEntry = await res.json();
      const updated = [...weights, newEntry].sort((a, b) => new Date(a.date) - new Date(b.date));
      setWeights(updated);
      setWeight('');
      setDate('');
    } catch (err) {
      console.error(err);
    }
  };

  if (error) return <p className="profile-error">{error}</p>;
  if (!pet) return <p className="profile-loading">Loading pet...</p>;

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
        tension: 0.1,
      },
    ],
  };

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

      <button
        className="profile-edit-btn"
        onClick={() => navigate(`/pet/${id}/edit-weights`)}
      >
        Edit Weight History
      </button>
    </div>
  );
}

export default PetProfilePage;



