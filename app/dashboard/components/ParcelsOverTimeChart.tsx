"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import { useTranslation } from "@/provider/language-provider";
import axios from 'axios';

const chartConfig = {
  parcels: {
    label: "Parcels",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export function ParcelsOverTimeChart() {
  const [chartData, setChartData] = useState<{ date: string; parcels: number }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const doTranslate = useTranslation(translations);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/stats/over-time', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        setChartData(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching parcels chart data:', err);
        setError('Failed to load chart data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{doTranslate('Parcels Over Time')}</CardTitle>
          <CardDescription>
            {isLoading 
              ? doTranslate('Loading...')
              : error 
              ? doTranslate('Error loading data')
              : doTranslate('Number of parcels created over time')}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {error ? (
          <div className="flex items-center justify-center h-[250px] text-red-500">
            {error}
          </div>
        ) : (
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
                minTickGap={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
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
              <Bar 
                dataKey="parcels" 
                fill={chartConfig.parcels.color} 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
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
  "Loading...": {
    "English": "Loading...",
    "French": "Chargement...",
    "Arabic": "جار التحميل..."
  },
  "Error loading data": {
    "English": "Error loading data",
    "French": "Erreur de chargement des données",
    "Arabic": "خطأ في تحميل البيانات"
  }
};