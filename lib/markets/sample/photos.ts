import type { ListingPhoto } from "@/lib/listing";
import type { PhotoCategory } from "@/lib/markets/sample/types";

/** Unsplash photo ids, grouped by what they show. */
export const PHOTO_POOLS = {
  luxuryHouse: ["1564013799919-ab600027ffc6", "1600596542815-ffad4c1539a9", "1512917774080-9991f1c4c750", "1580587771525-78b9dba3b914", "1613490493576-7fde63acd811", "1599809275671-b5942cabc7a2", "1416331108676-a22ccb276e35"],
  house: ["1600585154340-be6161a56a0c", "1600566753190-17f0baa2a6c3", "1600047509807-ba8f99d2cdde", "1600585154526-990dced4db0d"],
  bungalow: ["1583608205776-bfd35f0d9f83", "1592595896551-12b371d546d5"],
  flat: ["1545324418-cc1a3fa10c00", "1460317442991-0ec209397118", "1574362848149-11496d93a7c7", "1515263487990-61b07816b324"],
  small: ["1502672260266-1c1ef2d93688", "1522708323590-d24dbb6b0267"],
  land: ["1500382017468-9049fed747ef"],
  luxuryLiving: ["1560448204-e02f11c3d0e2", "1600566753086-00f18fb6b3ea", "1600607687939-ce8a6c25118c", "1600573472550-8090b5e0745e"],
  living: ["1600210492486-724fe5c67fb0", "1493809842364-78817add7ffb", "1554995207-c18c203602cb", "1505691938895-1758d7feb511"],
  kitchen: ["1484154218962-a197022b5858", "1556911220-bff31c812dba"],
  bedroom: ["1600607687644-c7171b42498f", "1631049307264-da0ec9d70304"],
} satisfies Record<PhotoCategory | "luxuryHouse" | "luxuryLiving" | "living" | "kitchen" | "bedroom", string[]>;

/** Brick and period houses for markets where the default villas look out of place. */
export const BRICK_HOUSES = ["1449844908441-8829872d2607", "1605276374104-dee2a0ed3cd6", "1570129477492-45c003edd2be"];

export function unsplash(id: string): ListingPhoto {
  const base = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop`;
  return { full: `${base}&w=1600&q=75`, thumb: `${base}&w=640&q=70` };
}
