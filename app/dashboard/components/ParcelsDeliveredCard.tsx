"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/provider/language-provider";
import { useEffect, useState } from "react";
import axios from 'axios';

export default function ParcelsDeliveredCard() {
  const [parcelsDelivered, setParcelsDelivered] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const doTranslate = useTranslation(translations);

  useEffect(() => {
    const fetchParcelsDelivered = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/stats/delivered', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        setParcelsDelivered(response.data.count);
        setError(null);
      } catch (err) {
        console.error('Error fetching delivered parcels:', err);
        setError('Failed to load parcel data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchParcelsDelivered();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardDescription>{doTranslate('This Week')}</CardDescription>
        <CardTitle className="text-4xl">
          {isLoading ? '...' : error ? '!' : parcelsDelivered}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          {isLoading ? 
            doTranslate('Loading...') : 
            error ? 
            doTranslate('No data available') : 
            `${parcelsDelivered} paid deliveries this week`}
        </div>
      </CardContent>
      <CardFooter>
        <Progress 
          value={isLoading || error ? 0 : (parcelsDelivered > 0 ? 25 : 0)} 
          aria-label={`${parcelsDelivered} delivered parcels`}
        />
      </CardFooter>
    </Card>
  );
}

const translations = {
  "This Week": {
    "English": "This Week",
    "French": "Cette semaine",
    "Arabic": "هذا الأسبوع"
  },
  "No data available": {
    "English": "No data available",
    "French": "Aucune donnée disponible",
    "Arabic": "لا توجد بيانات متاحة"
  },
  "Loading...": {
    "English": "Loading...",
    "French": "Chargement...",
    "Arabic": "جار التحميل..."
  }
};