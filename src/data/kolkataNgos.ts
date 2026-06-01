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
    location: { lat: 22.4618612, lng: 88.3142586 },
    tags: ["rescue", "ambulance", "treatment", "shelter", "sterilization"],
  },
  {
    id: "pfa-kolkata-ashari",
    name: "People For Animals (PFA) Kolkata / ASHARI",
    description:
      "Rescue + hospital-style care for injured and neglected animals; part of the People For Animals network.",
    address: "2, Netajii Nagar,Near Mukundapur Bus Depot,Kolkata - 700 099",
    areaHint: "Mukundapur",
    phone: "+918335045433",
    email: "peopleforanimalskolkata@gmail.com",
    website: "https://peopleforanimalsko.wixsite.com/website",
    location: { lat: 22.5726, lng: 88.3639 },
    tags: ["rescue", "treatment", "shelter"],
  },
  {
    id: "animal-people-alliance",
    name: "Animal People Alliance",
    description:
      "Rescue and treatment for injured strays; awareness and community support across South Kolkata.",
    address: "Behala region,Kolkata",
    areaHint: "Behala",
    phone: "+919051541112",
    email: "office@animalpeoplealliance.net",
    website: "https://animalpeoplealliance.net/animal-rescue-programs-kolkata/",
    location: { lat: 22.4989777, lng: 88.2937893 },
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
    address: "Dakshin Kumrakhali, P.O.+P.S. - Narendrapur, Kolkata - 700103, West Bengal",
    areaHint: "Narendrapur",
    phone: "+919088924285",
    email: "info@kolkatastreetdogfoundation.co.in",
    website: "https://kolkatastreetdogfoundation.co.in/",
    location: { lat: 22.533947, lng: 88.2618433 },
    tags: ["feeding", "treatment", "community"],
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
    location: { lat: 22.4782455, lng: 87.6956978 },
    tags: ["rescue", "clinic", "sterilization", "vaccination", "shelter"],
  },
  {
    id: "kolkata-dog-lovers",
    name: "Kolkata Dog Lovers",
    description:
      "Volunteer-driven dog rescue and adoption network working across Kolkata, helping with rehoming, rescue coordination, and community support.",
    address:
      "38/1/2B Girish Mukherjee Road, Bhowanipore, Kolkata, West Bengal 700025",
    areaHint: "Bhowanipore",
    phone: "+917044381010",
    email: "",
    website: "",
    location: {lat: 22.5299384,lng: 87.7717832},
    tags: [
      "adoption",
      "dog-rescue",
      "community",
      "foster",
      "rehoming"
    ]
  },
   {
    id: "wild-animal-rescue-transit-facility-centre",
    name: "Wild Animal Rescue & Transit Facility Centre",
    description:
      "Wildlife rescue service",
    address:
      "AE-389, Canal Side Rd, AE Block, Sector 1, Bidhannagar, Kolkata, West Bengal 700064",
    areaHint: "Bidhannagar",
    phone: "033 2334 0234",
    email: "",
    website: "",
    location: {lat: 22.5299384,lng: 87.7717832},
    tags: [
      "wildlife rescue",
      "rescue",
    ]
  },
  {
    id: "a1-animals-come-first",
    name: "A1 - Animals Come First ",
    description:
      "A1 - Animals Come First is a non-profit animal welfare NGO based in Kolkata.",
    address:
      "Barasat II BDO Office, Bagbanda saiberiya, Barasat, Kolkata, West Bengal 700128",
    areaHint: "Barasat",
    phone: "096810 16999",
    email: "kamalikadey2020@gmail.com",
    website: "",
    location: {lat: 22.5299384,lng: 87.7717832},
    tags: [
      "adoption",
      "rescue",
    ]
  },
  {
    id: "puja-pet-rescue",
    name: "Puja pet rescue",
    description:
      "Puja Pet Rescue is a non-profit animal welfare NGO based in Kolkata.",
    address:
      "Pathak Para Rd, Naskarpur, Behala, Kolkata, West Bengal 700060",
    areaHint: "Behala",
    phone: "07439966003",
    email: "",
    website: "",
    location: {lat: 22.5299384,lng: 87.7717832},
    tags: [
      "adoption",
      "rescue",
    ]
  },
  {
    id: "calcutta-pinjrapole-society",
    name: "Calcutta Pinjrapole Society",
    description:
      "Calcutta Pinjrapole society was established in the year 1885 by the eminent persons of society from Kolkata for the shelter of motherly Cows.",
    address:
      "34, Armenian Street, Kolkata, India, West Bengal",
    areaHint: "Armenian Street",
    phone: "90388 13142",
    email: "",
    website: "",
    location: {lat: 22.5299384,lng: 87.7717832},
    tags: [
      "shelter",
      "rescue",
    ]
  },
  {
    id: "sac-org",
    name: "S.A.C.Org",
    description:
      "S.A.C is a non-profit animal welfare organization located in Kolkata.",
    address:
      "Dunlop, Satin Sen Nagar, Baranagar, West Bengal 700108",
    areaHint: "Baranagar",
    phone: "06291935982",
    email: "",
    website: "",
    location: {lat: 22.5299384,lng: 87.7717832},
    tags: [
      "shelter",
      "rescue",
    ]
  },
  
  
  
];

