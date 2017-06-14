// http://www.siriusxm.com/albumart/Live/Default/DefaultMDS_m_52.jpg
export interface Channel {
  name: string;
  id: string;
  number: number;
  img?: string;
}
export const channels: Channel[] = [
  {
    name: 'BPM',
    id: 'thebeat',
    number: 51,
  },
  {
    name: 'Electric Area',
    id: 'area33',
    number: 52,
  },
];
