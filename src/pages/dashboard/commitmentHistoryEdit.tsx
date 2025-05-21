import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  InputLabel,
  FormControl,
} from '@mui/material';
import dayjs from 'dayjs';

interface CommitmentHistoryForm {
  amount: string;
  currentEmi: string;
  paidDate: string;
  remarks: string;
  attachment: File | null;
  existingAttachment?: string; // For showing old file if any
}

const defaultState: CommitmentHistoryForm = {
  amount: '',
  currentEmi: '',
  paidDate: dayjs().format('YYYY-MM-DD'),
  remarks: '',
  attachment: null,
  existingAttachment: undefined,
};

type APIError = { msg: string };

const CommitmentHistoryEdit = () => {
  const [form, setForm] = useState(defaultState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Fetch existing data
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/commitments/history/edit/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.data) throw new Error('Not found');
        const h = data.data;
        setForm({
          amount: h.amount?.$numberDecimal || h.amount || '',
          currentEmi: h.currentEmi?.toString() || '',
          paidDate: h.paidDate ? dayjs(h.paidDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
          remarks: h.remarks || '',
          attachment: null,
          existingAttachment: h.attachment || undefined, // Adjust if attachment is an array
        });
      })
      .catch(() => setError('Failed to fetch commitment history.'))
      .finally(() => setLoading(false));
  }, [id]);

  // Handle text and number input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm((prev) => ({ ...prev, attachment: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!id) {
      setError('Invalid commitment history ID.');
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('amount', form.amount);
    formData.append('currentEmi', form.currentEmi);
    formData.append('paidDate', form.paidDate);
    if (form.remarks) formData.append('remarks', form.remarks);
    if (form.attachment) formData.append('attachment', form.attachment);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/commitments/history/update/${id}`,
        {
          method: 'PUT',
          body: formData,
        },
      );

      if (!response.ok) {
        const data = await response.json();
        setError(
          (data.errors as APIError[])?.map((e) => e.msg).join(', ') ||
            data.message ||
            'Failed to update commitment history.',
        );
        setSubmitting(false);
        return;
      }

      navigate(-1);
    } catch (err: unknown) {
      setError('Error updating commitment history.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Grid container justifyContent="center" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading...</Typography>
      </Grid>
    );
  }

  return (
    <Grid container justifyContent="center" sx={{ mt: 4, mb: 4 }}>
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Paper sx={{ p: { xs: 2, sm: 4 }, maxWidth: 600, width: '100%', mx: 'auto' }}>
          <Typography variant="h5" gutterBottom>
            Edit Commitment History
          </Typography>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="amount"
                  label="Amount"
                  type="number"
                  value={form.amount}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  inputProps={{ step: '0.01', min: '0' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="currentEmi"
                  label="Current EMI"
                  type="number"
                  value={form.currentEmi}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  inputProps={{ min: '1' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="paidDate"
                  label="Paid Date"
                  type="date"
                  value={form.paidDate}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel shrink>Attachment</InputLabel>
                  <input
                    name="attachment"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    style={{ marginTop: 16 }}
                  />
                  {form.existingAttachment && (
                    <Typography variant="caption" sx={{ mt: 1 }}>
                      Existing: <a href={form.existingAttachment} target="_blank" rel="noopener noreferrer">View</a>
                    </Typography>
                  )}
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
                    {submitting ? 'Saving...' : 'Save'}
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

export default CommitmentHistoryEdit;
