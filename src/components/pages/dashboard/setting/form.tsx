"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Check,
  AlertCircle,
  Settings as SettingsIcon,
  Mail,
  Globe,
  CreditCard,
  Key,
  FileText,
  DollarSign,
  Shield,
  Layers,
  ChevronRight,
  Database,
  Link,
  Cloud,
  Server,

  Users,
  ToggleLeft,
  Bell,
  Building2,
  Smartphone,
  Lock,
} from "lucide-react";
import settingServices from "@/lib/http/settngsServices";
import { sitekey } from "@/config/setting";
import { cn } from "@/lib/utils/utils";

interface SettingField {
  key: string;
  label: string;
  type: string;
  value: any;
  disabled?: boolean;
  options?: string[];
  isConfigured?: boolean;
}

interface SettingSection {
  id: string;
  title: string;
  fields: SettingField[];
}

interface SettingsPageProps {
  settings?: any;
}

const sectionIcons: Record<string, any> = {
  // Core
  basic:          SettingsIcon,
  contact:        Mail,
  branding:       Globe,
  currency:       DollarSign,
  client:         Link,
  security:       Lock,
  // Email
  email:          Mail,
  email_fallback: Server,
  // Payments
  stripe:         CreditCard,
  paypal:         Layers,
  razorpay:       Shield,
  // Storage
  storage:        Database,
  storage_azure:  Cloud,
  storage_s3:     Cloud,
  storage_gcs:    Cloud,
  storage_r2:     Cloud,
  // Services
  twilio:         Smartphone,
  oauth:          Users,
  // Misc
  otp:            Key,
  business:       Building2,
  features:       ToggleLeft,
  notifications:  Bell,
  policies:       FileText,
};

