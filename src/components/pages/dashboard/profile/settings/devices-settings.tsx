"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDevices } from "@/hooks/use-user-settings";
import { format } from "date-fns";
import {
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  LogOut,
  Shield,
  Clock,
  Globe,
  Loader as Loader2,
  TriangleAlert as AlertTriangle,
} from "lucide-react";
import { useApiSWR } from "@/hooks/useApiSWR";
import { useSession } from "next-auth/react";

const getDeviceIcon = (device: string) => {
  const deviceLower = device.toLowerCase();
  if (
    deviceLower.includes("mobile") ||
    deviceLower.includes("iphone") ||
    deviceLower.includes("android")
  ) {
    return Smartphone;
  }
  if (deviceLower.includes("tablet") || deviceLower.includes("ipad")) {
    return Tablet;
  }
  return Monitor;
};

export function DevicesSettings() {
  const { data: session } = useSession();
  const { logoutDevice, logoutAllDevices, updateDeviceTrust } = useDevices();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const {
    data: devices,
    error,
    isLoading,
    mutate,
  } = useApiSWR(
    "/auth/known-devices",
    session?.accessToken,
    undefined,
    undefined,
    undefined
  );

  const handleLogoutDevice = async (deviceId: string) => {
    setActionLoading(deviceId);
    await logoutDevice(deviceId);
    setActionLoading(null);
  };

  const handleLogoutAll = async () => {
    setActionLoading("logout-all");
    await logoutAllDevices();
    setActionLoading(null);
  };

  const handleTrustToggle = async (deviceId: string, trusted: boolean) => {
    await updateDeviceTrust(deviceId, trusted);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trusted Devices</h1>
        <p className="text-muted-foreground mt-2">
          Manage devices that have access to your account
        </p>
      </div>

      <Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Devices currently signed in to your account
              </CardDescription>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout All Devices
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Logout All Devices?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will sign you out of all devices except the current
                    one. You&apos;ll need to sign in again on other devices.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogoutAll}
                    disabled={actionLoading === "logout-all"}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {actionLoading === "logout-all" && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Logout All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {devices?.result.map((device: any, index: number) => {
              const DeviceIcon = getDeviceIcon(device.name);

              return (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`border-2 transition-colors ${
                      device.current
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <DeviceIcon className="w-6 h-6" />
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{device.name}</h3>
                                {device.current && (
                                  <Badge variant="default" className="text-xs">
                                    Current Device
                                  </Badge>
                                )}
                                {device.isTrusted && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    <Shield className="w-3 h-3 mr-1" />
                                    Trusted
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {device.os} • {device.browser}
                              </p>
                            </div>

                            {!device.current && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={actionLoading === device.id}
                                  >
                                    {actionLoading === device.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <LogOut className="w-4 h-4" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Logout Device?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will sign out &quot;{device.name}
                                      &quot; and require re-authentication to
                                      access your account from this device.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleLogoutDevice(device.id)
                                      }
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Logout Device
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Globe className="w-4 h-4" />
                              <span>{device.ip}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{JSON.stringify(device.location)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>
                                Last seen{" "}
                                {format(
                                  new Date(device.lastSeen),
                                  "MMM dd, HH:mm"
                                )}
                              </span>
                            </div>
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                Trusted Device
                              </span>
                              <p className="text-xs text-muted-foreground ml-2">
                                Skip 2FA on this device
                              </p>
                            </div>
                            <Switch
                              checked={device.trusted}
                              onCheckedChange={(checked) =>
                                handleTrustToggle(device.deviceId, checked)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-0 shadow-sm bg-amber-50/70 dark:bg-amber-900/10 backdrop-blur-sm border-amber-200 dark:border-amber-800">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-medium text-amber-900 dark:text-amber-100">
                Security Reminder
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                If you notice any unfamiliar devices, logout immediately and
                change your password. Only mark devices as trusted if you
                regularly use them from secure locations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
