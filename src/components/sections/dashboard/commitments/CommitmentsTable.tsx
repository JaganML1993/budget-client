import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import StatusChip from 'components/chips/StatusChip';
import IconifyIcon from 'components/base/IconifyIcon';
import DataGridFooter from 'components/common/DataGridFooter';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';

import {
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRenderEditCellParams,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  useGridApiRef,
  GridRenderCellParams,
  GridApi,
} from '@mui/x-data-grid';

// Enums to match backend schema
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
  Completed = 2,
}

interface DecimalValue {
  $numberDecimal: string;
}

interface Commitment {
  _id: string;
  payFor: string;
  totalEmi: number;
  paid: DecimalValue;
  pending: DecimalValue;
  emiAmount: DecimalValue;
  paidAmount: DecimalValue;
  balanceAmount: DecimalValue;
  payType: PayType;
  category: Category;
  remarks: string;
  attachment: string[];
  createdBy: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  dueDate: number;
  __v: number;
}

interface ApiResponse {
  status: string;
  code: number;
  data: Commitment[];
  totalPages: number;
  message: string;
}

interface OrderRow {
  id: string;
  order: number;
  client: string;
  date: Date | string;
  status: 'ongoing' | 'completed' | 'canceled'; // Matches backend status with additional frontend state
  payType: string;
  category: string;
  emiAmount: number;
  // paidAmount: number;
  // balanceAmount: number;
  totalEmi: number;
  paid: number;
  pending: number;
  dueDate: number;
  remarks: string;
  raw: Commitment;
}

interface OrdersStatusTableProps {
  searchText: string;
}

async function fetchCommitments(): Promise<Commitment[]> {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const createdBy = user._id;

  // Only add createdBy if it exists
  const url = new URL(`${import.meta.env.VITE_API_BASE_URL}/admin/commitments`);
  if (createdBy) url.searchParams.append('createdBy', createdBy);

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error('Failed to fetch data');
  const data: ApiResponse = await response.json();
  return data.data;
}

const parseDecimal = (value: DecimalValue | undefined): number => {
  if (!value || !value.$numberDecimal) return 0;
  return parseFloat(value.$numberDecimal);
};

const getPayTypeLabel = (payType: PayType): string => {
  return payType === PayType.Expenses ? 'Expenses' : 'Savings';
};

const getCategoryLabel = (category: Category): string => {
  return category === Category.EMI ? 'EMI' : 'Full Payment';
};

const formatCurrency = (value: number | undefined): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value ?? 0);
};

