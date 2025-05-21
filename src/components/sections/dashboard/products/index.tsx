import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Product from './Product';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Payment {
  _id: string;
  payFor: string;
  dueInDays: number;
  emiAmount: { $numberDecimal: string };
}

const UpcomingPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user._id;
    if (!userId) {
      alert('User not found. Please login again.');
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/admin/dashboard/upcoming-payments?userId=${userId}`)
      .then((res) => res.json())
      .then((data: Payment[]) => {
        setPayments(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        alert('Failed to fetch upcoming payments.');
      });
  }, []);

  return (
    <Stack direction="column" gap={3.75} component={Paper} height={300} padding={2}>
      <Typography variant="h6" fontWeight={400}>
        Upcoming Payments
      </Typography>

      <Stack direction="row" justifyContent="space-between">
        <Typography variant="caption" fontWeight={300}>
          Payment
        </Typography>
        <Typography variant="caption" fontWeight={300}>
          Due In (days)
        </Typography>
        <Typography variant="caption" fontWeight={300}>
          Amount
        </Typography>
      </Stack>

      {loading ? (
        <Typography variant="body2">Loading...</Typography>
      ) : payments.length === 0 ? (
        <Typography variant="body2">No upcoming payments</Typography>
      ) : (
        payments.map((payment) => (
          <Product
            key={payment._id}
            data={{
              name: payment.payFor || 'Untitled Payment',
              dueInDays: payment.dueInDays,
              price: payment.emiAmount?.$numberDecimal || '0',
            }}
          />
        ))
      )}
    </Stack>
  );
};

export default UpcomingPayments;
