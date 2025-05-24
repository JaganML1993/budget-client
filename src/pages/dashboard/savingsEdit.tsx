import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
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
  CircularProgress,
  Link,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import type { SelectChangeEvent } from '@mui/material/Select';

// Category mapping for select
const CATEGORY_OPTIONS = [
  { value: 1, label: 'Bank Transfer' },
  { value: 2, label: 'Cash' },
  { value: 3, label: 'Other' },
];

interface Expense {
  _id: string;
  name: string;
  amount: { $numberDecimal: string } | string | number;
  category: number | string;
  paidOn: string;
  createdBy: string;
  remarks: string;
  attachment: string;
  createdAt: string;
  updatedAt: string;
}

const defaultState = {
  amount: '',
  category: '',
  remarks: '',
  attachment: null as File | null,
  existingAttachment: '',
};

const EditSavings = () => {
  const [form, setForm] = useState(defaultState);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Fetch existing data
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/expenses/edit/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch savings');
        const data = await res.json();
        const expense: Expense = data.data;
        setForm({
          amount: String(
            typeof expense.amount === 'object'
              ? expense.amount.$numberDecimal
              : expense.amount ?? '',
          ),
          category: String(expense.category ?? ''),
          remarks: expense.remarks || '',
          attachment: null,
          existingAttachment: expense.attachment || '',
        });
      })
      .catch(() => setError('Failed to load savings'))
      .finally(() => setLoading(false));
  }, [id]);

  // For TextField
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'file' ? (e.target as HTMLInputElement).files?.[0] ?? null : value,
    }));
  };

  // For Select
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Prepare FormData for file upload
    const formData = new FormData();
    formData.append('name', 'savings'); // Hardcoded
    formData.append('amount', String(form.amount));
    formData.append('category', String(form.category));
    // Use existing paidOn if available, else set to today
    formData.append('paidOn', new Date().toISOString().split('T')[0]);
    formData.append('createdBy', JSON.parse(localStorage.getItem('user') || '{}')._id || '');
    formData.append('remarks', form.remarks);
    if (form.attachment) {
      formData.append('attachment', form.attachment);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/expenses/update/${id}`,
        {
          method: 'PUT',
          body: formData,
        },
      );
      if (!response.ok) {
        const data = await response.json();
        setError(data.errors?.[0]?.msg || data.message || 'Failed to update savings');
        setSubmitting(false);
        return;
      }
      navigate(-1); // Go back or use navigate('/savings')
    } catch (err) {
      setError('Error updating savings');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid container justifyContent="center" sx={{ mt: 4, mb: 4 }}>
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Paper sx={{ p: { xs: 2, sm: 4 }, maxWidth: 600, width: '100%', mx: 'auto' }}>
          <Typography variant="h5" gutterBottom>
            Edit Savings
          </Typography>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container spacing={2}>
              {/* Expense Name is hidden and hardcoded */}
              {/* Paid On is hidden and set to today */}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="amount"
                  label="Amount"
                  type="number"
                  value={form.amount}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  inputProps={{ step: '0.01' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={form.category}
                    label="Category"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="">Select Category</MenuItem>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button variant="outlined" component="label" fullWidth sx={{ height: '56px' }}>
                  {form.attachment ? (
                    form.attachment.name
                  ) : form.existingAttachment ? (
                    <Link
                      href={`${import.meta.env.VITE_API_BASE_URL}/${form.existingAttachment}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                    >
                      View Current Attachment
                    </Link>
                  ) : (
                    'Upload Attachment'
                  )}
                  <input
                    type="file"
                    name="attachment"
                    accept="image/*,application/pdf"
                    hidden
                    onChange={handleInputChange}
                  />
                </Button>
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
              {error && (
                <Grid item xs={12}>
                  <Typography color="error">{error}</Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button variant="outlined" onClick={() => navigate(-1)} disabled={submitting}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" disabled={submitting}>
                    {submitting ? <CircularProgress size={24} /> : 'Update'}
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

export default EditSavings;
