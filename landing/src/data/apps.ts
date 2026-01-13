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
    description: "Media server",
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
    name: "Game of Life",
    url: "https://gameoflife.jacquesops.site",
    description: "Conway's Game of Life",
    icon: "/icons/gameoflife.png",
    group: "Media",
  },
];
