
export type FriendshipDBFormat = {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  updated_at: string;
};

export type FollowDBFormat = {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
  updated_at: string;
};

export type PostDBFormat = {
  id: string;
  author_id: string;
  content: string;
  location_name?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  geom?: string | null; // geography(Point, 4326) come stringa GeoJSON o WKT
  mood?: string | null;
  positive_reflection?: string | null;
  negative_reflection?: string | null;
  physical_effort?: number | null;
  economic_effort?: number | null;
  actual_cost?: number | null;
  created_at: string;
  updated_at: string;
};

export type LikeDBFormat = {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
  updated_at: string;
};

export type CommentDBFormat = {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type MediaDBFormat = {
  id: string;
  post_id: string;
  url: string;
  type: 'image' | 'video';
  position: number;
  created_at: string;
  updated_at: string;
};

export type MessageDBFormat = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  read_at?: string | null;
};

export type GroupDBFormat = {
  id: string;
  name: string;
  description?: string | null;
  avatar_url?: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
};

export type GroupMemberDBFormat = {
  id: string;
  group_id: string;
  user_id: string;
  role: 'member' | 'admin' | 'owner';
  created_at: string;
  updated_at: string;
};

export type NotificationDBFormat = {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'friend_request';
  from_user_id?: string | null;
  post_id?: string | null;
  read: boolean;
  created_at: string;
  updated_at: string;
};

export type PostTagDBFormat = {
  id: string;
  post_id: string;
  tag: string;
  created_at: string;
  updated_at: string;
};