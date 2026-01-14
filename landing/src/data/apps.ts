export type AppLink = {
  name: string;
  url: string;
  description?: string;
  icon?: string; // emoji for now
  group?: string;
};

export const apps: AppLink[] = [
  {
    name: "Plex",
    url: "https://plex.jacquesops.site",
    description: "Plex media server",
    icon: "/icons/plex.webp",
    group: "Media",
  },
  {
    name: "qBittorrent",
    url: "https://qbittorrent.jacquesops.site",
    description: "Downloads",
    icon: "/icons/qbittorrent.png",
    group: "Media",
  },
  {
    name: "Jellyfin",
    url: "https://jellyfin.jacquesops.site",
    description: "Jellyfin media server",
    icon: "/icons/jellyfin.png",
    group: "Media",
  },
  {
    name: "Netflix",
    url: "https://netflix.com",
    description: "Netflix",
    icon: "/icons/netflix.png",
    group: "Media",
  },
  {
    name: "Game of Life",
    url: "https://gameoflife.jacquesops.site",
    description: "Conway's Game of Life",
    icon: "/icons/gameoflife.png",
    group: "Games",
  },
  {
    name: "Chess",
    url: "https://www.chess.com/home",
    description: "chess.com",
    icon: "/icons/chess.png",
    group: "Games",
  },
  {
    name: "Greenchoice",
    url: "https://dynamischcontract.greenchoice.nl/verbruik?date=2026-01-14&type=costs",
    description: "Power + Gas",
    icon: "/icons/greenchoice.png",
    group: "Utilities",
  },
];
