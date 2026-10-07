import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  FacultyProfile,
  FacultyAddressDetails,
  getAllFacultyProfiles,
  upsertFacultyProfile,
  generateAccessKey,
  getLocalFacultyProfiles,
  saveLocalFacultyProfiles,
  parseGoogleMapsLocation,
  calculateHaversineDistanceKm,
  deleteFacultyProfile
} from '@/lib/facultyProfiles';
import {
  generateGoogleVideosHtml,
  generateGoogleGalleryHtml
} from '@/lib/facultyHtmlGenerators';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const key = searchParams.get('key');
    const code = searchParams.get('code');
    const status = searchParams.get('status');

    const facultyList = await getAllFacultyProfiles();

    if (code) {
      const match = facultyList.find(f => f.facultyCode?.toLowerCase() === code.trim().toLowerCase());
      if (!match) return NextResponse.json({ success: false, message: `Faculty with ID "${code}" not found` }, { status: 404 });
      return NextResponse.json({ success: true, faculty: match });
    }

    if (key) {
      const match = facultyList.find(f => f.accessKey === key);
      if (!match) return NextResponse.json({ success: false, message: 'Faculty not found' }, { status: 404 });
      return NextResponse.json({ success: true, faculty: match });
    }

    if (slug) {
      const match = facultyList.find(f => f.slug === slug || f.altSlug === slug);
      if (!match) return NextResponse.json({ success: false, message: 'Faculty not found' }, { status: 404 });
      return NextResponse.json({ success: true, faculty: match });
    }

    let filtered = facultyList;
    if (status) {
      filtered = facultyList.filter(f => f.status === status);
    }

    return NextResponse.json({
      success: true,
      faculty: filtered,
      total: filtered.length,
      pendingCount: facultyList.filter(f => f.status === 'pending_verification' || !f.isVerified).length,
      verifiedCount: facultyList.filter(f => f.status === 'verified' && f.isVerified).length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      subject = 'Physics',
      experience,
      title,
      phone,
      altPhone,
      email,
      address,
      addressDetails,
      videoLink,
      imageLink,
      photoUrl,
      privacy,
      videos = [],
      galleryImages = [],
      resumeData = {},
      isVerified = false,
      status = 'pending_verification',
      userId
    } = body;

    const validName = (name || body.name || 'Faculty Member').trim();

    // Process detailed address if provided
    let processedAddressDetails: FacultyAddressDetails | undefined = undefined;
    let computedAddress = address || '';
    let computedLocation = address || '';

    if (addressDetails) {
      const state = (addressDetails.state || '').trim();
      const district = (addressDetails.district || '').trim();
      const pincode = (addressDetails.pincode || '').trim();
      const blockOrCluster = (addressDetails.blockOrCluster || '').trim();
      const localAddress = (addressDetails.localAddress || '').trim();
      const googleMapLocation = (addressDetails.googleMapLocation || '').trim();

      // Parse coordinates from googleMapLocation if provided
      const parsedCoords = googleMapLocation ? parseGoogleMapsLocation(googleMapLocation) : null;
      const latitude = addressDetails.latitude ?? parsedCoords?.latitude;
      const longitude = addressDetails.longitude ?? parsedCoords?.longitude;
      const liveLatitude = addressDetails.liveLatitude;
      const liveLongitude = addressDetails.liveLongitude;

      let distanceKm: number | undefined = addressDetails.distanceKm;
      let isLocationVerified = Boolean(addressDetails.isLocationVerified);
      let verificationStatus: 'verified_within_2km' | 'outside_2km' | 'gps_detected' | 'unverified' = 'unverified';

      if (latitude !== undefined && longitude !== undefined && liveLatitude !== undefined && liveLongitude !== undefined) {
        distanceKm = calculateHaversineDistanceKm(liveLatitude, liveLongitude, latitude, longitude);
        if (distanceKm <= 2.0) {
          isLocationVerified = true;
          verificationStatus = 'verified_within_2km';
        } else {
          isLocationVerified = false;
          verificationStatus = 'outside_2km';
        }
      } else if (addressDetails.source === 'browser_gps' && (latitude !== undefined || liveLatitude !== undefined)) {
        distanceKm = 0.0;
        isLocationVerified = true;
        verificationStatus = 'gps_detected';
      }

      processedAddressDetails = {
        state: state || 'Haryana',
        district: district || 'Palwal',
        pincode: pincode || '121102',
        blockOrCluster: blockOrCluster || undefined,
        localAddress: localAddress || '',
        googleMapLocation: googleMapLocation || '',
        latitude,
        longitude,
        liveLatitude,
        liveLongitude,
        distanceKm,
        isLocationVerified,
        verificationStatus,
        verifiedAt: isLocationVerified ? new Date().toISOString() : undefined,
        source: addressDetails.source || (parsedCoords ? 'pasted_maps_url' : 'manual_coordinates'),
      };

      const addrParts = [localAddress, blockOrCluster, district, state].filter(Boolean);
      computedAddress = addrParts.join(', ') + (pincode ? ` - ${pincode}` : '');
      computedLocation = [district, state].filter(Boolean).join(', ') || 'India';
    }

    const cleanSubject = (subject || 'physics').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanSlug = slug
      ? slug.trim().replace(/[^a-zA-Z0-9_-]/g, '')
      : name.replace(/[^a-zA-Z0-9]/g, '') + '-' + Date.now().toString().slice(-4);

    const accessKey = body.accessKey && body.accessKey.length === 20 ? body.accessKey : generateAccessKey();
    const categoryFolder = `best-Teacherfaculty/${cleanSubject}`;

    const facultyObj: FacultyProfile = {
      id: body.id || cleanSlug.toLowerCase(),
      facultyCode: body.facultyCode || undefined,
      userId: userId || null,
      name: validName,
      slug: cleanSlug,
      subject,
      category: categoryFolder,
      title: title || `Senior ${subject} Faculty`,
      experience: experience || '',
      phone: phone || '',
      altPhone: altPhone || '',
      email: email || '',
      address: computedAddress,
      location: computedLocation,
      addressDetails: processedAddressDetails,
      isLocationVerified: processedAddressDetails ? processedAddressDetails.isLocationVerified : false,
      isVerified: Boolean(isVerified),
      status: status || (isVerified ? 'verified' : 'pending_verification'),
      accessKey,
      photoUrl: photoUrl || imageLink || '/images/dev-sharma.jpg',
      videoLink: videoLink || '',
      privacy: privacy || { showPhone: true, showAltPhone: true, showEmail: true, showAddress: true },
      videos: Array.isArray(videos) ? videos : [],
      galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
      resumeData,
      sections: body.sections || (resumeData as any)?.sections || [],
      updatedAt: new Date().toISOString(),
    };

    await upsertFacultyProfile(facultyObj);

    // If verified, generate static fallback HTML if filesystem is writable
    if (facultyObj.isVerified) {
      try {
        const targetDir = path.join(process.cwd(), 'public', 'best-Teacherfaculty', cleanSubject);
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

        fs.writeFileSync(path.join(targetDir, `${cleanSlug}-videos.html`), generateGoogleVideosHtml(facultyObj), 'utf-8');
        fs.writeFileSync(path.join(targetDir, `${cleanSlug}-gallery.html`), generateGoogleGalleryHtml(facultyObj), 'utf-8');
      } catch (err) {
        // In serverless environments, static files are served dynamically via route handlers
      }
    }

    const keyedUrl = `https://resumes.cseel.org/${categoryFolder}/${accessKey}/${cleanSlug}-videos.html`;

    return NextResponse.json({
      success: true,
      message: facultyObj.isVerified ? 'Faculty profile published' : 'Faculty profile submitted for verification',
      keyedUrl,
      accessKey,
      facultyCode: facultyObj.facultyCode,
      faculty: facultyObj,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, isVerified, status, facultyCode, videos, galleryImages, name, title, experience, phone, email, address, addressDetails, isLocationVerified, photoUrl, privacy, resumeData } = body;
    
    if (!slug) {
      return NextResponse.json({ success: false, message: 'Slug is required' }, { status: 400 });
    }

    const list = await getAllFacultyProfiles();
    const faculty = list.find((f: any) => f.slug === slug || f.id === slug);
    if (!faculty) {
      return NextResponse.json({ success: false, message: 'Faculty not found' }, { status: 404 });
    }

    if (facultyCode) faculty.facultyCode = facultyCode;
    if (typeof isVerified === 'boolean') {
      faculty.isVerified = isVerified;
      faculty.status = isVerified ? 'verified' : 'pending_verification';
    }
    if (status) faculty.status = status;
    if (privacy) faculty.privacy = privacy;
    if (Array.isArray(videos)) faculty.videos = videos;
    if (Array.isArray(galleryImages)) faculty.galleryImages = galleryImages;
    if (resumeData) faculty.resumeData = resumeData;
    if (name) faculty.name = name;
    if (title) faculty.title = title;
    if (experience) faculty.experience = experience;
    if (phone) faculty.phone = phone;
    if (email) faculty.email = email;
    if (address) faculty.address = address;
    if (photoUrl) faculty.photoUrl = photoUrl;
    if (addressDetails) {
      faculty.addressDetails = addressDetails;
      if (typeof isLocationVerified === 'boolean') {
        faculty.isLocationVerified = isLocationVerified;
      } else if (typeof addressDetails.isLocationVerified === 'boolean') {
        faculty.isLocationVerified = addressDetails.isLocationVerified;
      }
      if (addressDetails.district && addressDetails.state) {
        faculty.location = `${addressDetails.district}, ${addressDetails.state}`;
        faculty.address = `${addressDetails.localAddress || ''}${addressDetails.blockOrCluster ? ', ' + addressDetails.blockOrCluster : ''}, ${addressDetails.district}, ${addressDetails.state} - ${addressDetails.pincode || ''}`;
      }
    } else if (typeof isLocationVerified === 'boolean') {
      faculty.isLocationVerified = isLocationVerified;
    }
    if (!faculty.accessKey || faculty.accessKey.length !== 20) {
      faculty.accessKey = generateAccessKey();
    }
    faculty.updatedAt = new Date().toISOString();

    await upsertFacultyProfile(faculty);

    // If verified, generate or update static files if filesystem is writable
    try {
      const cleanSubject = (faculty.subject || 'physics').toLowerCase().replace(/[^a-z0-9]/g, '');
      const targetDir = path.join(process.cwd(), 'public', 'best-Teacherfaculty', cleanSubject);
      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

      fs.writeFileSync(path.join(targetDir, `${faculty.slug}-videos.html`), generateGoogleVideosHtml(faculty), 'utf-8');
      fs.writeFileSync(path.join(targetDir, `${faculty.slug}-gallery.html`), generateGoogleGalleryHtml(faculty), 'utf-8');
    } catch (err) {
      // Ignore in serverless environments where filesystem is read-only
    }

    return NextResponse.json({
      success: true,
      message: 'Faculty profile and verification status updated',
      faculty,
      keyedUrl: `https://resumes.cseel.org/best-Teacherfaculty/${(faculty.subject || 'physics').toLowerCase()}/${faculty.accessKey}/${faculty.slug}-videos.html`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ success: false, message: 'Slug parameter is required' }, { status: 400 });
    }

    await deleteFacultyProfile(slug);
    return NextResponse.json({ success: true, message: 'Faculty profile deleted successfully from Supabase and local cache' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
