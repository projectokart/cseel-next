export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';
import { readSyncStore, writeSyncStore } from '@/lib/schools/schoolSectionsManager';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

interface ReviewItem {
  id: string | number;
  userId?: string;
  userEmail?: string;
  author: string;
  role: 'Parent' | 'Student' | 'Alumni';
  studentClass?: string;
  rating: number;
  comment: string;
  metrics?: {
    academics: number;
    infrastructure: number;
    safety: number;
    sports: number;
    value: number;
  };
  createdAt: string;
  updatedAt?: string;
  likes?: number;
}

/**
 * Helper to get school reviews & likes count from Supabase school_profiles & local sync store
 */
async function getSchoolData(udiseCode: string) {
  const cleanUdise = udiseCode.replace(/\D/g, '').trim();
  const canonicalUdise = cleanUdise.length === 10 ? '0' + cleanUdise : cleanUdise;
  const candidates = Array.from(new Set([cleanUdise, canonicalUdise, cleanUdise.replace(/^0+/, '')])).filter(Boolean);

  let reviews: ReviewItem[] = [];
  let likesCount: number = 0;
  let likedUsers: string[] = [];
  let rawProfileData: any = {};
  let targetUdiseCode = canonicalUdise || cleanUdise;

  // 1. Check Supabase school_profiles (try candidates)
  try {
    const { data: rows } = await schoolSearchSupabase
      .from('school_profiles')
      .select('udise_code, reviews, likes_count, profile_data')
      .in('udise_code', candidates)
      .limit(1);

    const row = rows && rows.length > 0 ? rows[0] : null;

    if (row) {
      targetUdiseCode = row.udise_code;
      rawProfileData = typeof row.profile_data === 'string' ? JSON.parse(row.profile_data) : (row.profile_data || {});
      // Dedicated column reviews takes priority
      if (Array.isArray(row.reviews) && row.reviews.length > 0) {
        reviews = row.reviews;
      } else if (Array.isArray(rawProfileData.reviews)) {
        reviews = rawProfileData.reviews;
      }

      // Dedicated column likes_count takes priority
      if (typeof row.likes_count === 'number') {
        likesCount = row.likes_count;
      } else if (typeof rawProfileData.likesCount === 'number') {
        likesCount = rawProfileData.likesCount;
      }

      if (Array.isArray(rawProfileData.likedUsers)) {
        likedUsers = rawProfileData.likedUsers;
      }
    }
  } catch (err) {
    console.warn('Supabase fetch error in school-engagement:', err);
  }

  // 2. Fallback to local sync store if reviews/likes empty
  if (reviews.length === 0) {
    const store = readSyncStore();
    for (const key of Object.keys(store.tokens || {})) {
      const rec = store.tokens[key];
      const recUdise = String(rec.schoolId || rec.profileData?.udiseCode || '').replace(/\D/g, '');
      if (candidates.includes(recUdise) && rec.profileData) {
        if (Array.isArray(rec.profileData.reviews) && rec.profileData.reviews.length > 0) {
          reviews = rec.profileData.reviews;
        }
        if (typeof rec.profileData.likesCount === 'number') {
          likesCount = rec.profileData.likesCount;
        }
        if (Array.isArray(rec.profileData.likedUsers)) {
          likedUsers = rec.profileData.likedUsers;
        }
        break;
      }
    }
  }

  return { cleanUdise: targetUdiseCode, reviews, likesCount, likedUsers, rawProfileData };
}

/**
 * Helper to save school reviews & likes back to Supabase and sync store
 */