const OrdersStatusTable = ({ searchText }: OrdersStatusTableProps) => {
  const apiRef = useGridApiRef<GridApi>();
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommitments()
      .then((data) => {
        const mappedRows: OrderRow[] = data.map((item, index) => ({
          id: item._id,
          order: index + 1,
          client: item.payFor,
          date: new Date(item.createdAt),
          status: item.status === Status.Ongoing ? 'ongoing' : 'completed',
          payType: getPayTypeLabel(item.payType),
          category: getCategoryLabel(item.category),
          emiAmount: parseDecimal(item.emiAmount),
          // paidAmount: parseDecimal(item.paidAmount),
          // balanceAmount: parseDecimal(item.balanceAmount),
          totalEmi: item.totalEmi,
          paid: parseDecimal(item.paid),
          pending: parseDecimal(item.pending),
          dueDate: item.dueDate,
          remarks: item.remarks,
          raw: item,
        }));
        setRows(mappedRows);
      })
      .catch((error) => {
        console.error('Error loading commitments:', error);
      });
  }, []);

  useEffect(() => {
    apiRef.current?.setQuickFilterValues(searchText.split(/\b\W+\b/).filter((word) => word !== ''));
  }, [searchText, apiRef]);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    navigate(`/pages/commitments/edit/${id}`);
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user._id;
    if (!userId) {
      alert('User not found. Please login again.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this commitment?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/commitments/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }), // <-- send userId in body
      });
      if (!response.ok) {
        const err = await response.json();
        alert(err.message || 'Failed to delete commitment');
        return;
      }
      setRows(rows.filter((row) => row.id !== id));
    } catch (error) {
      alert('Error deleting commitment');
      console.error(error);
    }
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow } as OrderRow;
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef<OrderRow>[] = [
    {
      field: 'order',
      headerName: '#',
      minWidth: 80,
      flex: 0.5,
      type: 'number',
    },
    {
      field: 'client',
      headerName: 'Pay For',
      flex: 2,
      minWidth: 180,
      renderCell: (params: GridRenderCellParams<OrderRow, string>) => (
        <Typography
          variant="subtitle1"
          color="primary"
          sx={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => navigate(`/commitment-history/${params.row.id}`)}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'date',
      headerName: 'Created At',
      flex: 1,
      minWidth: 140,
      renderCell: (params: GridRenderCellParams<OrderRow, Date | string>) => {
        if (!params.value) return '-';
        const dateObj = params.value instanceof Date ? params.value : new Date(params.value);
        if (isNaN(dateObj.getTime())) return '-';
        return format(dateObj, 'dd MMM, yyyy');
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<OrderRow>) => <StatusChip status={params.value} />,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['ongoing', 'completed', 'canceled'],
      renderEditCell: (params: GridRenderEditCellParams<OrderRow>) => {
        const handleChange = (event: SelectChangeEvent) => {
          params.api.setEditCellValue({
            id: params.id,
            field: params.field,
            value: event.target.value,
          });
        };

        return (
          <Select value={params.value} onChange={handleChange} fullWidth>
            <MenuItem value="ongoing">Ongoing</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="canceled">Canceled</MenuItem>
          </Select>
        );
      },
    },
    {
      field: 'payType',
      headerName: 'Pay Type',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'emiAmount',
      headerName: 'EMI Amount',
      flex: 1,
      minWidth: 120,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: GridRenderCellParams<OrderRow, number>) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    // {
    //   field: 'paidAmount',
    //   headerName: 'Paid Amount',
    //   flex: 1,
    //   minWidth: 120,
    //   align: 'right',
    //   headerAlign: 'right',
    //   renderCell: (params: GridRenderCellParams<OrderRow, number>) => (
    //     <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
    //       {formatCurrency(params.value)}
    //     </Typography>
    //   ),
    // },
    // {
    //   field: 'balanceAmount',
    //   headerName: 'Balance Amount',
    //   flex: 1,
    //   minWidth: 120,
    //   align: 'right',
    //   headerAlign: 'right',
    //   renderCell: (params: GridRenderCellParams<OrderRow, number>) => (
    //     <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
    //       {formatCurrency(params.value)}
    //     </Typography>
    //   ),
    // },
    {
      field: 'totalEmi',
      headerName: 'Total EMI',
      flex: 1,
      minWidth: 100,
      type: 'number',
    },
    {
      field: 'paid',
      headerName: 'Paid EMI',
      flex: 1,
      minWidth: 100,
      type: 'number',
    },
    {
      field: 'pending',
      headerName: 'Pending EMI',
      flex: 1,
      minWidth: 100,
      type: 'number',
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
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
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      minWidth: 120,
      flex: 0.8,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={
                <IconifyIcon
                  color="primary.main"
                  icon="mdi:content-save"
                  sx={{ pointerEvents: 'none' }}
                />
              }
              label="Save"
              onClick={handleSaveClick(id)}
              size="small"
              key="save"
            />,
            <GridActionsCellItem
              icon={
                <IconifyIcon
                  color="text.secondary"
                  icon="iconamoon:sign-times-duotone"
                  sx={{ pointerEvents: 'none' }}
                />
              }
              label="Cancel"
              onClick={handleCancelClick(id)}
              size="small"
              key="cancel"
            />,
          ];
        }

        return [
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
        ];
      },
    },
  ];

  return (
    <DataGrid
      apiRef={apiRef}
      rows={rows}
      columns={columns}
      rowHeight={45}
      editMode="row"
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 10,
          },
        },
      }}
      // checkboxSelection
      pageSizeOptions={[10, 20, 50]}
      disableColumnMenu
      disableVirtualization
      disableRowSelectionOnClick
      rowModesModel={rowModesModel}
      onRowModesModelChange={handleRowModesModelChange}
      onRowEditStop={handleRowEditStop}
      processRowUpdate={processRowUpdate}
      slots={{
        pagination: DataGridFooter,
      }}
    />
  );
};

export default OrdersStatusTable;
