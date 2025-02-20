// Example (adjust data fetching as needed)
"use client";

import { Bar, BarChart, Rectangle, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import prisma from "@/prisma/prisma";

export default function AverageParcelPriceCard() {
  const [averagePrice, setAveragePrice] = useState(0);

  useEffect(() => {
    // async function fetchAveragePrice() {
    //   const currentUserId = 1; // Replace with your actual user ID

    //   const parcels = await prisma.parcel.findMany({
    //     where: {
    //       user_id: currentUserId,
    //     },
    //   });

    //   if (parcels.length > 0) {
    //     const totalPrice = parcels.reduce((sum, parcel) => sum + parcel.price, 0);
    //     const avgPrice = totalPrice / parcels.length;
    //     setAveragePrice(avgPrice);
    //   } else {
    //     setAveragePrice(0);
    //   }
    // }

    // fetchAveragePrice();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="p-4 pb-0">
        <CardTitle>Average Parcel Price</CardTitle>
        <CardDescription>
          Average price of your parcels over all time.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
        <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
          {averagePrice.toFixed(2)} 
          <small>DA</small>
        </div>
        <ChartContainer
          config={{
            steps: {
              label: "Steps",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="ml-auto w-[72px]"
        >
          <BarChart
            accessibilityLayer
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            data={[
              {
                date: "2024-01-01",
                steps: 2000,
              },
              {
                date: "2024-01-02",
                steps: 2100,
              },
              {
                date: "2024-01-03",
                steps: 2200,
              },
              {
                date: "2024-01-04",
                steps: 1300,
              },
              {
                date: "2024-01-05",
                steps: 1400,
              },
              {
                date: "2024-01-06",
                steps: 2500,
              },
              {
                date: "2024-01-07",
                steps: 1600,
              },
            ]}
          >
            <Bar
              dataKey="steps"
              fill="var(--color-steps)"
              radius={2}
              fillOpacity={0.2}
              activeIndex={6}
              activeBar={<Rectangle fillOpacity={0.8} />}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              hide
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
