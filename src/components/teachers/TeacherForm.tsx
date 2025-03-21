
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { SalaryType, Teacher } from "@/types";
import { TeacherService } from "@/services/TeacherService";

const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  contactNumber: z.string().min(7, { message: "Please enter a valid contact number" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  specialization: z.string().min(3, { message: "Specialization must be at least 3 characters" }),
  salaryType: z.enum(["fixed", "per-book", "percentage"] as const),
  salaryAmount: z.coerce.number().min(1, { message: "Salary amount must be greater than 0" }),
  password: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TeacherFormProps {
  onSuccess?: () => void;
  initialData?: Partial<Teacher>;
}

export default function TeacherForm({ onSuccess, initialData }: TeacherFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      contactNumber: initialData?.contactNumber || "",
      address: initialData?.address || "",
      specialization: initialData?.specialization || "",
      salaryType: initialData?.salaryType || "fixed",
      salaryAmount: initialData?.salaryAmount || 0,
      password: undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      if (initialData?.id) {
        // Update existing teacher
        await TeacherService.updateTeacher(initialData.id, {
          name: data.name,
          email: data.email,
          contactNumber: data.contactNumber,
          address: data.address,
          specialization: data.specialization,
          salaryType: data.salaryType,
          salaryAmount: data.salaryAmount,
        });
        
        toast({
          title: "Teacher updated successfully",
          description: `${data.name}'s information has been updated.`,
        });
      } else {
        // Create new teacher
        await TeacherService.createTeacher({
          name: data.name,
          email: data.email,
          contactNumber: data.contactNumber,
          address: data.address,
          specialization: data.specialization,
          salaryType: data.salaryType,
          salaryAmount: data.salaryAmount,
          isActive: true,
          dateOfJoining: new Date(),
        }, data.password);
        
        toast({
          title: "Teacher added successfully",
          description: `${data.name} has been added to the system.`,
        });
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form if not editing
      if (!initialData) {
        form.reset();
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "There was a problem with the teacher. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSalaryTypeLabel = (type: SalaryType): string => {
    switch (type) {
      case 'fixed':
        return 'Fixed Salary';
      case 'per-book':
        return 'Per Book';
      case 'percentage':
        return 'Percentage';
      default:
        return type;
    }
  };

  const isNewTeacher = !initialData?.id;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Teacher's full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="example@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {isNewTeacher && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password (optional)</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Create account password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input placeholder="+93 700 123 456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialization</FormLabel>
                <FormControl>
                  <Input placeholder="English, Mathematics, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="salaryType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select salary type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fixed">{getSalaryTypeLabel('fixed')}</SelectItem>
                    <SelectItem value="per-book">{getSalaryTypeLabel('per-book')}</SelectItem>
                    <SelectItem value="percentage">{getSalaryTypeLabel('percentage')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="salaryAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {form.watch("salaryType") === "percentage" 
                    ? "Percentage Amount (%)" 
                    : form.watch("salaryType") === "per-book"
                      ? "Amount Per Book (AFN)"
                      : "Monthly Salary (AFN)"}
                </FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Teacher's address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onSuccess?.()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Teacher" : "Add Teacher"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
