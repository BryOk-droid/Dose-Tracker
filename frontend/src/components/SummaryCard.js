import { Card, CardContent, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: 275,
  margin: theme.spacing(2),
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.03)",
  },
}));

const SummaryCard = ({ title, value, icon, color }) => {
  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <div>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {value}
            </Typography>
          </div>
          <Box color={color} fontSize="2.5rem">
            {icon}
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default SummaryCard;
