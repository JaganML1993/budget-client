import Grid from '@mui/material/Grid';
import Savings from 'components/sections/dashboard/savings';

const Dashboard = () => {
  return (
    <Grid container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>

      <Grid item xs={12}>
        <Savings />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
