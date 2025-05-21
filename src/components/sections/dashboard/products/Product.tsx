import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface ProductInfoProps {
  data: {
    name: string;
    dueInDays: number | string;
    price: number | string;
  };
}

const Product = ({ data }: ProductInfoProps) => {
  const { name, dueInDays, price } = data;

  let dueLabel: string;
  let dueColor: string;

  if (typeof dueInDays === 'number') {
    if (dueInDays < 0) {
      dueLabel = `Due Over ${Math.abs(dueInDays)} days`;
      dueColor = 'error.main'; // red
    } else if (dueInDays === 0) {
      dueLabel = 'Today';
      dueColor = 'warning.main'; // orange
    } else {
      dueLabel = `Pay in ${dueInDays} days`;
      dueColor = 'success.main'; // green
    }
  } else {
    // Fallback if dueInDays is not a number
    dueLabel = dueInDays;
    dueColor = 'text.primary';
  }

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" padding={1}>
      <Typography variant="body2" fontWeight={600}>
        {name}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={700}
        color={dueColor}
      >
        {dueLabel}
      </Typography>
      <Typography variant="body2" fontWeight={400}>
        ₹{price}
      </Typography>
    </Stack>
  );
};

export default Product;
