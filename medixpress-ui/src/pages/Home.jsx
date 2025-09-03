import React, { useState } from 'react';
import HeroCust from '../components/HeroCust';
import HeroGuest from '../components/HeroGuest';
import Features from '../components/Features';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { user } = useAuth();
  const [pincode, setPincode] = useState('');
  const navigate = useNavigate();

  const handleFindPharmacies = (pin) => {
    // Redirect to /pharmacies?pincode=XXXX
    navigate(`/pharmacies?pincode=${pin}`);
  };

  return (
    <>
      {user ? (
        <HeroCust 
          pincode={pincode} 
          setPincode={setPincode} 
          onFindPharmacies={handleFindPharmacies}
        />
      ) : (
        <HeroGuest />
      )}

      <Features />
    </>
  );
}

export default Home;
