'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  X, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Building, 
  Star,
  Edit,
  Trash2,
  Users,
  UserPlus
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  avatar?: string;
  isStarred: boolean;
  tags: string[];
}

interface ContactsModalProps {
  onClose: () => void;
}

const sampleContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@design.co',
    phone: '+1 (555) 123-4567',
    company: 'Design Co',
    isStarred: true,
    tags: ['colleague', 'designer']
  },
  {
    id: '2',
    name: 'Mike Johnson',
    email: 'mike.johnson@tech.com',
    phone: '+1 (555) 987-6543',
    company: 'Tech Corp',
    isStarred: false,
    tags: ['developer', 'team-lead']
  },
  {
    id: '3',
    name: 'Emily Chen',
    email: 'emily.chen@startup.io',
    company: 'Startup Inc',
    isStarred: true,
    tags: ['client', 'important']
  }
];

export function ContactsModal({ onClose }: ContactsModalProps) {
  const [contacts, setContacts] = useState<Contact[]>(sampleContacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    tags: ''
  });

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const starredContacts = filteredContacts.filter(contact => contact.isStarred);
  const allContacts = filteredContacts;

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.email) return;

    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone || undefined,
      company: newContact.company || undefined,
      isStarred: false,
      tags: newContact.tags ? newContact.tags.split(',').map(tag => tag.trim()) : []
    };

    setContacts([...contacts, contact]);
    setNewContact({ name: '', email: '', phone: '', company: '', tags: '' });
    setIsAddingContact(false);
  };

  const toggleStar = (contactId: string) => {
    setContacts(contacts.map(contact =>
      contact.id === contactId ? { ...contact, isStarred: !contact.isStarred } : contact
    ));
  };

  const ContactCard = ({ contact }: { contact: Contact }) => (
    <div 
      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
      onClick={() => setSelectedContact(contact)}
    >
      <div className="flex items-start space-x-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(contact.name)}`}>
          {getAvatarInitials(contact.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {contact.name}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleStar(contact.id);
              }}
            >
              <Star className={`w-4 h-4 ${contact.isStarred ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
            </Button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {contact.email}
          </p>
          {contact.company && (
            <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
              {contact.company}
            </p>
          )}
          {contact.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {contact.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contacts</h2>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsAddingContact(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Contacts List */}
          <div className="w-1/2 border-r border-gray-200 dark:border-gray-700">
            {/* Search */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="flex-1">
              <TabsList className="w-full rounded-none border-b border-gray-200 dark:border-gray-700">
                <TabsTrigger value="all" className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>All ({allContacts.length})</span>
                </TabsTrigger>
                <TabsTrigger value="starred" className="flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>Starred ({starredContacts.length})</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="p-4 space-y-3 overflow-y-auto h-[400px]">
                {allContacts.map(contact => (
                  <ContactCard key={contact.id} contact={contact} />
                ))}
              </TabsContent>

              <TabsContent value="starred" className="p-4 space-y-3 overflow-y-auto h-[400px]">
                {starredContacts.map(contact => (
                  <ContactCard key={contact.id} contact={contact} />
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Contact Detail / Add Form */}
          <div className="w-1/2 p-6">
            {isAddingContact ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add New Contact</h3>
                  <Button variant="ghost" size="sm" onClick={() => setIsAddingContact(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={newContact.name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={newContact.company}
                    onChange={(e) => setNewContact(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Enter company name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={newContact.tags}
                    onChange={(e) => setNewContact(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="Enter tags separated by commas"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={handleAddContact}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!newContact.name || !newContact.email}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Contact
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingContact(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : selectedContact ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-medium ${getAvatarColor(selectedContact.name)}`}>
                      {getAvatarInitials(selectedContact.name)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {selectedContact.name}
                      </h3>
                      {selectedContact.company && (
                        <p className="text-gray-600 dark:text-gray-400">
                          {selectedContact.company}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-900 dark:text-white">{selectedContact.email}</p>
                    </div>
                  </div>

                  {selectedContact.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="text-gray-900 dark:text-white">{selectedContact.phone}</p>
                      </div>
                    </div>
                  )}

                  {selectedContact.company && (
                    <div className="flex items-center space-x-3">
                      <Building className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                        <p className="text-gray-900 dark:text-white">{selectedContact.company}</p>
                      </div>
                    </div>
                  )}

                  {selectedContact.tags.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedContact.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a contact to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}