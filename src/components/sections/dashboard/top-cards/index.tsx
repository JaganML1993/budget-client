import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import TopCard from './TopCard';

const cardsDataTemplate = [
  {
    id: 1,
    title: 'Total Savings',
    value: '₹0.00',
    rate: '0%',
    isUp: true,
    icon: 'carbon:favorite-filled',
  },
  {
    id: 2,
    title: 'Commitment per Month',
    value: '₹0.00',
    rate: '0%',
    isUp: true,
    icon: 'solar:calendar-bold',
  },
  {
    id: 3,
    title: 'Commitments Full',
    value: '₹0.00',
    rate: '0%',
    isUp: true,
    icon: 'carbon:chart-bar', // Choose an appropriate icon
  },
  // ...add more cards here if needed
];

const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

const TopCards = () => {
  const [cardsData, setCardsData] = useState(cardsDataTemplate);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user._id;

    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/dashboard/top-card?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        let total = 0;
        if (typeof data.totalSavings === 'number') {
          total = data.totalSavings;
        } else if (
          data.totalSavings &&
          typeof data.totalSavings === 'object' &&
          '$numberDecimal' in data.totalSavings
        ) {
          total = parseFloat(data.totalSavings.$numberDecimal);
        }

        let commitments = 0;
        if (typeof data.commitments === 'number') {
          commitments = data.commitments;
        } else if (
          data.commitments &&
          typeof data.commitments === 'object' &&
          '$numberDecimal' in data.commitments
        ) {
          commitments = parseFloat(data.commitments.$numberDecimal);
        }

        let commitmentsFull = 0;
        if (typeof data.commitmentsFull === 'number') {
          commitmentsFull = data.commitmentsFull;
        } else if (
          data.commitmentsFull &&
          typeof data.commitmentsFull === 'object' &&
          '$numberDecimal' in data.commitmentsFull
        ) {
          commitmentsFull = parseFloat(data.commitmentsFull.$numberDecimal);
        }

        setCardsData((prev) =>
          prev.map((card) => {
            if (card.id === 1) {
              return { ...card, value: formatINR(total) };
            }
            if (card.id === 2) {
              return { ...card, value: formatINR(commitments) };
            }
            if (card.id === 3) {
              return { ...card, value: formatINR(commitmentsFull) };
            }
            return card;
          }),
        );
      })
      .catch((err) => {
        console.error('Failed to fetch top card data', err);
      });
  }, []);

  return (
    <Grid container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>
      {cardsData.map((item) => (
        <TopCard
          key={item.id}
          title={item.title}
          value={item.value}
          rate={item.rate}
          isUp={item.isUp}
          icon={item.icon}
        />
      ))}
    </Grid>
  );
};

export default TopCards;
