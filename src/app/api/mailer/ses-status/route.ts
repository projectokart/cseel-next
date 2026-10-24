import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const awsCliPath = 'C:\\Users\\DEVENDER\\AppData\\Local\\Programs\\Amazon\\AWSCLIV2\\aws.exe';
    const cmd = `"${awsCliPath}" sesv2 get-account --region ap-southeast-2 --profile cseel`;

    const { stdout } = await execAsync(cmd);
    const data = JSON.parse(stdout);

    const productionAccess = data?.ProductionAccessEnabled || false;
    const max24HourSend = data?.SendQuota?.Max24HourSend || 200;
    const maxSendRate = data?.SendQuota?.MaxSendRate || 1.0;
    const sentLast24Hours = data?.SendQuota?.SentLast24Hours || 0;
    const reviewStatus = data?.Details?.ReviewDetails?.Status || 'UNKNOWN';
    const caseId = data?.Details?.ReviewDetails?.CaseId || null;

    return NextResponse.json({
      success: true,
      productionAccess,
      max24HourSend,
      maxSendRate,
      sentLast24Hours,
      reviewStatus,
      caseId,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to check AWS account status',
      productionAccess: false,
    }, { status: 500 });
  }
}
