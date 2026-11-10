export interface PolicyChunk {
  chunkId: string;
  sectionTitle: string;
  keywords: string[];
  content: string;
}

/**
 * Operational Approvals Policy Document (320 words).
 * Serves as the grounded in-memory RAG corpus for the "Help me" feature.
 */
export const OPERATIONAL_POLICY_CHUNKS: PolicyChunk[] = [
  {
    chunkId: 'policy-sec-1',
    sectionTitle: 'Section 1: General Approval Authority & SLAs',
    keywords: ['authority', 'sla', 'turnaround', 'hours', 'rejection', 'final', 'deadline'],
    content:
      'All pending submissions within the OomniEye Command Centre must be acted upon within a 24-hour operational window. Approvals and rejections submitted by Help Admin or Senior Operators are final and directly synchronise with digital-twin edge controllers. Incomplete submissions must be rejected with detailed revision notes rather than placed on hold.',
  },
  {
    chunkId: 'policy-sec-2',
    sectionTitle: 'Section 2: Aerial & Drone Patrol Surveillance Standards',
    keywords: ['drone', 'video', 'aerial', 'flight', 'critical', 'geofence', 'safety', 'collision'],
    content:
      'Level 2 Drone Patrol Video submissions are designated CRITICAL priority. Operators must verify continuous optical feed integrity, altitude compliance under 120m AGL, and absence of active geofence breaches. If telemetry shows safety margins under 5 meters from live infrastructure, approval must be withheld until manual flight logs are verified.',
  },
  {
    chunkId: 'policy-sec-3',
    sectionTitle: 'Section 3: Sensor Specifications & Safety Equipment Sign-Off',
    keywords: ['sensor', 'specs', 'pdf', 'safety', 'iot', 'vibration', 'calibration', 'certification'],
    content:
      'Safety equipment and IoT sensor technical specifications require dual validation: verify ISO-9001/ATEX explosive atmosphere certifications and calibration timestamps within the last 180 days. Sensor accuracy tolerances exceeding +/- 2.5% must be flagged for vendor recalibration prior to operational commissioning.',
  },
  {
    chunkId: 'policy-sec-4',
    sectionTitle: 'Section 4: Spatial Zone Layouts & CCTV Blindness Mitigation',
    keywords: ['spatial', 'zone', 'camera', 'map', 'image', 'blindness', 'cctv', 'lidar', 'coverage'],
    content:
      'When reviewing 360-degree spatial layout blueprints and camera map overlays, operators must confirm zero camera blindness along primary emergency ingress and egress paths. LiDAR spatial coverage must achieve 98% overlap across high-density zone intersections. Discrepancies must be escalated to the Spatial Mapping Lead.',
  },
];

