import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';

// Enums matching your backend schema
enum PayType {
  Expenses = 1,
  Savings = 2,
}
enum Category {
  EMI = 1,
  Full = 2,
}
enum Status {
  Ongoing = 1,
  Completed = 2
}

// Store as string for Select compatibility
const defaultState = {
  payFor: '',
  totalEmi: '',
  emiAmount: '',
  payType: String(PayType.Expenses), // "1"
  category: String(Category.EMI),    // "1"
  remarks: '',
  dueDate: '',
  status: String(Status.Ongoing),    // "1"
};

const CreateCommitment = () => {
  const [form, setForm] = useState(defaultState);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // For TextField
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // For Select
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name as string]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Prepare payload (convert string fields to numbers)
    const payload = {
      ...form,
      totalEmi: Number(form.totalEmi),
      emiAmount: Number(form.emiAmount),
      dueDate: Number(form.dueDate),
      payType: Number(form.payType),
      category: Number(form.category),
      status: Number(form.status),
      createdBy: JSON.parse(localStorage.getItem('user') || '{}')._id,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/commitments/store`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error('Failed to create commitment');
      navigate(-1); // Go back or use navigate('/pages/commitments')
    } catch (err) {
      alert('Error creating commitment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Grid container justifyContent="center" sx={{ mt: 4, mb: 4 }}>
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Paper sx={{ p: { xs: 2, sm: 4 }, maxWidth: 600, width: '100%', mx: 'auto' }}>
          <Typography variant="h5" gutterBottom>
            Create Commitment
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="payFor"
                  label="Pay For"
                  value={form.payFor}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="totalEmi"
                  label="Total EMI"
                  type="number"
                  value={form.totalEmi}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="emiAmount"
                  label="EMI Amount"
                  type="number"
                  value={form.emiAmount}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="dueDate"
                  label="Due Date (Day of Month)"
                  type="number"
                  value={form.dueDate}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Pay Type</InputLabel>
                  <Select
                    name="payType"
                    value={form.payType}
                    label="Pay Type"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value={String(PayType.Expenses)}>Expenses</MenuItem>
                    <MenuItem value={String(PayType.Savings)}>Savings</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={form.category}
                    label="Category"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value={String(Category.EMI)}>EMI</MenuItem>
                    <MenuItem value={String(Category.Full)}>Full Payment</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={form.status}
                    label="Status"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value={String(Status.Ongoing)}>Ongoing</MenuItem>
                    <MenuItem value={String(Status.Completed)}>Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="remarks"
                  label="Remarks"
                  value={form.remarks}
                  onChange={handleInputChange}
                  multiline
                  minRows={2}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button variant="outlined" onClick={() => navigate(-1)} disabled={submitting}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CreateCommitment;
