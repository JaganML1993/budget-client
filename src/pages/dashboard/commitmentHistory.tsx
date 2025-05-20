import Grid from '@mui/material/Grid';
import CommitmentHistory from 'components/sections/dashboard/commitmentHistory';

const Dashboard = () => {
  return (
    <Grid container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>

      <Grid item xs={12}>
        <CommitmentHistory />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
