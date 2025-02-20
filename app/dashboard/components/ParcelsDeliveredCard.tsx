// Example (adjust data fetching as needed)
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
import prisma from "@/prisma/prisma";
import { useEffect, useState } from "react";

export default function ParcelsDeliveredCard() {
  const [parcelsDelivered, setParcelsDelivered] = useState(0);

  useEffect(() => {
    // async function fetchParcelsDelivered() {
    //   const currentUserId = 1; // Replace with your actual user ID
    //   const today = new Date();
    //   const startOfWeek = new Date(
    //     today.setDate(today.getDate() - today.getDay())
    //   ); // Get the first day of the week

    //   const deliveredParcels = await prisma.parcel.count({
    //     where: {
    //       user_id: currentUserId,
    //       status: "Delivered", // Adjust status as needed
    //       occurred_at: {
    //         gte: startOfWeek,
    //       },
    //     },
    //   });
    //   setParcelsDelivered(deliveredParcels);
    // }

    // fetchParcelsDelivered();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardDescription>This Week</CardDescription>
        {/* <CardTitle className="text-4xl">{parcelsDelivered}</CardTitle> */}
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          {/* +25% from last week (replace with actual data) */}
          No data available
        </div>
      </CardContent>
      <CardFooter>
        <Progress value={25} aria-label="25% increase" />
      </CardFooter>
    </Card>
  );
}
