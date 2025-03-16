
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function BookFilters() {
  const [feeRange, setFeeRange] = useState([1000, 3000]);
  const [showInactive, setShowInactive] = useState(false);
  
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Select>
          <SelectTrigger id="department">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="mathematics">Mathematics</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="computer">Computer Science</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="teacher">Teacher</Label>
        <Select>
          <SelectTrigger id="teacher">
            <SelectValue placeholder="All Teachers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teachers</SelectItem>
            <SelectItem value="t1">Abdul Khaliq</SelectItem>
            <SelectItem value="t2">Farida Noori</SelectItem>
            <SelectItem value="t3">Mohammad Nazir</SelectItem>
            <SelectItem value="none">No Teacher Assigned</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="start-date">Started After</Label>
        <Select>
          <SelectTrigger id="start-date">
            <SelectValue placeholder="Any Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Date</SelectItem>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="students-count">Students Count</Label>
        <Select>
          <SelectTrigger id="students-count">
            <SelectValue placeholder="Any Number" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Number</SelectItem>
            <SelectItem value="0">No Students</SelectItem>
            <SelectItem value="1-5">1-5 Students</SelectItem>
            <SelectItem value="6-10">6-10 Students</SelectItem>
            <SelectItem value="10+">10+ Students</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4 sm:col-span-2">
        <div className="flex items-center justify-between">
          <Label>Fee Range (AFN)</Label>
          <div className="text-sm">
            {feeRange[0].toLocaleString()} - {feeRange[1].toLocaleString()}
          </div>
        </div>
        <Slider
          defaultValue={feeRange}
          min={0}
          max={5000}
          step={100}
          value={feeRange}
          onValueChange={setFeeRange}
          className="py-4"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="inactive" 
          checked={showInactive}
          onCheckedChange={setShowInactive}
        />
        <Label htmlFor="inactive">Show inactive books</Label>
      </div>
      
      <div className="flex items-center mt-auto sm:justify-end">
        <Button size="sm" variant="secondary">Apply Filters</Button>
      </div>
      
      <Separator className="sm:col-span-2 lg:col-span-4 mt-4" />
    </div>
  );
}
