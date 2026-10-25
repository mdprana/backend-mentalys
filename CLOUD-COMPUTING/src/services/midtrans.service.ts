import * as fs from 'fs'
import * as path from 'path'
import axios from 'axios'
import { doc, getDoc } from '@firebase/firestore'
import { db } from '../config/firebase.config'
import { Psychiatrist } from '../types/psychiatrist.type'

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY
if (!SERVER_KEY) {
  throw new Error('MIDTRANS_SERVER_KEY is not defined in environment variables')
}

const IS_PRODUCTION = false
const API_URL = IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/v1/transactions'
  : 'https://app.sandbox.midtrans.com/snap/v1/transactions'

export const midtransService = {
  async processTransaction(
    user: { uid: string; email: string },
    psychiatristId: string,
    requestPhoneNumber?: string
  ) {
    // Fetch psychiatrist details from PsikiaterDummy.json
    const filePath = path.join(__dirname, '../data/PsikiaterDummy.json')
    const psychiatristData = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    const userDocRef = doc(db, 'profiles', user.uid)
    const userDocSnap = await getDoc(userDocRef)

    // Validate user document exists
    if (!userDocSnap.exists()) {
      throw new Error('User profile not found')
    }

    const userData = userDocSnap.data()

    // Find selected psychiatrist
    const selectedPsychiatrist = psychiatristData.find(
      (psychiatrist: Psychiatrist) => psychiatrist.id === psychiatristId
    )

    if (!selectedPsychiatrist) {
      throw new Error('Psychiatrist not found')
    }

    // Determine phone number to use
    const phoneToUse = requestPhoneNumber || userData?.phoneNumber

    // Prepare customer details
    const customerDetails = {
      first_name: userData?.full_name,
      email: user.email,
      phone: phoneToUse,
      billing_address: {
        address: userData?.location || ''
      },
      shipping_address: {
        address: ''
      }
    }

    const orderId = `order-${Date.now()}-${user.uid}`
    const requestBody = {
      transaction_details: {
        order_id: orderId,
        gross_amount: selectedPsychiatrist.consultationFee
      },
      item_details: [
        {
          id: psychiatristId,
          price: selectedPsychiatrist.consultationFee,
          quantity: 1,
          name: selectedPsychiatrist.fullName
        }
      ],
      customer_details: customerDetails
    }

    // Make Midtrans API request
    const response = await axios.post(API_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(`${SERVER_KEY}:`).toString('base64')}`
      }
    })

    return response.data
  }
}
