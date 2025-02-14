import { Label } from '@/components/ui/label';
import React from 'react';
import { Switch } from "@/components/ui/switch"

export const SwitchComponent = ({ label1 = null, label2, handleOnChecked }) => {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="airplane-mode">{ label1 }</Label>
      <Switch id="airplane-mode" onCheckedChange={handleOnChecked} />
      <Label htmlFor="airplane-mode">{ label2 }</Label>
    </div>
  );
};