async function saveSchoolData(
  udiseCode: string,
  reviews: ReviewItem[],
  likesCount: number,
  likedUsers: string[] = [],
  existingProfileData: any = {}
) {
  const cleanUdise = udiseCode.replace(/\D/g, '').trim();
  const canonicalUdise = cleanUdise.length === 10 ? '0' + cleanUdise : cleanUdise;
  const updatedProfileData = {
    ...existingProfileData,
    udiseCode: canonicalUdise,
    reviews,
    likesCount,
    likedUsers,
    reviewsCount: reviews.length,
    averageRating: reviews.length > 0 
      ? Number((reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1))
      : 5.0,
    updated_at: new Date().toISOString(),
  };

  // 1. Save to Supabase school_profiles (dedicated columns 'reviews' & 'likes_count' + profile_data)
  try {
    const { error: dedicatedErr } = await schoolSearchSupabase
      .from('school_profiles')
      .upsert(
        {
          udise_code: canonicalUdise,
          reviews,
          likes_count: likesCount,
          profile_data: updatedProfileData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'udise_code' }
      );

    if (dedicatedErr) {
      // Graceful fallback if migration hasn't been run yet in Supabase
      await schoolSearchSupabase
        .from('school_profiles')
        .upsert(
          {
            udise_code: canonicalUdise,
            profile_data: updatedProfileData,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'udise_code' }
        );
    }
  } catch (err) {
    console.warn('Supabase save error in school-engagement:', err);
  }

  // 2. Also persist to local sync store for offline & dev server consistency
  try {
    const store = readSyncStore();
    const candidates = [cleanUdise, canonicalUdise, cleanUdise.replace(/^0+/, '')];
    let tokenFound = false;
    for (const key of Object.keys(store.tokens || {})) {
      const rec = store.tokens[key];
      const recUdise = String(rec.schoolId || rec.profileData?.udiseCode || '').replace(/\D/g, '');
      if (candidates.includes(recUdise)) {
        rec.profileData = {
          ...(rec.profileData || {}),
          ...updatedProfileData,
        };
        rec.lastUpdatedAt = Date.now();
        tokenFound = true;
        break;
      }
    }
    if (!tokenFound) {
      const tokenKey = `sync_${canonicalUdise}`;
      store.tokens[tokenKey] = {
        token: tokenKey,
        schoolId: canonicalUdise,
        schoolName: existingProfileData.schoolName || 'School',
        createdAt: Date.now(),
        lastUpdatedAt: Date.now(),
        isPermanent: true,
        profileData: updatedProfileData,
      };
    }
    writeSyncStore(store);
  } catch (err) {
    console.warn('Sync store write error in school-engagement:', err);
  }

  return updatedProfileData;
}

