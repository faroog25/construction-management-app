// This file contains functions to interact with the projects database

export interface Project {
  id: number;
  name: string;
  description: string | null;
  start_date: string;
  expected_end_date: string;
  actual_end_date: string | null;
  status: number;
  order_id: number | null;
  site_engineer_id: number | null;
  client_id: number | null;
  stage_id: number | null;
}

export interface ProjectWithClient {
  id: number;
  name: string;
  description: string | null;
  start_date: string;
  expected_end_date: string;
  actual_end_date: string | null;
  status: number;
  client_name?: string;
  stage_name?: string;
  progress: number; // Calculated based on tasks or stages
  site_engineer_id?: number | null;
}

// Mock data based on the database schema
const PROJECTS_DATA: ProjectWithClient[] = [
  {
    id: 1,
    name: 'West Heights Tower',
    description: 'Commercial high-rise building project in downtown',
    start_date: '2023-05-15',
    expected_end_date: '2023-09-30',
    actual_end_date: null,
    status: 1, // Active
    client_name: 'Skyline Properties',
    stage_name: 'Construction',
    progress: 75,
  },
  {
    id: 2,
    name: 'Riverside Office Complex',
    description: 'Modern office complex with riverside views',
    start_date: '2023-06-20',
    expected_end_date: '2023-11-15',
    actual_end_date: null,
    status: 1, // Active
    client_name: 'Metro Developments',
    stage_name: 'Foundation',
    progress: 45,
  },
  {
    id: 3,
    name: 'Heritage Park Renovation',
    description: 'Renovation of the historic Heritage Park',
    start_date: '2023-04-05',
    expected_end_date: '2023-08-10',
    actual_end_date: '2023-08-05',
    status: 2, // Completed
    client_name: 'City Council',
    stage_name: 'Completed',
    progress: 100,
  },
  {
    id: 4,
    name: 'Parkview Residential Complex',
    description: 'Residential complex with 200 apartment units',
    start_date: '2023-07-10',
    expected_end_date: '2023-12-05',
    actual_end_date: null,
    status: 3, // Pending
    client_name: 'Horizon Homes',
    stage_name: 'Planning',
    progress: 30,
  },
  {
    id: 5,
    name: 'Central Station Remodel',
    description: 'Complete remodeling of the Central Train Station',
    start_date: '2023-08-15',
    expected_end_date: '2024-01-22',
    actual_end_date: null,
    status: 1, // Active
    client_name: 'Transit Authority',
    stage_name: 'Design',
    progress: 15,
  },
  {
    id: 6,
    name: 'Oakwood Community Center',
    description: 'New community center for the Oakwood neighborhood',
    start_date: '2023-06-05',
    expected_end_date: '2023-10-18',
    actual_end_date: null,
    status: 1, // Active
    client_name: 'Community Foundation',
    stage_name: 'Framing',
    progress: 55,
  },
  {
    id: 7,
    name: 'Harbor View Hotel',
    description: 'Luxury hotel with harbor views and amenities',
    start_date: '2023-09-15',
    expected_end_date: '2024-03-05',
    actual_end_date: null,
    status: 3, // Pending
    client_name: 'Seaside Resorts',
    stage_name: 'Permitting',
    progress: 10,
  },
  {
    id: 8,
    name: 'Greenfield Shopping Mall',
    description: 'Modern shopping mall with 50 retail spaces',
    start_date: '2023-08-30',
    expected_end_date: '2024-02-12',
    actual_end_date: null,
    status: 1, // Active
    client_name: 'Retail Partners Inc.',
    stage_name: 'Site Preparation',
    progress: 25,
  },
  {
    id: 9,
    name: 'Sunnydale School Expansion',
    description: 'Expansion of Sunnydale Elementary School',
    start_date: '2023-03-10',
    expected_end_date: '2023-07-30',
    actual_end_date: '2023-07-25',
    status: 2, // Completed
    client_name: 'Education Department',
    stage_name: 'Completed',
    progress: 100,
  },
  {
    id: 10,
    name: 'Mountain View Apartments',
    description: 'Luxury apartment complex with mountain views',
    start_date: '2023-05-20',
    expected_end_date: '2023-09-15',
    actual_end_date: null,
    status: 4, // Delayed
    client_name: 'Highland Properties',
    stage_name: 'Interior Finishing',
    progress: 85,
  },
  {
    id: 11,
    name: 'Tech Hub Campus',
    description: 'Modern campus for tech startups and companies',
    start_date: '2023-10-01',
    expected_end_date: '2024-04-20',
    actual_end_date: null,
    status: 3, // Pending
    client_name: 'Innovation Partners',
    stage_name: 'Conceptual Design',
    progress: 5,
  },
  {
    id: 12,
    name: 'Riverside Park Bridge',
    description: 'New pedestrian bridge across Riverside Park',
    start_date: '2023-07-15',
    expected_end_date: '2023-12-28',
    actual_end_date: null,
    status: 1, // Active
    client_name: 'City Infrastructure',
    stage_name: 'Structural Work',
    progress: 60,
  },
];

// Function to get all projects
export const getProjects = async (): Promise<ProjectWithClient[]> => {
  // In a real app, this would be a fetch call to your API
  // Example: return await fetch('/api/projects').then(res => res.json());
  
  // For now, we'll return the mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(PROJECTS_DATA);
    }, 500); // Simulate network delay
  });
};

// Get projects filtered by status
export const getProjectsByStatus = async (statusCode: number): Promise<ProjectWithClient[]> => {
  // In a real app, this would be filtered on the server
  // For now, we'll filter the mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = PROJECTS_DATA.filter(project => project.status === statusCode);
      resolve(filtered);
    }, 500);
  });
};

// Get project details by ID
export const getProjectById = async (id: number): Promise<ProjectWithClient | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const project = PROJECTS_DATA.find(p => p.id === id);
      resolve(project);
    }, 500);
  });
};

// Utility to convert status code to string
export const getStatusFromCode = (statusCode: number): 'active' | 'completed' | 'pending' | 'delayed' => {
  switch (statusCode) {
    case 1:
      return 'active';
    case 2:
      return 'completed';
    case 3:
      return 'pending';
    case 4:
      return 'delayed';
    default:
      return 'active';
  }
};
