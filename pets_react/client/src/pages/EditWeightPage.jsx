import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function EditWeightPage() {
  const { id } = useParams(); // pet ID
  const navigate = useNavigate();
  const [weights, setWeights] = useState([]);

  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const res = await fetch(`http://localhost:5001/weights/${id}`);
        const data = await res.json();
        setWeights(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWeights();
  }, [id]);

  const handleUpdate = async (weightId, updatedWeight, updatedDate) => {
    try {
      await fetch(`http://localhost:5001/weights/${id}/${weightId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight: updatedWeight, date: updatedDate }),
      });
      // Re-fetch updated list
      const res = await fetch(`http://localhost:5001/weights/${id}`);
      const updatedWeights = await res.json();
      setWeights(updatedWeights);
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleDelete = async (weightId) => {
    try {
      await fetch(`http://localhost:5001/weights/${id}/${weightId}`, {
        method: 'DELETE',
      });
      // Re-fetch updated list
      const res = await fetch(`http://localhost:5001/weights/${id}`);
      const updatedWeights = await res.json();
      setWeights(updatedWeights);
    } catch (err) {
      console.error(err);
    }
  };
  

  return (
    <div className="edit-weight-page">
      <h2>Edit Weight Entries</h2>
      {weights.length === 0 ? (
        <p>No weight data found.</p>
      ) : (
        <ul>
          {weights.map((entry) => (
            <li key={entry._id}>
              <input
                type="number"
                value={entry.weight}
                onChange={(e) =>
                  setWeights((prev) =>
                    prev.map((w) =>
                      w._id === entry._id ? { ...w, weight: e.target.value } : w
                    )
                  )
                }
              />
              <input
                type="date"
                value={entry.date.split('T')[0]}
                onChange={(e) =>
                  setWeights((prev) =>
                    prev.map((w) =>
                      w._id === entry._id ? { ...w, date: e.target.value } : w
                    )
                  )
                }
              />
              <button
                onClick={() => handleUpdate(entry._id, entry.weight, entry.date)}
              >
                Update
              </button>
              <button onClick={() => handleDelete(entry._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate(`/pet/${id}`)}>Back to Profile</button>
    </div>
  );
}

export default EditWeightPage;
