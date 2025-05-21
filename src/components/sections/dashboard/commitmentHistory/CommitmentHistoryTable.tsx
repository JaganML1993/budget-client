import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Typography from '@mui/material/Typography';
import DataGridFooter from 'components/common/DataGridFooter';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  useGridApiRef,
  GridApi,
  GridPaginationModel,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import IconifyIcon from 'components/base/IconifyIcon';

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
  message: string;
  data: CommitmentHistory[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
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
  const navigate = useNavigate();

  // Pagination state
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0, // MUI DataGrid uses 0-based page index
    pageSize: 10,
  });

  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  // Fetch data
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/admin/commitments/history/${id}?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}`,
    )
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
        setRowCount(data.totalItems);
      })
      .catch((err) => {
        console.error('Error loading commitment history:', err);
      })
      .finally(() => setLoading(false));
  }, [id, paginationModel.page, paginationModel.pageSize]);

  // Delete handler
  const handleDeleteClick = (rowId: string) => async () => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/commitments/history/${rowId}`,
        {
          method: 'DELETE',
        },
      );
      if (!response.ok) {
        const err = await response.json();
        alert(err.message || 'Failed to delete entry');
        return;
      }
      setRows((prev) => prev.filter((row) => row.id !== rowId));
      setRowCount((prev) => prev - 1);
    } catch (error) {
      alert('Error deleting entry');
      console.error(error);
    }
  };

  // Columns with actions
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
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      minWidth: 100,
      flex: 0.7,
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={
            <IconifyIcon
              icon="mingcute:delete-3-fill"
              color="text.secondary"
              sx={{ pointerEvents: 'none' }}
            />
          }
          label="Delete"
          onClick={handleDeleteClick(id as string)}
          size="small"
          key="delete"
        />,
        <GridActionsCellItem
          icon={
            <IconifyIcon
              icon="fluent:edit-32-filled"
              color="text.secondary"
              sx={{ pointerEvents: 'none' }}
            />
          }
          label="Edit"
          onClick={() => navigate(`/edit-commitment-history/${id}`)}
          size="small"
          key="edit"
        />,
      ],
    },
  ];

  return (
      <DataGrid
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        rowHeight={45}
        loading={loading}
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
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
