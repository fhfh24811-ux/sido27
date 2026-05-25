/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  points: number;
  avatar: string;
  created_at: string;
}

export interface Anime {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  type: 'anime-subbed' | 'anime-dubbed' | 'movies' | 'turkish';
  language: string;
  badge: string;
  status?: 'completed' | 'ongoing';
}

export interface Episode {
  id: string;
  anime_id: string;
  title: string;
  video_url: string;
  episode_number: number;
}

export interface WatchlistItem {
  username: string;
  anime_id: string;
  type: 'fav' | 'later' | 'watched';
}

export interface Suggestion {
  id: string;
  username: string;
  category: string;
  text: string;
  votes: number;
  voted_by: string[];
  created_at: string;
}

export interface Comment {
  id: string;
  anime_id: string;
  username: string;
  text: string;
  created_at: string;
}
