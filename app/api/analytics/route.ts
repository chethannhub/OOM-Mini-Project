import { NextRequest, NextResponse } from 'next/server'
import { getAnalytics } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const lotId = request.nextUrl.searchParams.get('lot_id')
    const date = request.nextUrl.searchParams.get('date')

    if (!lotId) {
      return NextResponse.json(
        { success: false, error: 'Lot ID is required' },
        { status: 400 }
      )
    }

    const analytics = await getAnalytics(parseInt(lotId), date || undefined)

    return NextResponse.json({
      success: true,
      data: analytics
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
