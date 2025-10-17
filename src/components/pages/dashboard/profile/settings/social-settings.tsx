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
import { useSocialConnections } from "@/hooks/use-user-settings";
import { format } from "date-fns";
import {
  Share2,
  Link,
  Unlink,
  CircleCheck as CheckCircle,
  Loader as Loader2,
  Github,
  Twitter,
  Facebook,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";

const socialProviders = {
  google: {
    name: "Google",
    icon: Mail,
    color: "bg-red-500 hover:bg-red-600",
    description: "Sign in with your Google account",
  },
  github: {
    name: "GitHub",
    icon: Github,
    color:
      "bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-800",
    description: "Connect your GitHub account",
  },
  facebook: {
    name: "Facebook",
    icon: Facebook,
    color: "bg-blue-600 hover:bg-blue-700",
    description: "Connect with Facebook",
  },
  twitter: {
    name: "Twitter",
    icon: Twitter,
    color: "bg-sky-500 hover:bg-sky-600",
    description: "Connect your Twitter account",
  },
};

export function SocialSettings() {
  const { connections, loading, connectSocial, disconnectSocial } =
    useSocialConnections();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  console.log(connections);

  const handleConnect = async (provider: string) => {
    setActionLoading(`connect-${provider}`);
    await connectSocial(provider);
    setActionLoading(null);
  };

  const handleDisconnect = async (provider: string) => {
    setActionLoading(`disconnect-${provider}`);
    await disconnectSocial(provider);
    setActionLoading(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Social Connections
        </h1>
        <p className="text-muted-foreground mt-2">
          Connect your social accounts for easier sign-in and sharing
        </p>
      </div>

      <Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Connected Accounts
          </CardTitle>
          <CardDescription>
            Manage your social login options and connected services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(socialProviders).map(
              ([providerId, provider], index) => {
                console.log(providerId, provider);

                const connection = connections.find(
                  (c) => c.provider === providerId
                );
                const isConnected = connection?.verified || false;
                const Icon = provider.icon;

                return (
                  <motion.div
                    key={providerId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-white",
                            provider.color
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{provider.name}</h3>
                            {isConnected && (
                              <Badge variant="default" className="text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Connected
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {provider.description}
                          </p>
                          {isConnected && connection?.email && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Connected as {connection.email}
                              {connection.connectedAt && (
                                <>
                                  {" "}
                                  • Connected{" "}
                                  {format(
                                    new Date(connection.connectedAt),
                                    "MMM dd, yyyy hh:mm:ss a"
                                  )}
                                </>
                              )}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        {isConnected ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                disabled={
                                  actionLoading === `disconnect-${providerId}`
                                }
                              >
                                {actionLoading ===
                                `disconnect-${providerId}` ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <Unlink className="w-4 h-4 mr-2" />
                                )}
                                Disconnect
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Disconnect {provider.name}?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove {provider.name} as a sign-in
                                  option for your account. You can reconnect it
                                  anytime.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDisconnect(providerId)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Disconnect
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <Button
                            size="sm"
                            disabled={actionLoading === `connect-${providerId}`}
                            onClick={() => handleConnect(providerId)}
                          >
                            {actionLoading === `connect-${providerId}` ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Link className="w-4 h-4 mr-2" />
                            )}
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>

                    {index < Object.keys(socialProviders).length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </motion.div>
                );
              }
            )}
          </div>
        </CardContent>
      </Card>

      {/* Connected Account Benefits */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50/70 to-indigo-50/70 dark:from-blue-950/20 dark:to-indigo-950/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-blue-900 dark:text-blue-100">
                Benefits of Connected Accounts
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Faster sign-in without entering passwords</li>
                <li>• Automatic profile information sync</li>
                <li>• Enhanced security with OAuth authentication</li>
                <li>• Easy account recovery options</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
