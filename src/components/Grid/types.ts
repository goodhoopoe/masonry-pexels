export interface Image {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  src: {
    original: string;
    large: string;
  };
}

export interface PexelsResponse {
  page: number;
  per_page: number;
  photos: Image[];
  total_results: number;
  next_page: string;
}

export interface VirtualItem {
  image: Image;
  column: number;
  top: number;
}
