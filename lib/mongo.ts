import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/'

let client: MongoClient | null = null
let db: Db | null = null

async function connect() {
  if (db) return db
  if (!client) {
    client = new MongoClient(uri)
    await client.connect()
  }
  db = client.db('oom')
  return db
}

export async function createBookingMongo(booking: any) {
  const database = await connect()
  const res = await database.collection('bookings').insertOne({
    ...booking,
    created_at: new Date(),
  })
  const inserted = await database.collection('bookings').findOne({ _id: res.insertedId })
  return inserted
}

export async function getBookingsMongo(userId?: number) {
  const database = await connect()
  const q: any = {}
  if (userId) q.user_id = userId
  const items = await database.collection('bookings').find(q).sort({ created_at: -1 }).toArray()
  return items
}

export async function createPaymentMongo(payment: any) {
  const database = await connect()
  const res = await database.collection('payments').insertOne({
    ...payment,
    created_at: new Date(),
  })
  const inserted = await database.collection('payments').findOne({ _id: res.insertedId })
  return inserted
}

export async function getPaymentsMongo(userId?: number) {
  const database = await connect()
  const q: any = {}
  if (userId) q.user_id = userId
  const items = await database.collection('payments').find(q).sort({ created_at: -1 }).toArray()
  return items
}

export async function closeMongo() {
  if (client) {
    await client.close()
    client = null
    db = null
  }
}

export default { connect, createBookingMongo, getBookingsMongo, createPaymentMongo, getPaymentsMongo, closeMongo }
