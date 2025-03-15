
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

export default function TeacherFilters() {
  const [salaryRange, setSalaryRange] = useState([5000, 25000]);
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
        <Label htmlFor="salary-type">Salary Type</Label>
        <Select>
          <SelectTrigger id="salary-type">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="fixed">Fixed</SelectItem>
            <SelectItem value="perBook">Per Book</SelectItem>
            <SelectItem value="percentage">Percentage</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="join-date">Joined After</Label>
        <Select>
          <SelectTrigger id="join-date">
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
        <Label htmlFor="book-count">Books Count</Label>
        <Select>
          <SelectTrigger id="book-count">
            <SelectValue placeholder="Any Number" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Number</SelectItem>
            <SelectItem value="0">No Books</SelectItem>
            <SelectItem value="1">1 Book</SelectItem>
            <SelectItem value="2">2 Books</SelectItem>
            <SelectItem value="3+">3+ Books</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4 sm:col-span-2">
        <div className="flex items-center justify-between">
          <Label>Salary Range (AFN)</Label>
          <div className="text-sm">
            {salaryRange[0].toLocaleString()} - {salaryRange[1].toLocaleString()}
          </div>
        </div>
        <Slider
          defaultValue={salaryRange}
          min={0}
          max={50000}
          step={1000}
          value={salaryRange}
          onValueChange={setSalaryRange}
          className="py-4"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="inactive" 
          checked={showInactive}
          onCheckedChange={setShowInactive}
        />
        <Label htmlFor="inactive">Show inactive teachers</Label>
      </div>
      
      <div className="flex items-center mt-auto sm:justify-end">
        <Button size="sm" variant="secondary">Apply Filters</Button>
      </div>
      
      <Separator className="sm:col-span-2 lg:col-span-4 mt-4" />
    </div>
  );
}
