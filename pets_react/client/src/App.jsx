import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import AddPetPage from './pages/AddPetPage.jsx';
import PetProfilePage from './pages/PetProfilePage.jsx';
import NavBar from './components/Navigation.jsx';
import EditPetPage from './pages/EditPetPage.jsx';
import EditWeightPage from './pages/EditWeightPage.jsx';
import EditPetPhotoPage from './pages/EditPetPhotoPage.jsx';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div style={{ minHeight: 'calc(100vh - 60px - 50px)' }}>
        {/* Reserve space for navbar (60px) and footer (50px) */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddPetPage />} />
          <Route path="/pet/:id" element={<PetProfilePage />} />
          <Route path="/pet/:id/edit" element={<EditPetPage />} />
          <Route path="/pet/:id/edit-weights" element={<EditWeightPage />} />
          <Route path="/pet/:id/edit-photo" element={<EditPetPhotoPage />} />
        </Routes>
      </div>
      <footer>
        Keep track of your pets and their needs!
      </footer>
    </BrowserRouter>
  );
}

export default App;
