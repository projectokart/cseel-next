import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';
import { ALL_EXPERIMENTS } from '@/lib/experimentsData';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'experiment_engagement.json');

interface ExperimentEngagementItem {
  id: string; // experiment id / slug
  likesCount: number;
  likedUsers: string[];
  reviews: Array<{
    id: string;
    userId?: string;
    author: string;
    comment: string;
    rating?: number;
    createdAt: string;
  }>;
}

type StoreData = Record<string, ExperimentEngagementItem>;

let memoryStore: StoreData | null = null;

function readEngagementStore(): StoreData {
  if (memoryStore) return memoryStore;
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      memoryStore = JSON.parse(content);
      return memoryStore || {};
    }
  } catch (err) {
    console.warn('Could not read experiment_engagement.json:', err);
  }
  memoryStore = {};
  return memoryStore;
}

function writeEngagementStore(store: StoreData): void {
  memoryStore = store;
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write experiment_engagement.json:', err);
  }
}

function getDefaultLikes(expId: string): number {
  const clean = expId.toLowerCase().trim();
  const found = ALL_EXPERIMENTS.find(
    (e) =>
      e.id.toLowerCase() === clean ||
      (e.slug && e.slug.toLowerCase() === clean) ||
      e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(clean)
  );
  return typeof found?.likes === 'number' ? found.likes : 124;
}

/**
 * GET /api/experiment-engagement?experimentId=...&userId=...
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const experimentId = (searchParams.get('experimentId') || searchParams.get('id') || '').trim();
    const userId = (searchParams.get('userId') || searchParams.get('userEmail') || '').trim();

    if (!experimentId) {
      return NextResponse.json(
        { success: false, error: 'experimentId parameter is required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const store = readEngagementStore();
    const cleanId = experimentId.toLowerCase();
    const record = store[cleanId] || {
      id: cleanId,
      likesCount: getDefaultLikes(cleanId),
      likedUsers: [],
      reviews: [],
    };

    const isUserLiked = userId ? record.likedUsers.includes(userId) : false;

    return NextResponse.json(
      {
        success: true,
        experimentId: cleanId,
        likesCount: record.likesCount,
        userLiked: isUserLiked,
        reviews: record.reviews,
      },
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

/**
 * POST /api/experiment-engagement
 * Body:
 * {
 *   action: 'like' | 'review',
 *   experimentId: string,
 *   userId?: string,
 *   liked?: boolean,
 *   author?: string,
 *   comment?: string,
 *   rating?: number
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      action = 'like',
      experimentId,
      userId,
      userEmail,
      liked,
      author,
      comment,
      rating = 5,
    } = body;

    if (!experimentId) {
      return NextResponse.json(
        { success: false, error: 'experimentId is required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const cleanId = String(experimentId).toLowerCase().trim();
    const store = readEngagementStore();
    const current = store[cleanId] || {
      id: cleanId,
      likesCount: getDefaultLikes(cleanId),
      likedUsers: [],
      reviews: [],
    };

    // 1. ACTION: LIKE / UNLIKE EXPERIMENT (Single like per user)
    if (action === 'like') {
      const userIdentifier = (userId || userEmail || 'guest').trim();
      let updatedLikedUsers = [...current.likedUsers];
      let newLikesCount = current.likesCount;

      if (liked === true || liked === undefined) {
        if (!updatedLikedUsers.includes(userIdentifier)) {
          updatedLikedUsers.push(userIdentifier);
          newLikesCount = current.likesCount + 1;
        }
      } else if (liked === false) {
        if (updatedLikedUsers.includes(userIdentifier)) {
          updatedLikedUsers = updatedLikedUsers.filter((u) => u !== userIdentifier);
          newLikesCount = Math.max(0, current.likesCount - 1);
        }
      }

      current.likesCount = newLikesCount;
      current.likedUsers = updatedLikedUsers;
      store[cleanId] = current;
      writeEngagementStore(store);

      // Best effort sync with Supabase experiments table popularity
      try {
        await schoolSearchSupabase
          .from('experiments')
          .update({ popularity: newLikesCount })
          .eq('id', cleanId);
      } catch (sbErr) {
        // Silently continue, local store is authoritative
      }

      return NextResponse.json(
        {
          success: true,
          action: 'like',
          likesCount: newLikesCount,
          userLiked: updatedLikedUsers.includes(userIdentifier),
          message: 'Experiment like updated successfully',
        },
        { headers: CORS_HEADERS }
      );
    }

    // 2. ACTION: ADD REVIEW / COMMENT
    if (action === 'review' || action === 'comment') {
      if (!comment?.trim()) {
        return NextResponse.json(
          { success: false, error: 'Comment text is required' },
          { status: 400, headers: CORS_HEADERS }
        );
      }

      const newReview = {
        id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId: userId || undefined,
        author: (author || 'Student').trim(),
        comment: comment.trim(),
        rating: Number(rating) || 5,
        createdAt: new Date().toISOString(),
      };

      current.reviews.unshift(newReview);
      store[cleanId] = current;
      writeEngagementStore(store);

      return NextResponse.json(
        {
          success: true,
          action: 'review',
          review: newReview,
          reviews: current.reviews,
          message: 'Comment posted successfully',
        },
        { headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      { success: false, error: `Invalid action "${action}"` },
      { status: 400, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    console.error('Error in POST /api/experiment-engagement:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
