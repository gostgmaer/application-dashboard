"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useActivityLogs } from '@/hooks/use-user-settings';
import { format } from 'date-fns';
import { Activity, Shield, Download, Trash2, ChevronLeft, ChevronRight, Loader as Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

const ITEMS_PER_PAGE = 10;

export function ActivitySettings() {
  const {
    activityLogs,
    securityLogs,
    activityTotal,
    securityTotal,
    activityLoading,
    securityLoading,
    fetchActivityLogs,
    fetchSecurityLogs
  } = useActivityLogs();

  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('activity');

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (activeTab === 'activity') {
      fetchActivityLogs(page);
    } else {
      fetchSecurityLogs(page);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const renderPagination = (total: number) => {
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} entries
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity & Logs</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your account activity and security events
        </p>
      </div>

      <Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Account Logs</CardTitle>
              <CardDescription>
                View and manage your account activity history
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Logs
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Activity Logs
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-4">
              {activityLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Action</TableHead>
                          <TableHead>Device / IP</TableHead>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activityLogs.map((log, index) => (
                          <motion.tr
                            key={log.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-muted/50"
                          >
                            <TableCell className="font-medium">{log.action}</TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm">{log.device}</p>
                                <p className="text-xs text-muted-foreground">{log.ip}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm')}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary"
                                className={cn(
                                  "capitalize",
                                  getStatusColor(log.status)
                                )}
                              >
                                {log.status}
                              </Badge>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {renderPagination(activityTotal)}
                </>
              )}
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              {securityLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Action</TableHead>
                          <TableHead>Device / IP</TableHead>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {securityLogs.map((log, index) => (
                          <motion.tr
                            key={log.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-muted/50"
                          >
                            <TableCell className="font-medium">{log.action}</TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm">{log.device}</p>
                                <p className="text-xs text-muted-foreground">{log.ip}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm')}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary"
                                className={cn(
                                  "capitalize",
                                  getStatusColor(log.status)
                                )}
                              >
                                {log.status}
                              </Badge>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {renderPagination(securityTotal)}
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}