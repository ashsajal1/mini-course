import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import prisma from '@/prisma/client'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400
    })
  }

  // Handle the event
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id } = evt.data

    try {
      await prisma.user.create({
        data: {
          clerk_id: id,
        },
      })
      console.log(`User created with clerk_id: ${id}`)
    } catch (error) {
      console.error('Error creating user in DB:', error)
      return new Response('Error creating user', { status: 500 })
    }
  } else if (eventType === 'user.updated') {
    const { id } = evt.data
    // Ensure user exists
    try {
        await prisma.user.upsert({
            where: { clerk_id: id },
            update: {}, // No fields to update currently
            create: { clerk_id: id },
        })
        console.log(`User updated/ensured with clerk_id: ${id}`)
    } catch (error) {
        console.error('Error updating user in DB:', error)
        return new Response('Error updating user', { status: 500 })
    }

  } else if (eventType === 'user.deleted') {
    const { id } = evt.data
    if (id) {
        try {
            await prisma.user.update({
                where: { clerk_id: id },
                data: { deleted_at: new Date() }
            })
            console.log(`User deleted (soft) with clerk_id: ${id}`)
        } catch (error) {
            console.error('Error deleting user in DB:', error)
            return new Response('Error deleting user', { status: 500 })
        }
    }
  }

  return new Response('', { status: 200 })
}
