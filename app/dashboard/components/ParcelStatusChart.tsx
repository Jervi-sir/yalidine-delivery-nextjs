// Example (adjust data fetching as needed)
"use client";

import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import prisma from "@/prisma/prisma";

export default function ParcelStatusChart() {
  const [parcelStatusData, setParcelStatusData] = useState([]);

  useEffect(() => {
    async function fetchParcelStatusData() {
      const currentUserId = 1; // Replace with your actual user ID

      const parcels = await prisma.parcel.findMany({
        where: {
          user_id: currentUserId,
        },
      });

      const statusCounts = {};
      parcels.forEach((parcel) => {
        const status = parcel.status || "Unknown"; // Handle null status
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      const totalParcels = parcels.length;
      const chartData = Object.entries(statusCounts).map(([status, count]) => ({
        activity: status,
        value: (count as any / totalParcels) * 100,
        fill: `var(--color-${status.toLowerCase()})`, // Customize colors
      }));

      setParcelStatusData(chartData);
    }

    fetchParcelStatusData();
  }, []);

  return (
    <Card className="h-full">
      <CardContent className="flex gap-4 p-4">
        <div className="grid items-center gap-2">
          {/* You can add summary information here if needed */}
        </div>
        <ChartContainer
          config={{
            delivered: {
              label: "Delivered",
              color: "hsl(var(--chart-1))",
            },
            inTransit: {
              label: "In Transit",
              color: "hsl(var(--chart-2))",
            },
            pending: {
              label: "Pending",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="mx-auto aspect-square w-full max-w-[80%]"
        >
          <RadialBarChart
            margin={{
              left: -10,
              right: -10,
              top: -10,
              bottom: -10,
            }}
            data={parcelStatusData}
            innerRadius="20%"
            barSize={24}
            startAngle={90}
            endAngle={450}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              dataKey="value"
              tick={false}
            />
            <RadialBar dataKey="value" background cornerRadius={5} />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
