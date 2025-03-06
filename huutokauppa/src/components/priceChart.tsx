import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts";

export default function PriceChart({ data }) {
  const bids = data;
  if (data) {
  }
  return (
    <Card
      sx={{
        height: 350,
        boxShadow: 5,
        width: 350,
        margin: 1,
        borderRadius: "16px",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      <CardContent>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              Hinta historia
            </Typography>
            { /*<Chip size="small" color="success" label="Tänään 8%" /> */}
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Hinta viimeisen 10 huudon aikana
          </Typography>
        </Stack>
        <LineChart
          xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
          series={[
            {
              data: [
                bids[9].bid,
                bids[8].bid,
                bids[7].bid,
                bids[6].bid,
                bids[5].bid,
                bids[4].bid,
                bids[3].bid,
                bids[2].bid,
                bids[1].bid,
                bids[0].bid,
              ],
            },
          ]}
          height={300}
        />
      </CardContent>
    </Card>
  );
}
