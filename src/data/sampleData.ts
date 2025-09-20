import { Email, Folder } from '@/types/email';

export const sampleFolders: Folder[] = [
  { id: 'inbox', name: 'Inbox', count: 12 },
  { id: 'sent', name: 'Sent', count: 0 },
  { id: 'drafts', name: 'Drafts', count: 3 },
  { id: 'spam', name: 'Spam', count: 2 },
  { id: 'archive', name: 'Archive', count: 0 },
  { id: 'starred', name: 'Starred', count: 5 },
];

export const sampleEmails: Email[] = [
  {
    id: '1',
    sender: 'john.doe@company.com',
    subject: 'Project Update - Q4 Roadmap',
    preview: 'Hi team, I wanted to share the latest updates on our Q4 roadmap and discuss upcoming milestones...',
    content: `Hi team,

I wanted to share the latest updates on our Q4 roadmap and discuss upcoming milestones.

We've made significant progress on the following initiatives:
• User authentication system - 90% complete
• Email service integration - 75% complete
• Dashboard redesign - 60% complete

Next steps:
1. Complete the email service by end of this week
2. Begin user testing for the dashboard
3. Prepare for the December release

Please review the attached documents and let me know if you have any questions.

Best regards,
John`,
    timestamp: new Date('2024-01-15T10:30:00'),
    isRead: false,
    isStarred: true,
    isSent: false,
    isDraft: false,
    isArchived: false,
    isSpam: false,
    attachments: [
      {
        id: '1',
        name: 'Q4-Roadmap.pdf',
        size: '2.4 MB',
        type: 'application/pdf',
        url: '#'
      }
    ],
    labels: ['work', 'important']
  },
  {
    id: '2',
    sender: 'sarah.wilson@design.co',
    subject: 'New Design Assets Available',
    preview: 'The latest design assets for the email client are ready for review. I have included both light and dark themes...',
    content: `Hello!

The latest design assets for the email client are ready for review. I have included both light and dark themes as requested.

Key updates:
- Refined color palette for better accessibility
- New iconography for better visual hierarchy  
- Improved spacing and typography
- Mobile-responsive layouts

Please download the assets from the link below and let me know your feedback.

Thanks!
Sarah`,
    timestamp: new Date('2024-01-15T09:15:00'),
    isRead: true,
    isStarred: false,
    isSent: false,
    isDraft: false,
    isArchived: false,
    isSpam: false,
    attachments: [
      {
        id: '2',
        name: 'design-assets.zip',
        size: '15.7 MB',
        type: 'application/zip',
        url: '#'
      },
      {
        id: '3',
        name: 'preview.jpg',
        size: '1.2 MB',
        type: 'image/jpeg',
        url: '#'
      }
    ],
    labels: ['design', 'review', 'important']
  },
  {
    id: '3',
    sender: 'notifications@github.com',
    subject: '[GitHub] Pull Request #247 - Email Service Integration',
    preview: 'Mike Johnson has requested your review on Pull Request #247. The changes include socket integration and real-time updates...',
    content: `Hi there,

Mike Johnson has requested your review on Pull Request #247.

Changes include:
- Socket integration for real-time email updates
- New email composition modal
- Improved error handling
- Updated unit tests

View the pull request: https://github.com/company/email-client/pull/247

Thanks,
GitHub Team`,
    timestamp: new Date('2024-01-15T08:45:00'),
    isRead: true,
    isStarred: false,
    isSent: false,
    isDraft: false,
    isArchived: false,
    isSpam: false,
    attachments: [],
    labels: ['github', 'code-review']
  },
  {
    id: '4',
    sender: 'marketing@newsletter.com',
    subject: 'Weekly Tech Newsletter - AI and Development Trends',
    preview: 'This week: Latest AI developments, new JavaScript frameworks, and industry insights from leading developers...',
    content: `Welcome to this week's tech newsletter!

This week's highlights:
🤖 AI developments in software engineering
⚡ New JavaScript frameworks to watch
📱 Mobile development trends
🔐 Security best practices

Featured articles:
1. "The Future of AI in Code Generation"
2. "Building Scalable Email Services"
3. "Modern CSS Techniques for 2024"

Read more at: newsletter.com/weekly

Unsubscribe anytime.`,
    timestamp: new Date('2024-01-14T16:00:00'),
    isRead: false,
    isStarred: false,
    isSent: false,
    isDraft: false,
    isArchived: false,
    isSpam: false,
    attachments: [],
    labels: ['newsletter']
  },
  {
    id: '5',
    sender: 'spam@suspicious.com',
    subject: '🎉 You have won $1,000,000! Claim now!',
    preview: 'Congratulations! You have been selected as our lucky winner. Click here to claim your prize immediately...',
    content: `CONGRATULATIONS!!!

You have been selected as our lucky winner in our international lottery!

Prize amount: $1,000,000 USD

To claim your prize:
1. Click the link below
2. Enter your personal information
3. Pay the processing fee of $500

This offer expires in 24 hours!

[SUSPICIOUS LINK REMOVED]`,
    timestamp: new Date('2024-01-14T12:30:00'),
    isRead: false,
    isStarred: false,
    isSent: false,
    isDraft: false,
    isArchived: false,
    isSpam: true,
    attachments: [],
    labels: ['spam', 'scam']
  },
  {
    id: '6',
    sender: 'ceo@company.com',
    subject: 'Urgent: Q4 Budget Review Meeting',
    preview: 'We need to schedule an urgent meeting to review the Q4 budget allocations and discuss the upcoming changes...',
    content: `Team,

I hope this email finds you well. We need to schedule an urgent meeting to review our Q4 budget allocations.

Key topics to discuss:
- Budget reallocation for new projects
- Resource planning for next quarter
- Cost optimization strategies
- Investment priorities

Please confirm your availability for tomorrow at 2 PM.

Best regards,
CEO`,
    timestamp: new Date('2024-01-15T11:30:00'),
    isRead: false,
    isStarred: true,
    isSent: false,
    isDraft: false,
    isArchived: false,
    isSpam: false,
    attachments: [],
    labels: ['urgent', 'meeting', 'budget']
  },
  {
    id: '7',
    sender: 'hr@company.com',
    subject: 'Employee Benefits Update - Action Required',
    preview: 'Important updates to your employee benefits package. Please review and confirm your selections by Friday...',
    content: `Dear Team Member,

We are pleased to announce updates to our employee benefits package for the upcoming year.

New benefits include:
- Enhanced health insurance coverage
- Increased vacation days
- Professional development budget
- Remote work stipend
- Mental health support programs

Please log into the HR portal to review and confirm your benefit selections by this Friday.

If you have any questions, please don't hesitate to reach out.

Best regards,
HR Team`,
    timestamp: new Date('2024-01-14T14:20:00'),
    isRead: true,
    isStarred: false,
    isSent: false,
    isDraft: false,
    isArchived: false,
    isSpam: false,
    attachments: [
      {
        id: '4',
        name: 'benefits-guide-2024.pdf',
        size: '3.2 MB',
        type: 'application/pdf',
        url: '#'
      }
    ],
    labels: ['hr', 'benefits', 'action-required']
  }
];