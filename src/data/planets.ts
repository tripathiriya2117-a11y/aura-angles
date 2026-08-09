// Local Planet type to avoid relying on ../types/planet export
interface Planet {
  id: string;
  title: string;
  color: string;
  x: number;
  y: number;
  size: number;
}

export const planets: Planet[] = [
  {
    id: "1",
    title: "Books",
    color: "#7B61FF",
    x: 40,
    y: 140,
    size: 90,
  },
  {
    id: "2",
    title: "Music",
    color: "#42D9C8",
    x: 220,
    y: 280,
    size: 75,
  },
  {
    id: "3",
    title: "Travel",
    color: "#FF8C42",
    x: 120,
    y: 470,
    size: 110,
  },
];