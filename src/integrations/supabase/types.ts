export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      administrators: {
        Row: {
          address: string | null
          contact_number: string | null
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          name: string
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          contact_number?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          name: string
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          contact_number?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      attendance: {
        Row: {
          book_id: string
          date: string
          id: string
          is_present: boolean
          period_number: number
          student_id: string
          teacher_id: string
        }
        Insert: {
          book_id: string
          date: string
          id?: string
          is_present: boolean
          period_number: number
          student_id: string
          teacher_id: string
        }
        Update: {
          book_id?: string
          date?: string
          id?: string
          is_present?: boolean
          period_number?: number
          student_id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          created_at: string
          department_id: string
          end_date: string | null
          fee: number
          id: string
          is_active: boolean | null
          name: string
          next_book_id: string | null
          periods: number
          start_date: string
        }
        Insert: {
          created_at?: string
          department_id: string
          end_date?: string | null
          fee: number
          id?: string
          is_active?: boolean | null
          name: string
          next_book_id?: string | null
          periods: number
          start_date: string
        }
        Update: {
          created_at?: string
          department_id?: string
          end_date?: string | null
          fee?: number
          id?: string
          is_active?: boolean | null
          name?: string
          next_book_id?: string | null
          periods?: number
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "books_next_book_id_fkey"
            columns: ["next_book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      branch_admins: {
        Row: {
          admin_id: string
          branch_id: string
          created_at: string
          id: string
        }
        Insert: {
          admin_id: string
          branch_id: string
          created_at?: string
          id?: string
        }
        Update: {
          admin_id?: string
          branch_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "branch_admins_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "branch_admins_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          location: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          location: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          location?: string
          name?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      exam_marks: {
        Row: {
          book_id: string
          date: string
          exam_type_id: string
          id: string
          marks: number
          student_id: string
        }
        Insert: {
          book_id: string
          date: string
          exam_type_id: string
          id?: string
          marks: number
          student_id: string
        }
        Update: {
          book_id?: string
          date?: string
          exam_type_id?: string
          id?: string
          marks?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_marks_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_marks_exam_type_id_fkey"
            columns: ["exam_type_id"]
            isOneToOne: false
            referencedRelation: "exam_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_marks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_types: {
        Row: {
          id: string
          max_marks: number
          name: string
          weightage: number
        }
        Insert: {
          id?: string
          max_marks: number
          name: string
          weightage: number
        }
        Update: {
          id?: string
          max_marks?: number
          name?: string
          weightage?: number
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date: string
          description: string
          id?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          book_id: string
          created_at: string
          due_date: string
          id: string
          is_paid: boolean | null
          paid_date: string | null
          student_id: string
        }
        Insert: {
          amount: number
          book_id: string
          created_at?: string
          due_date: string
          id?: string
          is_paid?: boolean | null
          paid_date?: string | null
          student_id: string
        }
        Update: {
          amount?: number
          book_id?: string
          created_at?: string
          due_date?: string
          id?: string
          is_paid?: boolean | null
          paid_date?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      salaries: {
        Row: {
          advance_amount: number | null
          advance_date: string | null
          amount: number
          created_at: string
          id: string
          is_paid: boolean | null
          month: string
          paid_date: string | null
          teacher_id: string
          year: number
        }
        Insert: {
          advance_amount?: number | null
          advance_date?: string | null
          amount: number
          created_at?: string
          id?: string
          is_paid?: boolean | null
          month: string
          paid_date?: string | null
          teacher_id: string
          year: number
        }
        Update: {
          advance_amount?: number | null
          advance_date?: string | null
          amount?: number
          created_at?: string
          id?: string
          is_paid?: boolean | null
          month?: string
          paid_date?: string | null
          teacher_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "salaries_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_book_details: {
        Row: {
          amount: number
          book_id: string
          days: number
          id: string
          salary_id: string
        }
        Insert: {
          amount: number
          book_id: string
          days: number
          id?: string
          salary_id: string
        }
        Update: {
          amount?: number
          book_id?: string
          days?: number
          id?: string
          salary_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "salary_book_details_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_book_details_salary_id_fkey"
            columns: ["salary_id"]
            isOneToOne: false
            referencedRelation: "salaries"
            referencedColumns: ["id"]
          },
        ]
      }
      student_books: {
        Row: {
          book_id: string
          enrollment_date: string | null
          id: string
          is_waitlisted: boolean | null
          student_id: string
        }
        Insert: {
          book_id: string
          enrollment_date?: string | null
          id?: string
          is_waitlisted?: boolean | null
          student_id: string
        }
        Update: {
          book_id?: string
          enrollment_date?: string | null
          id?: string
          is_waitlisted?: boolean | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_books_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          address: string | null
          contact_number: string
          created_at: string
          email: string | null
          father_name: string
          id: string
          is_active: boolean | null
          name: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          contact_number: string
          created_at?: string
          email?: string | null
          father_name: string
          id?: string
          is_active?: boolean | null
          name: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          contact_number?: string
          created_at?: string
          email?: string | null
          father_name?: string
          id?: string
          is_active?: boolean | null
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      teacher_books: {
        Row: {
          book_id: string
          id: string
          teacher_id: string
        }
        Insert: {
          book_id: string
          id?: string
          teacher_id: string
        }
        Update: {
          book_id?: string
          id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_books_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          address: string | null
          contact_number: string | null
          created_at: string
          date_of_joining: string | null
          email: string
          father_name: string | null
          id: string
          is_active: boolean | null
          name: string
          salary_amount: number | null
          salary_percentage: number | null
          salary_type: string | null
          specialization: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          contact_number?: string | null
          created_at?: string
          date_of_joining?: string | null
          email: string
          father_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          salary_amount?: number | null
          salary_percentage?: number | null
          salary_type?: string | null
          specialization?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          contact_number?: string | null
          created_at?: string
          date_of_joining?: string | null
          email?: string
          father_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          salary_amount?: number | null
          salary_percentage?: number | null
          salary_type?: string | null
          specialization?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_roles: {
        Args: {
          user_id: string
        }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_any_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      has_role: {
        Args: {
          user_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "student"
        | "teacher"
        | "finance"
        | "controller"
        | "admin"
        | "superadmin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
