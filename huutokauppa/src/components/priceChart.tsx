import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { ThemeContext } from '@emotion/react';
import { colors } from '@mui/material';

export default function PriceChart() {

    return (
        <Card sx={{
            height: 350,
            boxShadow: 5,
            width: 350,
            margin: 1,
            borderRadius: "16px",
            transition: "transform 0.2s ease",
            "&:hover": {
                transform: "scale(1.05)",
            },
        }}>
            <CardContent>
                <Stack sx={{ justifyContent: 'space-between' }}>
                    <Stack
                        direction="row"
                        sx={{

                            alignContent: { xs: 'center', sm: 'flex-start' },
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <Typography variant="h4" component="p">
                            Hinta historia
                        </Typography>
                        <Chip size="small" color="error" label="Tänään -8%" />
                    </Stack>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Hinta viimeisen viikon aikana
                    </Typography>
                </Stack>
                <BarChart
                    borderRadius={5}
                    xAxis={
                        [
                            {
                                scaleType: 'band',
                                categoryGapRatio: 0.4,
                                data: ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'la', 'Su'],
                            },
                        ] as any
                    }
                    series={[
                        {
                            id: 'product_price',
                            label: 'Product price',
                            data: [2234, 3872, 2998, 4125, 3357, 2789, 2998],
                            stack: 'A',
                        },


                    ]}
                    height={250}
                    margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
                    grid={{ horizontal: true }}
                    slotProps={{
                        legend: {
                            hidden: true,
                        },
                    }}
                />
            </CardContent>
        </Card>
    );
}
