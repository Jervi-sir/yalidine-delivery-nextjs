'use client'

import { Label } from "@/components/ui/label";
import useHeadbarInsetStore from "@/zustand/headbarInsetStore";


export default function Page() {
  const setHeaderTitles = useHeadbarInsetStore((state: any) => state.setHeaderTitles);
  setHeaderTitles(['Product', 'Suggest']);
  return (
    <div className="flex h-full justify-center items-center ">
      <Label>Coming soons</Label>
    </div>
  );
}