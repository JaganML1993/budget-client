import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Typography from '@mui/material/Typography';
import DataGridFooter from 'components/common/DataGridFooter';
import { useParams } from 'react-router-dom';

import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  useGridApiRef,
  GridApi,
} from '@mui/x-data-grid';

// Types matching your commitmentHistory fields
interface DecimalValue {
  $numberDecimal: string;
}

interface CommitmentHistory {
  _id: string;
  amount: DecimalValue;
  currentEmi: number;
  paidDate: string;
  remarks?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  status: string;
  code: number;
  data: CommitmentHistory[];
  message: string;
}

interface HistoryRow {
  id: string;
  amount: number;
  currentEmi: number;
  paidDate: Date | string;
  remarks: string;
  createdAt: string | null;
  raw: CommitmentHistory;
}

const parseDecimal = (value: DecimalValue | undefined): number => {
  if (!value || !value.$numberDecimal) return 0;
  return parseFloat(value.$numberDecimal);
};

const formatCurrency = (value: number | undefined): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value ?? 0);
};

const CommitmentHistoryTable = () => {
  const apiRef = useGridApiRef<GridApi>();
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/commitments/history/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch commitment history');
        return res.json();
      })
      .then((data: ApiResponse) => {
        const mappedRows: HistoryRow[] = data.data.map((item, idx) => ({
          id: item._id ?? idx.toString(),
          amount: parseDecimal(item.amount),
          currentEmi: item.currentEmi,
          paidDate: item.paidDate,
          remarks: item.remarks || '',
          createdAt: item.createdAt ?? null,
          raw: item,
        }));
        setRows(mappedRows);
      })
      .catch((err) => {
        console.error('Error loading commitment history:', err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const columns: GridColDef<HistoryRow>[] = [
    {
      field: 'paidDate',
      headerName: 'Paid Date',
      flex: 1,
      minWidth: 140,
      renderCell: (params: GridRenderCellParams<HistoryRow, Date | string>) => {
        if (!params.value) return '-';
        const dateObj = params.value instanceof Date ? params.value : new Date(params.value);
        if (isNaN(dateObj.getTime())) return '-';
        return format(dateObj, 'dd MMM, yyyy');
      },
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      minWidth: 120,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: GridRenderCellParams<HistoryRow, number>) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'currentEmi',
      headerName: 'Current EMI',
      flex: 1,
      minWidth: 100,
      type: 'number',
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'createdAt',
      headerName: 'Entry Created',
      flex: 1,
      minWidth: 140,
      renderCell: (params: GridRenderCellParams<HistoryRow, string | null>) => {
        if (!params.value) return '-';
        const dateObj = new Date(params.value);
        if (isNaN(dateObj.getTime())) return '-';
        return format(dateObj, 'dd MMM, yyyy HH:mm');
      },
    },
  ];

  return (
    <DataGrid
      apiRef={apiRef}
      rows={rows}
      columns={columns}
      rowHeight={45}
      loading={loading}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 10,
          },
        },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnMenu
      disableVirtualization
      disableRowSelectionOnClick
      slots={{
        pagination: DataGridFooter,
      }}
      sx={{ minHeight: 400 }}
    />
  );
};

export default CommitmentHistoryTable;
