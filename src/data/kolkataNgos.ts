export type Ngo = {
  id: string;
  name: string;
  description: string;
  address: string;
  areaHint?: string;
  phone?: string;
  email?: string;
  website?: string;
  location: { lat: number; lng: number };
  tags: string[];
};

// Notes:
// - Coordinates are approximate (used for sorting by distance).
// - Contact details are intended to be user-facing; please verify before production.
export const KOLKATA_NGOS: Ngo[] = [
  {
    id: "arc-kolkata",
    name: "Animal Rescue & Care (ARC) Kolkata",
    description:
      "Rescue, ambulance, treatment, sheltering and sterilization support for distressed street animals.",
    address: "11/4, Jyotirmoy Nagar, Thakurpukur, Kolkata – 700063",
    areaHint: "Thakurpukur",
    phone: "+917890535353",
    email: "arckolkata63@gmail.com",
    website: "https://www.arckolkata.org/",
    location: { lat: 22.467, lng: 88.307 },
    tags: ["rescue", "ambulance", "treatment", "shelter", "sterilization"],
  },
  {
    id: "pfa-kolkata-ashari",
    name: "People For Animals (PFA) Kolkata / ASHARI",
    description:
      "Rescue + hospital-style care for injured and neglected animals; part of the People For Animals network.",
    address: "Kolkata, West Bengal (contact for rescue/hospital details)",
    areaHint: "Kolkata",
    phone: "+918335045433",
    email: "peopleforanimalskolkata@gmail.com",
    location: { lat: 22.5726, lng: 88.3639 },
    tags: ["rescue", "treatment", "shelter"],
  },
  {
    id: "animal-people-alliance",
    name: "Animal People Alliance",
    description:
      "Rescue and treatment for injured strays; awareness and community support across Kolkata & Howrah.",
    address: "Kolkata, West Bengal (contact for rescue details)",
    areaHint: "Kolkata",
    phone: "+919051541112",
    email: "info@animalpeoplealliance.net",
    website: "https://animalpeoplealliance.net/",
    location: { lat: 22.57, lng: 88.37 },
    tags: ["rescue", "treatment", "awareness"],
  },
  {
    id: "like-a-dog",
    name: "Like A Dog Foundation",
    description:
      "Vaccination drives, adoption camps, rescue support and community outreach for street animals.",
    address: "Kolkata, West Bengal (contact for camps/rescue details)",
    areaHint: "Kolkata",
    phone: "+917009659613",
    email: "bark@likeadog.org",
    website: "https://www.likeadog.org/",
    location: { lat: 22.55, lng: 88.37 },
    tags: ["vaccination", "adoption", "rescue"],
  },
  {
    id: "kolkata-street-dog-welfare-foundation",
    name: "Kolkata Street Dog Welfare Foundation",
    description:
      "Feeding and basic treatment on daily routes across Kolkata and nearby suburbs.",
    address: "Kolkata, West Bengal (contact for route/area coverage)",
    areaHint: "Kolkata",
    phone: "+919088924285",
    email: "info@kolkatastreetdogfoundation.co.in",
    website: "https://kolkatastreetdogfoundation.co.in/",
    location: { lat: 22.575, lng: 88.365 },
    tags: ["feeding", "treatment", "community"],
  },
  {
    id: "compassionate-crusaders-trust",
    name: "Compassionate Crusaders Trust (CCT)",
    description:
      "Rescue + medical care and sterilization/vaccination drives in and around Kolkata.",
    address: "Kolkata, West Bengal (contact for program details)",
    areaHint: "South Kolkata",
    phone: "+913324647030",
    email: "animalcrusader@gmail.com",
    website: "https://www.animalcrusaders.org/",
    location: { lat: 22.514, lng: 88.344 },
    tags: ["rescue", "sterilization", "vaccination", "treatment"],
  },
  {
    id: "love-n-care",
    name: "Love n Care for Animals",
    description:
      "Rescue + small shelter/clinic; sterilization and vaccination drives in Kolkata neighborhoods.",
    address: "Sarsuna, Kolkata, West Bengal",
    areaHint: "Sarsuna",
    phone: "+913324881222",
    email: "lovencareforanimals@gmail.com",
    website: "https://www.lovencareforanimals.co.in/",
    location: { lat: 22.494, lng: 88.292 },
    tags: ["rescue", "clinic", "sterilization", "vaccination", "shelter"],
  },
];

