"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { userApi } from '@/lib/api';
import { toast } from 'sonner';
import { TriangleAlert as AlertTriangle, Trash2, UserX, LogOut, Download, Shield, Loader as Loader2, Key, Eye, EyeOff } from 'lucide-react';
import authService from '@/lib/http/authService';
import { useSession } from 'next-auth/react';

const passwordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters')
});

type PasswordConfirmation = z.infer<typeof passwordSchema>;

export function AdvancedSettings() {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
 const { data: session } = useSession()

  const passwordForm = useForm<PasswordConfirmation>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: ''
    }
  });

  const handleLogout = async () => {
    setActionLoading('logout');
    try {
      const response = await authService.logout(session?.accessToken);
      if (response.success) {
        toast.success('Logged out successfully');
        // Redirect to login page
        window.location.href = '/login';
      }
    } catch (error) {
      toast.error('Failed to logout');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogoutAll = async () => {
    setActionLoading('logout-all');
    try {
      const response = await authService.logoutAll({},session?.accessToken);
      if (response.success) {
        toast.success('Logged out from all devices');
        // Redirect to login page
        window.location.href = '/login';
      }
    } catch (error) {
      toast.error('Failed to logout from all devices');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeactivateAccount = async (data: PasswordConfirmation) => {
    setActionLoading('deactivate');
    try {
      const response = await userApi.deactivateAccount(data.password);
      if (response.success) {
        toast.success('Account deactivated successfully');
        window.location.href = '/login';
      }
    } catch (error) {
      toast.error('Failed to deactivate account');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteAccount = async (data: PasswordConfirmation) => {
    setActionLoading('delete');
    try {
      const response = await userApi.deleteAccount(data.password);
      if (response.success) {
        toast.success('Account deleted successfully');
        window.location.href = '/';
      }
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setActionLoading(null);
    }
  };

  const exportData = async () => {
    setActionLoading('export');
    // Simulate data export
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success('Data export started. You will receive an email when ready.');
    setActionLoading(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Advanced Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage advanced account actions and data controls
        </p>
      </div>

      {/* Session Management */}
      <Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            Session Management
          </CardTitle>
          <CardDescription>
            Control your active sessions and sign out from devices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Sign Out</h3>
              <p className="text-sm text-muted-foreground">
                Sign out from this device only
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={actionLoading === 'logout'}
            >
              {actionLoading === 'logout' && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Sign Out
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Sign Out All Devices</h3>
              <p className="text-sm text-muted-foreground">
                Sign out from all devices and sessions
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={actionLoading === 'logout-all'}
                >
                  {actionLoading === 'logout-all' && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Sign Out All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sign Out All Devices?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will sign you out from all devices and sessions. 
                    You&apos;ll need to sign in again on all devices.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogoutAll}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Sign Out All Devices
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data Export
          </CardTitle>
          <CardDescription>
            Download a copy of your account data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Export Account Data</h3>
              <p className="text-sm text-muted-foreground">
                Download all your account data in JSON format
              </p>
            </div>
            <Button
              variant="outline"
              onClick={exportData}
              disabled={actionLoading === 'export'}
            >
              {actionLoading === 'export' && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-0 shadow-sm bg-red-50/70 dark:bg-red-950/20 backdrop-blur-sm border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-100">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-red-700 dark:text-red-200">
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Deactivate Account */}
          <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-white/50 dark:bg-red-950/10">
            <div>
              <h3 className="font-medium text-red-900 dark:text-red-100">Deactivate Account</h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                Temporarily disable your account. You can reactivate anytime.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <UserX className="w-4 h-4 mr-2" />
                  Deactivate
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Deactivate Account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your account will be temporarily disabled. You can reactivate 
                    it by signing in again. Enter your password to confirm.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                
                <form onSubmit={passwordForm.handleSubmit(handleDeactivateAccount)}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          {...passwordForm.register('password')}
                          placeholder="Enter your password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      {passwordForm.formState.errors.password && (
                        <p className="text-sm text-destructive">
                          {passwordForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <AlertDialogFooter className="mt-6">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                      type="submit"
                      disabled={actionLoading === 'deactivate'}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {actionLoading === 'deactivate' && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      Deactivate Account
                    </Button>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <Separator className="border-red-200 dark:border-red-800" />

          {/* Delete Account */}
          <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-white/50 dark:bg-red-950/10">
            <div>
              <h3 className="font-medium text-red-900 dark:text-red-100">Delete Account</h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                Permanently delete your account and all data. This cannot be undone.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="bg-red-700 hover:bg-red-800"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account Permanently?</AlertDialogTitle>
                  <AlertDialogDescription>
                    <strong>This action cannot be undone.</strong> This will permanently 
                    delete your account and remove all your data from our servers. 
                    Enter your password to confirm.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                
                <form onSubmit={passwordForm.handleSubmit(handleDeleteAccount)}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="delete-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="delete-password"
                          type={showPassword ? "text" : "password"}
                          {...passwordForm.register('password')}
                          placeholder="Enter your password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      {passwordForm.formState.errors.password && (
                        <p className="text-sm text-destructive">
                          {passwordForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-red-900 dark:text-red-100">
                            This will permanently:
                          </p>
                          <ul className="text-red-800 dark:text-red-200 mt-1 space-y-1">
                            <li>• Delete your account and profile</li>
                            <li>• Remove all your data and settings</li>
                            <li>• Cancel any active subscriptions</li>
                            <li>• Log you out from all devices</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <AlertDialogFooter className="mt-6">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                      type="submit"
                      disabled={actionLoading === 'delete'}
                      className="bg-red-700 text-white hover:bg-red-800"
                    >
                      {actionLoading === 'delete' && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      Delete Account Permanently
                    </Button>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}