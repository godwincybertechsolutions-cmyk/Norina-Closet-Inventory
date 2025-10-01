import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: 'cash' | 'collection' | 'exclamation' | 'tag';
}

const Icon: React.FC<{ icon: StatCardProps['icon'] }> = ({ icon }) => {
  const icons: { [key: string]: React.ReactElement } = {
    cash: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />,
    collection: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
    exclamation: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    tag: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 8V5a2 2 0 012-2z" />
  };
  return (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-gold" fill="none" viewBox="0 24 24" stroke="currentColor">
      {icons[icon]}
     </svg>
  );
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-secondary p-5 rounded-lg shadow-lg flex items-center space-x-4 transition-transform transform hover:scale-105">
      <div className="bg-accent p-3 rounded-full">
        <Icon icon={icon} />
      </div>
      <div>
        <p className="text-sm text-text-secondary font-medium">{title}</p>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;