"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { EmailList } from "./EmailList";
import { EmailDetail } from "./EmailDetail";
import { ComposeModal } from "./ComposeModal";
import { SearchBar } from "./SearchBar";
import { SettingsModal } from "./SettingsModal";
import { ContactsModal } from "./ContactsModal";
import { CalendarModal } from "./CalendarModal";
import { NotificationCenter } from "./NotificationCenter";
import { useSocket } from "@/contexts/NotificationContext";
import { Email, Folder } from "@/types/email";
import { sampleEmails, sampleFolders } from "@/data/sampleData";

export function EmailClient() {
  const [selectedFolder, setSelectedFolder] = useState<Folder>(
    sampleFolders[0]
  );
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [emails, setEmails] = useState<Email[]>(sampleEmails);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmails, setFilteredEmails] = useState<Email[]>(sampleEmails);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "sender" | "subject">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [notifications, setNotifications] = useState<any[]>([]);

  const { socket } = useSocket();

  // Filter emails based on folder and search
  useEffect(() => {
    let filtered = emails.filter((email) => {
      const matchesFolder =
        selectedFolder.id === "inbox"
          ? !email.isArchived && !email.isSpam
          : selectedFolder.id === "sent"
          ? email.isSent
          : selectedFolder.id === "drafts"
          ? email.isDraft
          : selectedFolder.id === "spam"
          ? email.isSpam
          : selectedFolder.id === "archive"
          ? email.isArchived
          : true;

      const matchesSearch =
        searchQuery === "" ||
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.preview.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFolder && matchesSearch;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison =
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case "sender":
          comparison = a.sender.localeCompare(b.sender);
          break;
        case "subject":
          comparison = a.subject.localeCompare(b.subject);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredEmails(filtered);
  }, [emails, selectedFolder, searchQuery, sortBy, sortOrder]);

  // Socket integration for real-time updates
  useEffect(() => {
    if (socket) {
      socket.on("new-email", (newEmail: Email) => {
        setEmails((prev) => [newEmail, ...prev]);
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: "new-email",
            title: "New Email",
            message: `From ${newEmail.sender}: ${newEmail.subject}`,
            timestamp: new Date(),
          },
        ]);
      });

      socket.on("email-read", (emailId: string) => {
        setEmails((prev) =>
          prev.map((email) =>
            email.id === emailId ? { ...email, isRead: true } : email
          )
        );
      });

      socket.on("email-deleted", (emailId: string) => {
        setEmails((prev) => prev.filter((email) => email.id !== emailId));
      });

      return () => {
        socket.off("new-email");
        socket.off("email-read");
        socket.off("email-deleted");
      };
    }
  }, [socket]);

  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
    if (!email.isRead) {
      setEmails((prev) =>
        prev.map((e) => (e.id === email.id ? { ...e, isRead: true } : e))
      );
      socket?.emit("mark-read", email.id);
    }
  };

  const handleBulkAction = (
    action: "delete" | "archive" | "markRead" | "markUnread" | "star"
  ) => {
    setEmails((prev) =>
      prev.map((email) => {
        if (selectedEmails.includes(email.id)) {
          switch (action) {
            case "delete":
              return { ...email, isArchived: true };
            case "archive":
              return { ...email, isArchived: true };
            case "markRead":
              return { ...email, isRead: true };
            case "markUnread":
              return { ...email, isRead: false };
            case "star":
              return { ...email, isStarred: !email.isStarred };
            default:
              return email;
          }
        }
        return email;
      })
    );
    setSelectedEmails([]);
  };

  const handleSendEmail = (emailData: Partial<Email>) => {
    const newEmail: Email = {
      id: Date.now().toString(),
      sender: "you@company.com",
      subject: emailData.subject || "",
      preview: emailData.content?.substring(0, 100) || "",
      content: emailData.content || "",
      timestamp: new Date(),
      isRead: true,
      isStarred: false,
      isSent: true,
      isDraft: false,
      isArchived: false,
      isSpam: false,
      attachments: emailData.attachments || [],
      labels: emailData.labels || [],
    };

    setEmails((prev) => [newEmail, ...prev]);
    socket?.emit("send-email", newEmail);
    setIsComposeOpen(false);
  };

  return (
    <div className={`flex h-screen`}>
      <div className="flex w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Notification Center */}
      

        {/* Sidebar */}
        <Sidebar
          folders={sampleFolders}
          selectedFolder={selectedFolder}
          onFolderSelect={setSelectedFolder}
          onComposeClick={() => setIsComposeOpen(true)}
          onSettingsClick={() => setIsSettingsOpen(true)}
          onContactsClick={() => setIsContactsOpen(true)}
          onCalendarClick={() => setIsCalendarOpen(true)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Email List */}
          <div
            className={`${
              selectedEmail ? "w-96" : "flex-1"
            } flex flex-col border-r border-gray-200 dark:border-gray-700 transition-all duration-300`}
          >
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              notifications={notifications}
              setNotifications={setNotifications}
              emailCount={filteredEmails.length}
              folderName={selectedFolder.name}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={(sort, order) => {
                setSortBy(sort);
                setSortOrder(order);
              }}
              selectedCount={selectedEmails.length}
              onBulkAction={handleBulkAction}
            />
            <EmailList
              emails={filteredEmails}
              selectedEmail={selectedEmail}
              onEmailSelect={handleEmailSelect}
              selectedEmails={selectedEmails}
              onEmailSelectionChange={setSelectedEmails}
            />
          </div>

          {/* Email Detail */}
          {selectedEmail && (
            <div className="flex-1">
              <EmailDetail
                email={selectedEmail}
                onClose={() => setSelectedEmail(null)}
                onReply={() => setIsComposeOpen(true)}
                onDelete={() => {
                  setEmails((prev) =>
                    prev.filter((e) => e.id !== selectedEmail.id)
                  );
                  setSelectedEmail(null);
                }}
                onArchive={() => {
                  setEmails((prev) =>
                    prev.map((e) =>
                      e.id === selectedEmail.id ? { ...e, isArchived: true } : e
                    )
                  );
                  setSelectedEmail(null);
                }}
              />
            </div>
          )}
        </div>

        {/* Compose Modal */}
        {isComposeOpen && (
          <ComposeModal
            onClose={() => setIsComposeOpen(false)}
            onSend={handleSendEmail}
          />
        )}

        {/* Settings Modal */}
        {isSettingsOpen && (
          <SettingsModal onClose={() => setIsSettingsOpen(false)} />
        )}

        {/* Contacts Modal */}
        {isContactsOpen && (
          <ContactsModal onClose={() => setIsContactsOpen(false)} />
        )}

        {/* Calendar Modal */}
        {isCalendarOpen && (
          <CalendarModal onClose={() => setIsCalendarOpen(false)} />
        )}
      </div>
    </div>
  );
}
