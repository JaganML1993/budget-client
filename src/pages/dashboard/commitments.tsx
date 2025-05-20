import Grid from '@mui/material/Grid';
import Commitments from 'components/sections/dashboard/commitments';

const Dashboard = () => {
  return (
    <Grid container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>

      <Grid item xs={12}>
        <Commitments />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
