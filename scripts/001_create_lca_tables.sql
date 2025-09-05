-- LCA Platform Database Schema
-- Create tables for Life Cycle Assessment data management

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  organization TEXT,
  role TEXT CHECK (role IN ('metallurgist', 'engineer', 'policymaker', 'auditor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table for LCA studies
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  metal_type TEXT NOT NULL CHECK (metal_type IN ('aluminium', 'copper', 'steel', 'zinc', 'other')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Raw data uploads table
CREATE TABLE IF NOT EXISTS public.data_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('csv', 'excel', 'json')),
  file_size INTEGER,
  upload_path TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Processed LCA data table
CREATE TABLE IF NOT EXISTS public.lca_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  upload_id UUID REFERENCES public.data_uploads(id),
  process_stage TEXT NOT NULL CHECK (process_stage IN ('extraction', 'processing', 'manufacturing', 'use', 'end_of_life')),
  material_input JSONB,
  energy_consumption DECIMAL(10,3),
  emissions_co2 DECIMAL(10,3),
  water_usage DECIMAL(10,3),
  waste_generated DECIMAL(10,3),
  recycled_content DECIMAL(5,2), -- percentage
  recyclability DECIMAL(5,2), -- percentage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table for generated assessments
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('summary', 'detailed', 'comparative')),
  content JSONB NOT NULL,
  pdf_path TEXT,
  digital_signature TEXT,
  generated_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lca_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for projects
CREATE POLICY "Users can view projects they created or are members of" ON public.projects
  FOR SELECT USING (
    auth.uid() = created_by OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'auditor')
    )
  );

CREATE POLICY "Users can create projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Project creators and admins can update projects" ON public.projects
  FOR UPDATE USING (
    auth.uid() = created_by OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'auditor')
    )
  );

-- RLS Policies for data_uploads
CREATE POLICY "Users can view uploads for their projects" ON public.data_uploads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_id AND (
        created_by = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role IN ('admin', 'auditor')
        )
      )
    )
  );

CREATE POLICY "Users can upload to their projects" ON public.data_uploads
  FOR INSERT WITH CHECK (
    auth.uid() = uploaded_by AND
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_id AND created_by = auth.uid()
    )
  );

-- RLS Policies for lca_data
CREATE POLICY "Users can view LCA data for their projects" ON public.lca_data
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_id AND (
        created_by = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role IN ('admin', 'auditor')
        )
      )
    )
  );

CREATE POLICY "Users can insert LCA data for their projects" ON public.lca_data
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_id AND created_by = auth.uid()
    )
  );

-- RLS Policies for reports
CREATE POLICY "Users can view reports for their projects" ON public.reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_id AND (
        created_by = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role IN ('admin', 'auditor')
        )
      )
    )
  );

CREATE POLICY "Users can generate reports for their projects" ON public.reports
  FOR INSERT WITH CHECK (
    auth.uid() = generated_by AND
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_id AND created_by = auth.uid()
    )
  );

-- RLS Policies for audit_logs (admin/auditor only)
CREATE POLICY "Admins and auditors can view audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'auditor')
    )
  );

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);