export default function SettingsPage({ settings }: SettingsPageProps) {
  const { data: session } = useSession();
  const [tenants, setTenants] = useState<string[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string>(
    sitekey || settings?.siteKey || "my-store-001"
  );
  const [sections, setSections] = useState<SettingSection[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string>("basic");
  const [isLoadingTenants, setIsLoadingTenants] = useState(true);
  const [isLoadingSchema, setIsLoadingSchema] = useState(true);

  // Load tenants list
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setIsLoadingTenants(true);
        const res = await settingServices.listTenants(session?.accessToken);
        if (res.success && Array.isArray(res.data)) {
          setTenants(res.data);
          // If the current selected tenant is not in the list, we append it or select the first
          if (res.data.length > 0 && !res.data.includes(selectedTenant)) {
            setSelectedTenant(res.data[0]);
          }
        } else {
          setTenants([selectedTenant]);
        }
      } catch (err) {
        console.error("Failed to fetch tenants list", err);
        setTenants([selectedTenant]);
      } finally {
        setIsLoadingTenants(false);
      }
    };
    
    if (session?.accessToken) {
      fetchTenants();
    }
  }, [session?.accessToken]);

  // Load dynamic schema for selectedTenant
  useEffect(() => {
    const fetchSchema = async () => {
      try {
        setIsLoadingSchema(true);
        const res = await settingServices.getDynamicSchema(selectedTenant, session?.accessToken);
        if (res.success && Array.isArray(res.data)) {
          setSections(res.data);
          // Ensure activeSectionId exists in new schema, otherwise default to first
          if (res.data.length > 0) {
            const hasActive = res.data.some(s => s.id === activeSectionId);
            if (!hasActive) {
              setActiveSectionId(res.data[0].id);
            }
          }
        } else {
          toast.error("Failed to load settings schema");
        }
      } catch (err) {
        console.error("Failed to fetch settings schema", err);
        toast.error("Failed to load settings schema");
      } finally {
        setIsLoadingSchema(false);
      }
    };

    if (session?.accessToken && selectedTenant) {
      fetchSchema();
    }
  }, [selectedTenant, session?.accessToken]);

  const activeSection = sections.find((s) => s.id === activeSectionId);

  return (
    <div className="space-y-6">
      {/* Header and Tenant Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-card border border-border/60 rounded-xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Platform Settings</h1>
          <p className="text-muted-foreground text-sm">
            Configure settings for tenant settings dynamically at runtime.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Database className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Tenant:</span>
          {isLoadingTenants ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <Select
              value={selectedTenant}
              onValueChange={(val) => {
                setSelectedTenant(val);
                toast.info(`Switched to tenant: ${val}`);
              }}
            >
              <SelectTrigger className="w-[200px] bg-background">
                <SelectValue placeholder="Select Tenant" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {isLoadingSchema ? (
        <div className="flex flex-col md:flex-row gap-6 animate-pulse">
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-muted rounded-md" />
            ))}
          </div>
          <div className="flex-1 space-y-4">
            <div className="h-6 bg-muted rounded-md w-1/4" />
            <div className="h-4 bg-muted rounded-md w-2/3" />
            <div className="space-y-6 pt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted rounded-md w-1/5" />
                  <div className="h-10 bg-muted rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar for Tabs */}
          <div className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-border md:pr-4">
            {sections.map((section) => {
              const Icon = sectionIcons[section.id] || SettingsIcon;
              const isActive = activeSectionId === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSectionId(section.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all whitespace-nowrap w-full text-left",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{section.title}</span>
                  <ChevronRight className={cn("ml-auto h-4 w-4 hidden md:block opacity-60", isActive && "text-primary-foreground opacity-100")} />
                </button>
              );
            })}
          </div>
          
          {/* Right Content Area */}
          <div className="flex-1">
            <Card className="border border-border/80 shadow-md">
              <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  {activeSection ? (
                    <>
                      {(() => {
                        const Icon = sectionIcons[activeSection.id] || SettingsIcon;
                        return <Icon className="h-5 w-5 text-primary" />;
                      })()}
                      {activeSection.title}
                    </>
                  ) : (
                    "Settings Section"
                  )}
                </CardTitle>
                <CardDescription>
                  Configure fields for this category. Changes are auto-saved.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {activeSection && activeSection.fields.length > 0 ? (
                  <div className="space-y-6">
                    {activeSection.fields.map((field) => (
                      <FieldRow
                        key={field.key}
                        field={field}
                        selectedTenant={selectedTenant}
                        session={session}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No settings fields available in this section.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

interface FieldRowProps {
  field: SettingField;
  selectedTenant: string;
  session: any;
}

function FieldRow({ field, selectedTenant, session }: FieldRowProps) {
  const [val, setVal] = useState(field.value);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Keep local value in sync if schema changes (e.g. switching tenants)
  useEffect(() => {
    setVal(field.value);
    setStatus('idle');
    setErrorMsg('');
  }, [field.value]);

  const onSave = async (newVal: any) => {
    // If password and unchanged, skip
    if (field.type === 'password' && newVal === '••••••••') {
      return;
    }

    setStatus('saving');
    try {
      const res = await settingServices.updateField(
        selectedTenant,
        { key: field.key, value: newVal },
        session?.accessToken
      );
      if (res.success) {
        setStatus('saved');
        toast.success(`Saved "${field.label}" successfully`);
        // If it's a password and was saved, mask it
        if (field.type === 'password' && newVal !== '••••••••' && newVal !== '') {
          setVal('••••••••');
        }
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setErrorMsg(res.error || 'Failed to save');
        toast.error(`Error saving "${field.label}": ${res.error}`);
      }
    } catch (e: any) {
      setStatus('error');
      setErrorMsg(e.message || 'Error occurred');
      toast.error(`Error saving "${field.label}": ${e.message}`);
    }
  };

  const isSaving = status === 'saving';
  const isSaved = status === 'saved';
  const isError = status === 'error';

  return (
    <div className="space-y-2 pb-5 border-b border-border/40 last:border-0 last:pb-0">
      <div className="flex items-center justify-between">
        <Label htmlFor={field.key} className="text-sm font-semibold text-foreground">
          {field.label}
        </Label>
        <div className="flex items-center gap-1.5 text-xs">
          {isSaving && (
            <span className="flex items-center gap-1 text-muted-foreground animate-pulse">
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
              Saving...
            </span>
          )}
          {isSaved && (
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <Check className="h-3.5 w-3.5" />
              Saved
            </span>
          )}
          {isError && (
            <span className="flex items-center gap-1 text-destructive font-medium" title={errorMsg}>
              <AlertCircle className="h-3.5 w-3.5" />
              Failed
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        {field.type === 'boolean' ? (
          <div className="flex items-center h-10">
            <Switch
              id={field.key}
              checked={!!val}
              disabled={field.disabled || isSaving}
              onCheckedChange={(checked) => {
                setVal(checked);
                onSave(checked);
              }}
            />
          </div>
        ) : field.type === 'select' ? (
          <Select
            value={val || ''}
            disabled={field.disabled || isSaving}
            onValueChange={(selected) => {
              setVal(selected);
              onSave(selected);
            }}
          >
            <SelectTrigger className="w-full bg-background" id={field.key}>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : field.type === 'text' || field.type === 'textarea' ? (
          <Textarea
            id={field.key}
            value={val || ''}
            disabled={field.disabled || isSaving}
            onChange={(e) => setVal(e.target.value)}
            onBlur={() => {
              if (val !== field.value) {
                onSave(val);
              }
            }}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="min-h-[100px] bg-background"
          />
        ) : field.type === 'color' ? (
          <div className="flex gap-2 items-center">
            <Input
              id={field.key}
              type="color"
              value={val || '#000000'}
              disabled={field.disabled || isSaving}
              onChange={(e) => setVal(e.target.value)}
              onBlur={() => {
                if (val !== field.value) {
                  onSave(val);
                }
              }}
              className="w-12 h-10 p-1 border rounded-md cursor-pointer shrink-0"
            />
            <Input
              type="text"
              value={val || ''}
              disabled={field.disabled || isSaving}
              onChange={(e) => setVal(e.target.value)}
              onBlur={() => {
                if (val !== field.value) {
                  onSave(val);
                }
              }}
              className="bg-background font-mono"
              placeholder="#000000"
            />
          </div>
        ) : (
          // Default: 'string', 'number', 'password', 'url', and any unknown type → Input
          <Input
            id={field.key}
            type={
              field.type === 'password' ? 'password' :
              field.type === 'number'   ? 'number'   :
              field.type === 'url'      ? 'url'      :
              'text'
            }
            value={val === null || val === undefined ? '' : val}
            disabled={field.disabled || isSaving}
            onChange={(e) => setVal(e.target.value)}
            onBlur={() => {
              if (val !== field.value) {
                onSave(val);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (val !== field.value) {
                  onSave(val);
                }
              }
            }}
            autoComplete={field.type === 'password' ? 'new-password' : 'off'}
            placeholder={
              field.type === 'password'
                ? field.isConfigured
                  ? '••••••••'
                  : 'Enter password/secret'
                : `Enter ${field.label.toLowerCase()}`
            }
            className="bg-background"
          />
        )}
      </div>
    </div>
  );
}
