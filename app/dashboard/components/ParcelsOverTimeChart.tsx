// Example (adjust data fetching as needed)
"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import prisma from "@/prisma/prisma";
import { useTranslation } from "@/provider/language-provider";

const chartConfig = {
  parcels: {
    label: "Parcels",
  },
} satisfies ChartConfig;

export function ParcelsOverTimeChart() {
  const [chartData, setChartData] = useState([]);
  const doTranslate = useTranslation(translations);
  useEffect(() => {
    // async function fetchChartData() {
    //   const currentUserId = 1; // Replace with your actual user ID

    //   // Fetch parcels and group by date
    //   const parcels = await prisma.parcel.findMany({
    //     where: {
    //       user_id: currentUserId,
    //     },
    //     orderBy: {
    //       created_at: "asc",
    //     },
    //   });

    //   const groupedData = {};
    //   parcels.forEach((parcel) => {
    //     const date = parcel.created_at.toISOString().split("T")[0]; // Get date string
    //     groupedData[date] = (groupedData[date] || 0) + 1;
    //   });

    //   // Convert grouped data to array format for recharts
    //   const chartDataArray = Object.entries(groupedData).map(([date, count]) => ({
    //     date,
    //     parcels: count,
    //   }));

    //   setChartData(chartDataArray);
    // }

    // fetchChartData();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{doTranslate('Parcels Over Time')}</CardTitle>
          <CardDescription>
            {doTranslate('Number of parcels created over time')}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="parcels"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey="parcels" fill={`var(--color-parcels)`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const translations = {
  "Parcels Over Time": {
    "English": "Parcels Over Time",
    "French": "Colis au fil du temps",
    "Arabic": "الطرود بمرور الوقت"
  },
  "Number of parcels created over time": {
    "English": "Number of parcels created over time",
    "French": "Nombre de colis créés au fil du temps",
    "Arabic": "عدد الطرود التي تم إنشاؤها بمرور الوقت"
  },

}