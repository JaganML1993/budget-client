import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import IconifyIcon from 'components/base/IconifyIcon';
import DataGridFooter from 'components/common/DataGridFooter';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  useGridApiRef,
  GridApi,
  GridPaginationModel,
  GridRowModesModel,
  GridRowId,
} from '@mui/x-data-grid';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const CATEGORY_LABELS: Record<number, string> = {
  1: 'Bank Transfer',
  2: 'Cash',
  3: 'Other',
};

interface DecimalValue {
  $numberDecimal: string;
}

interface Expense {
  _id: string;
  name: string;
  amount: DecimalValue;
  category: number;
  paidOn: string;
  createdBy: string;
  remarks: string;
  attachment: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  status: string;
  code: number;
  data: Expense[];
  totalPages: number;
  total: number;
  message: string;
}

interface ExpenseRow {
  id: string;
  order: number;
  amount: number;
  category: string;
  createdAt: string;
  remarks: string;
  raw: Expense;
}

interface ExpenseTableProps {
  searchText: string;
}

async function fetchExpenses(
  page = 1,
  limit = 10,
  category?: number,
  startDate?: string,
  endDate?: string,
): Promise<{ data: Expense[]; totalPages: number; totalItems: number }> {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const createdBy = user._id;

  const url = new URL(`${import.meta.env.VITE_API_BASE_URL}/admin/expenses`);
  if (createdBy) url.searchParams.append('createdBy', createdBy);
  url.searchParams.append('page', String(page));
  url.searchParams.append('limit', String(limit));
  if (category) url.searchParams.append('category', String(category));
  if (startDate) url.searchParams.append('startDate', startDate);
  if (endDate) url.searchParams.append('endDate', endDate);

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error('Failed to fetch data');
  const data: ApiResponse = await response.json();
  return { data: data.data, totalPages: data.totalPages, totalItems: data.total };
}

const parseDecimal = (value: DecimalValue | undefined): number => {
  if (!value || !value.$numberDecimal) return 0;
  return parseFloat(value.$numberDecimal);
};

const ExpenseTable = ({ searchText }: ExpenseTableProps) => {
  const apiRef = useGridApiRef<GridApi>();
  const [rows, setRows] = useState<ExpenseRow[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rowModesModel] = useState<GridRowModesModel>({});
  const navigate = useNavigate();

  // Filter state
  const [category, setCategory] = useState<number | ''>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Responsive media query
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setLoading(true);
    fetchExpenses(
      paginationModel.page + 1,
      paginationModel.pageSize,
      category ? Number(category) : undefined,
      startDate || undefined,
      endDate || undefined,
    )
      .then(({ data, totalItems }) => {
        const mappedRows: ExpenseRow[] = data.map((item, idx) => ({
          id: item._id,
          order: paginationModel.page * paginationModel.pageSize + idx + 1,
          amount: parseDecimal(item.amount),
          category: CATEGORY_LABELS[item.category] || 'Other',
          createdAt: item.createdAt,
          remarks: item.remarks || '',
          raw: item,
        }));
        setRows(mappedRows);
        setRowCount(totalItems);
      })
      .catch((error) => {
        console.error('Error loading saving:', error);
      })
      .finally(() => setLoading(false));
  }, [paginationModel.page, paginationModel.pageSize, category, startDate, endDate]);

  useEffect(() => {
    apiRef.current?.setQuickFilterValues(
      (searchText ?? '').split(/\b\W+\b/).filter((word) => word !== ''),
    );
  }, [searchText, apiRef]);

  const handleEditClick = (id: GridRowId) => () => {
    navigate(`/pages/savings/edit/${id}`);
  };
  const handleDeleteClick = (id: GridRowId) => async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user._id;
    if (!userId) {
      alert('User not found. Please login again.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this saving?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/expenses/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        const err = await response.json();
        alert(err.message || 'Failed to delete saving');
        return;
      }
      setRows((prev) => prev.filter((row) => row.id !== id));
      setRowCount((prev) => prev - 1);
    } catch (error) {
      alert('Error deleting saving');
      console.error(error);
    }
  };

  const columns: GridColDef<ExpenseRow>[] = [
    {
      field: 'order',
      headerName: '#',
      minWidth: 60,
      flex: 0.4,
      type: 'number',
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      minWidth: 120,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          ₹{params.value}
        </Typography>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        if (!params.value) return '-';
        const dateObj = new Date(params.value);
        if (isNaN(dateObj.getTime())) return '-';
        return format(dateObj, 'dd MMM, yyyy HH:mm');
      },
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      flex: 2,
      minWidth: 200,
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
          onClick={handleDeleteClick(id)}
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
          onClick={handleEditClick(id)}
          size="small"
          key="edit"
        />,
      ],
    },
  ];

  // --- Filter UI ---
  return (
    <div>
      <div
       style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 8 : 16,
          marginBottom: 16,
          alignItems: isMobile ? 'stretch' : 'center',
          flexWrap: 'wrap',
        }}
      >
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value === '' ? '' : Number(e.target.value))}
          displayEmpty
          size="small"
          style={{ minWidth: 160 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          <MenuItem value={1}>Bank Transfer</MenuItem>
          <MenuItem value={2}>Cash</MenuItem>
          <MenuItem value={3}>Other</MenuItem>
        </Select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ padding: 8, fontSize: 14 }}
          placeholder="Start Date"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ padding: 8, fontSize: 14 }}
          placeholder="End Date"
        />
      </div>
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
        rowModesModel={rowModesModel}
        slots={{
          pagination: DataGridFooter,
        }}
        sx={{ minHeight: 400 }}
      />
    </div>
  );
};

export default ExpenseTable;
