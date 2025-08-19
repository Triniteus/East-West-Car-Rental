import { type NextRequest, NextResponse } from "next/server"

// Mock Razorpay order creation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = "INR", receipt } = body

    // In a real implementation, you would use Razorpay SDK
    // const razorpay = new Razorpay({
    //   key_id: process.env.RAZORPAY_KEY_ID,
    //   key_secret: process.env.RAZORPAY_KEY_SECRET,
    // })

    // Mock order creation
    const order = {
      id: `order_${Date.now()}`,
      entity: "order",
      amount: amount * 100, // Razorpay expects amount in paise
      amount_paid: 0,
      amount_due: amount * 100,
      currency,
      receipt,
      status: "created",
      attempts: 0,
      created_at: Math.floor(Date.now() / 1000),
    }

    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error) {
    console.error("Order creation failed:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}
