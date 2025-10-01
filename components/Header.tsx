import React from 'react';
import { logoUrl } from '../assets/logo';

const Header: React.FC = () => {
  return (
    <header className="bg-primary shadow-lg py-3">
      <div className="max-w-7xl mx-auto flex justify-center items-center">
        <img src={logoUrl} alt="Norina Closet Logo" className="h-20 sm:h-24" />
      </div>
    </header>
  );
};

export default Header;
