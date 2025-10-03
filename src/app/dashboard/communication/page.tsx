"use client";
import { useState, useEffect, Suspense } from "react";
import { Moon, Sun, Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PrivateLayout from "@/components/layout/dashboard";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
import NotificationsPanel from "@/components/pages/dashboard/communications/notifications/notifications-panel";
import { EmailClient } from "@/components/pages/dashboard/email/EmailClient";
import MessagingPanel from "@/components/pages/dashboard/communications/messaging/messaging-panel";

const Page = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <PrivateLayout>
      <div className=" mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <Breadcrumbs
            heading={"Communication Center"}
            btn={{ show: false }}
          ></Breadcrumbs>

          <div className="rounded-md  shadow-sm overflow-auto ">
            <Tabs defaultValue="notifications" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
                <TabsTrigger
                  value="notifications"
                  className="flex items-center gap-2"
                >
                  <Bell size={16} />
                  Notifications
                </TabsTrigger>
                <TabsTrigger
                  value="messaging"
                  className="flex items-center gap-2"
                >
                  <MessageSquare size={16} />
                  Messaging
                </TabsTrigger>
                  <TabsTrigger
                  value="email"
                  className="flex items-center gap-2"
                >
                  <MessageSquare size={16} />
                  Email
                </TabsTrigger>
              </TabsList>

              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  {/* <CardHeader>
                    <CardTitle>Notification Center</CardTitle>
                    <CardDescription>
                      Stay updated with real-time notifications and alerts
                    </CardDescription>
                  </CardHeader> */}
                  <CardContent>
                    <NotificationsPanel />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="messaging" className="space-y-4">
                <Card>
                  {/* <CardHeader>
                    <CardTitle>Messages</CardTitle>
                    <CardDescription>
                      Real-time conversations and chat management
                    </CardDescription>
                  </CardHeader> */}
                  <CardContent className="p-0">
                    <MessagingPanel />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="email" className="space-y-4">
                <Card>
                  {/* <CardHeader>
                    <CardTitle>Main Box</CardTitle>
                    <CardDescription>
                      Real-time Email management
                    </CardDescription>
                  </CardHeader> */}
                  <CardContent className="p-0">
                    <EmailClient></EmailClient>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </Suspense>
      </div>
    </PrivateLayout>
  );
};

export default Page;
