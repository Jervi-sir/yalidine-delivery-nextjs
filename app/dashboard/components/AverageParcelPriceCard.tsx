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
import { useTranslation } from "@/provider/language-provider";
import axios from 'axios';

export default function ReturnedParcelsCard() {
  const [returnedCount, setReturnedCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const doTranslate = useTranslation(translations);

  useEffect(() => {
    const fetchReturnedCount = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/stats/returned', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        setReturnedCount(response.data.count);
        setError(null);
      } catch (err) {
        console.error('Error fetching returned parcels:', err);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReturnedCount();
  }, []);

  // Sample data for the chart (you might want to fetch real trend data)
  const chartData = [
    { date: "Mon", count: 2 },
    { date: "Tue", count: 1 },
    { date: "Wed", count: 3 },
    { date: "Thu", count: 0 },
    { date: "Fri", count: 2 },
    { date: "Sat", count: 1 },
    { date: "Sun", count: returnedCount },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="p-4 pb-0">
        <CardTitle>{doTranslate('Returned Parcels')}</CardTitle>
        <CardDescription>
          {doTranslate('Number of parcels returned this week')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
        <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
          {isLoading ? '...' : error ? '!' : returnedCount}
        </div>
        <ChartContainer
          config={{
            count: {
              label: "Returns",
              color: "hsl(var(--chart-2))",
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
            data={chartData}
          >
            <Bar
              dataKey="count"
              fill="var(--color-count)"
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

const translations = {
  "Returned Parcels": {
    "English": "Returned Parcels",
    "French": "Colis retournés",
    "Arabic": "الطرود المرجعة"
  },
  "Number of parcels returned this week": {
    "English": "Number of parcels returned this week",
    "French": "Nombre de colis retournés cette semaine",
    "Arabic": "عدد الطرود المرجعة هذا الأسبوع"
  },
};