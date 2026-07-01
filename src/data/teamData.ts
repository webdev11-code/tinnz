export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image_url: string;
  order: number;
  socials?: {
    discord?: string;
    instagram?: string;
    whatsapp?: string;
    tiktok?: string;
    portfolio?: string;
  };
}

export const staticTeamMembers: TeamMember[] = [
  {
    id: "team-1",
    name: "Tinnz",
    role: "CEO & Founder",
    image_url: "",
    order: 1,
      socials: {
      discord: "https://discord.gg/Nz9b6bMuNe",
      instagram: "https://www.instagram.com/tinnzstore_id",
      whatsapp: "https://wa.me/6287844812351",
      tiktok: "",
      portfolio: ""
    }
  },
  {
    id: "team-2",
    name: "Null",
    role: "Lead Web Developer",
    image_url: "",
    order: 2,
    socials: {
      discord: "https://discord.gg/Nz9b6bMuNe",
      instagram: "https://www.instagram.com/tinnzstore_id",
      whatsapp: "https://wa.me/6287844812351",
      tiktok: "",
      portfolio: ""
    }
  },
  {
    id: "team-3",
    name: "Null",
    role: "Customer Support Specialist",
    image_url: "",
    order: 3,
    socials: {
      discord: "https://discord.gg/Nz9b6bMuNe",
      instagram: "https://www.instagram.com/tinnzstore_id",
      whatsapp: "https://wa.me/6287844812351",
      tiktok: "",
      portfolio: ""
    }
  },
  {
    id: "team-4",
    name: "Null",
    role: "System & Architecture Staff",
    image_url: "",
    order: 4,
    socials: {
      discord: "https://discord.gg/Nz9b6bMuNe",
      instagram: "https://www.instagram.com/tinnzstore_id",
      whatsapp: "https://wa.me/6287844812351",
      tiktok: "",
      portfolio: ""
    }
  }
];