/**
 * GET /api/school-engagement?udiseCode=...&userId=...
 * Returns list of reviews, current user's review (if any), total likes count, and userLiked status
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const udiseCode = (searchParams.get('udiseCode') || searchParams.get('udise') || '').trim();
    const userId = (searchParams.get('userId') || searchParams.get('userEmail') || '').trim();

    if (!udiseCode) {
      return NextResponse.json(
        { success: false, error: 'udiseCode parameter is required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const { cleanUdise, reviews, likesCount, likedUsers } = await getSchoolData(udiseCode);

    // Identify user's existing review if userId/userEmail provided
    const userReview = userId
      ? reviews.find((r) => r.userId === userId || r.userEmail === userId) || null
      : null;

    const avgRating = reviews.length > 0
      ? Number((reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1))
      : 5.0;

    const isUserLiked = userId ? likedUsers.includes(userId) : false;

    return NextResponse.json(
      {
        success: true,
        udiseCode: cleanUdise,
        totalReviews: reviews.length,
        averageRating: avgRating,
        likesCount,
        userLiked: isUserLiked,
        reviews,
        userReview,
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
 * POST /api/school-engagement
 * Handles:
 * - action === 'like': toggle school like (strictly 1 like per user)
 * - action === 'like_review': toggle helpful vote on a review
 * - action === 'review': create or update review (strictly 1 review per user)
 * - action === 'delete_review': delete the user's review
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      action,
      udiseCode,
      userId,
      userEmail,
      author,
      role = 'Parent',
      studentClass = '',
      rating = 5,
      comment = '',
      metrics,
      reviewId,
      liked, // boolean flag for like toggle
    } = body;

    const cleanUdise = String(udiseCode || '').replace(/\D/g, '').trim();
    if (!cleanUdise) {
      return NextResponse.json(
        { success: false, error: 'udiseCode is required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const { cleanUdise: targetCode, reviews, likesCount, likedUsers, rawProfileData } = await getSchoolData(cleanUdise);

    // ───────────────────────────────────────────────
    // 1. ACTION: LIKE / UNLIKE SCHOOL (Strictly 1 like per user)
    // ───────────────────────────────────────────────
    if (action === 'like') {
      const userIdentifier = (userId || userEmail || 'guest').trim();
      let updatedLikedUsers = [...likedUsers];
      let newLikesCount = likesCount;

      if (liked === true || liked === undefined) {
        if (!updatedLikedUsers.includes(userIdentifier)) {
          updatedLikedUsers.push(userIdentifier);
          newLikesCount = likesCount + 1;
        }
      } else if (liked === false) {
        if (updatedLikedUsers.includes(userIdentifier)) {
          updatedLikedUsers = updatedLikedUsers.filter((u) => u !== userIdentifier);
          newLikesCount = Math.max(0, likesCount - 1);
        }
      }

      await saveSchoolData(targetCode, reviews, newLikesCount, updatedLikedUsers, rawProfileData);

      return NextResponse.json(
        {
          success: true,
          action: 'like',
          likesCount: newLikesCount,
          userLiked: updatedLikedUsers.includes(userIdentifier),
          message: 'School like updated successfully',
        },
        { headers: CORS_HEADERS }
      );
    }

    // ───────────────────────────────────────────────
    // 1.5 ACTION: LIKE / HELPFUL ON A REVIEW
    // ───────────────────────────────────────────────
    if (action === 'like_review') {
      const targetReviewId = reviewId || body.id;
      const updatedReviews = reviews.map((r) => {
        if (String(r.id) === String(targetReviewId)) {
          const currentHelpful = Number(r.likes) || 0;
          return {
            ...r,
            likes: liked ? currentHelpful + 1 : Math.max(0, currentHelpful - 1),
          };
        }
        return r;
      });

      await saveSchoolData(targetCode, updatedReviews, likesCount, likedUsers, rawProfileData);

      return NextResponse.json(
        {
          success: true,
          action: 'like_review',
          reviews: updatedReviews,
          message: 'Review helpful updated successfully',
        },
        { headers: CORS_HEADERS }
      );
    }

    // ───────────────────────────────────────────────
    // 2. ACTION: DELETE REVIEW (Owner only)
    // ───────────────────────────────────────────────
    if (action === 'delete_review') {
      const identifier = userId || userEmail;
      if (!identifier && !reviewId) {
        return NextResponse.json(
          { success: false, error: 'User identifier or reviewId is required to delete review' },
          { status: 400, headers: CORS_HEADERS }
        );
      }

      const filtered = reviews.filter((r) => {
        if (reviewId && String(r.id) === String(reviewId)) return false;
        if (identifier && (r.userId === identifier || r.userEmail === identifier)) return false;
        return true;
      });

      await saveSchoolData(targetCode, filtered, likesCount, likedUsers, rawProfileData);

      return NextResponse.json(
        {
          success: true,
          action: 'delete_review',
          totalReviews: filtered.length,
          reviews: filtered,
          message: 'Review deleted successfully',
        },
        { headers: CORS_HEADERS }
      );
    }

    // ───────────────────────────────────────────────
    // 3. ACTION: CREATE OR EDIT REVIEW (Per-user strictly 1 review)
    // ───────────────────────────────────────────────
    if (action === 'review' || !action) {
      if (!author?.trim() || !comment?.trim()) {
        return NextResponse.json(
          { success: false, error: 'Author name and review comment are required' },
          { status: 400, headers: CORS_HEADERS }
        );
      }

      const userIdentifier = (userId || userEmail || author).trim();
      const existingIdx = reviews.findIndex(
        (r) =>
          (userId && r.userId === userId) ||
          (userEmail && r.userEmail === userEmail) ||
          (reviewId && String(r.id) === String(reviewId)) ||
          r.author.toLowerCase() === author.toLowerCase()
      );

      const targetMetrics = metrics || {
        academics: Number(rating) || 5,
        infrastructure: Number(rating) || 5,
        safety: Number(rating) || 5,
        sports: Number(rating) || 5,
        value: Number(rating) || 5,
      };

      let updatedReviewItem: ReviewItem;

      if (existingIdx >= 0) {
        // Edit existing review
        const current = reviews[existingIdx];
        updatedReviewItem = {
          ...current,
          author: author.trim(),
          role: role as any,
          studentClass: studentClass.trim() || current.studentClass || `${role} Feedback`,
          rating: Number(rating) || current.rating,
          comment: comment.trim(),
          metrics: targetMetrics,
          updatedAt: new Date().toISOString(),
        };
        reviews[existingIdx] = updatedReviewItem;
      } else {
        // Add new review
        updatedReviewItem = {
          id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          userId: userId || undefined,
          userEmail: userEmail || undefined,
          author: author.trim(),
          role: role as any,
          studentClass: studentClass.trim() || `${role} Feedback`,
          rating: Number(rating) || 5,
          comment: comment.trim(),
          metrics: targetMetrics,
          createdAt: new Date().toISOString(),
          likes: 0,
        };
        reviews.unshift(updatedReviewItem);
      }

      await saveSchoolData(targetCode, reviews, likesCount, likedUsers, rawProfileData);

      return NextResponse.json(
        {
          success: true,
          action: existingIdx >= 0 ? 'review_updated' : 'review_created',
          review: updatedReviewItem,
          reviews,
          totalReviews: reviews.length,
          message: existingIdx >= 0 ? 'Review updated successfully' : 'Review published successfully',
        },
        { headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      { success: false, error: `Invalid action "${action}"` },
      { status: 400, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    console.error('Error in POST /api/school-engagement:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
