import { EquipmentItem } from '@/types/equipment';

// Update any "In Use" status to "Reserved"
export const equipmentItems: EquipmentItem[] = [
  {
    id: '1',
    name: 'Excavator',
    category: 'Heavy Equipment',
    description: 'A powerful excavator for digging and moving earth.',
    status: 'Available',
    imageUrl: '/images/equipment/excavator.jpeg',
    featured: true,
    purchaseDate: '2022-01-15',
  },
  {
    id: '2',
    name: 'Bulldozer',
    category: 'Heavy Equipment',
    description: 'A robust bulldozer for pushing large quantities of soil, sand, or debris.',
    status: 'Reserved',
    imageUrl: '/images/equipment/bulldozer.jpeg',
    featured: true,
    purchaseDate: '2021-11-01',
  },
  {
    id: '3',
    name: 'Crane',
    category: 'Heavy Equipment',
    description: 'A versatile crane for lifting and moving heavy materials.',
    status: 'Maintenance',
    imageUrl: '/images/equipment/crane.jpeg',
    featured: false,
    purchaseDate: '2022-05-20',
  },
  {
    id: '4',
    name: 'Concrete Mixer',
    category: 'Construction Equipment',
    description: 'A reliable concrete mixer for preparing concrete on-site.',
    status: 'Out of Service',
    imageUrl: '/images/equipment/concrete-mixer.jpeg',
    featured: false,
    purchaseDate: '2023-02-10',
  },
  {
    id: '5',
    name: 'Road Roller',
    category: 'Construction Equipment',
    description: 'An essential road roller for compacting soil, gravel, and asphalt.',
    status: 'Available',
    imageUrl: '/images/equipment/road-roller.jpeg',
    featured: true,
    purchaseDate: '2022-08-01',
  },
  {
    id: '6',
    name: 'Jackhammer',
    category: 'Power Tools',
    description: 'A powerful jackhammer for breaking up concrete and asphalt.',
    status: 'Available',
    imageUrl: '/images/equipment/jackhammer.jpeg',
    featured: false,
    purchaseDate: '2023-03-01',
  },
  {
    id: '7',
    name: 'Welding Machine',
    category: 'Power Tools',
    description: 'A versatile welding machine for joining metal pieces.',
    status: 'Reserved',
    imageUrl: '/images/equipment/welding-machine.jpeg',
    featured: false,
    purchaseDate: '2022-12-15',
  },
  {
    id: '8',
    name: 'Generator',
    category: 'Power Tools',
    description: 'A portable generator for providing electricity on-site.',
    status: 'Available',
    imageUrl: '/images/equipment/generator.jpeg',
    featured: true,
    purchaseDate: '2023-04-01',
  },
  {
    id: '9',
    name: 'Water Pump',
    category: 'Miscellaneous',
    description: 'A high-capacity water pump for removing water from construction sites.',
    status: 'Maintenance',
    imageUrl: '/images/equipment/water-pump.jpeg',
    featured: false,
    purchaseDate: '2022-09-01',
  },
  {
    id: '10',
    name: 'Scaffolding',
    category: 'Miscellaneous',
    description: 'A modular scaffolding system for providing access to high areas.',
    status: 'Available',
    imageUrl: '/images/equipment/scaffolding.jpeg',
    featured: false,
    purchaseDate: '2023-05-01',
  },
];
