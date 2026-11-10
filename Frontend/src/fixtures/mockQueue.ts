import { ApprovalItem } from '../types/approvals';

export const MOCK_APPROVAL_QUEUE: ApprovalItem[] = [
  {
    id: 'appr-001',
    name: 'Site Patrol Onboarding & Checklists',
    folderPath: 'My Site Patrol > My Site Patrol Card > Site Patrol Onboarding & Checklists',
    type: 'Folder',
    submittedBy: 'Sam HelpAdmin',
    submittedDate: 'Sep 18',
    status: 'Pending Review',
    priority: 'HIGH',
    description:
      'Standard operating procedures, emergency drill protocols, and field technician check-in checklists for regional operations.',
    metadata: {
      fileSize: '4.2 MB',
      pageCount: 14,
    },
  },
  {
    id: 'appr-002',
    name: 'Level 2 Drone Patrol Video Demo',
    folderPath: 'Drawing-Videos > Drawing-Videos Card',
    type: 'Video',
    submittedBy: 'Alex HelpAdmin',
    submittedDate: 'Sep 18',
    status: 'Pending Review',
    priority: 'CRITICAL',
    description:
      'Aerial surveillance verification footage demonstrating automated perimeter patrol boundary sweep and geofence collision tests.',
    metadata: {
      fileSize: '184 MB',
      duration: '04:32 min',
      resolution: '4K UHD 60fps',
    },
  },
  {
    id: 'appr-003',
    name: 'Safety Equipment & Sensor Specs',
    folderPath: 'Site Recordings > Site Recordings Card',
    type: 'Pdf',
    submittedBy: 'Sam HelpAdmin',
    submittedDate: 'Sep 18',
    status: 'Pending Review',
    priority: 'MEDIUM',
    description:
      'Technical specification sheet for IoT vibration sensors, thermal optical relays, and field personal protective gear compliance certifications.',
    metadata: {
      fileSize: '1.8 MB',
      pageCount: 28,
    },
  },
  {
    id: 'appr-004',
    name: '360° Spatial Zone Layout & Camera Map',
    folderPath: 'Site Recordings > Site Recordings Card',
    type: 'Image',
    submittedBy: 'Elena HelpAdmin',
    submittedDate: 'Sep 18',
    status: 'Pending Review',
    priority: 'MEDIUM',
    description:
      'High-resolution panoramic CAD overlay showing CCTV camera blindness zones and LiDAR spatial coverage vectors across Zone 4.',
    metadata: {
      fileSize: '12.6 MB',
      resolution: '7680x4320 px',
    },
  },
];

