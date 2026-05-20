/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Anime {
  id: number;
  name: string;
  description: string;
  image: string;
  type: 'anime-subbed' | 'anime-dubbed' | 'movies' | 'turkish';
  language: 'مترجم' | 'مدبلج' | 'مترجم ومدبلج';
  year: string;
  rating: number; // 1 to 10
  episodes_count: number;
  genre: string;
  badge?: string; // e.g. '🔥 رائج', '⭐ مميز'
  duration?: string;
}

export interface VideoSource {
  label: string; // e.g. "FHD 1080p", "HD 720p", "SD 480p"
  url: string;
}

export interface Episode {
  id: number;
  anime_id: number;
  episode_number: number;
  title: string;
  sources: VideoSource[];
  download_url?: string;
}

export interface PointTransaction {
  id: string; // uuid
  amount: number; // e.g. +10, +50, -1000
  type: 'watch' | 'daily_login' | 'signup_bonus' | 'referral' | 'redeem';
  note: string;
  created_at: string;
}

export interface WatchlistItem {
  anime_id: number;
  type: 'fav' | 'later' | 'watched';
  created_at: string;
}

export interface AnimeRating {
  anime_id: number;
  rating: number; // 1 to 5
}

export interface Idea {
  id: number;
  text: string;
  category: string;
  username: string;
  votes: number;
  voted_by: string[]; // array of usernames/ips to prevent double voting
  created_at: string;
}

export interface Profile {
  username: string;
  points: number;
  lastDailyLogin: string | null; // ISO Date
  referralCode: string;
}
