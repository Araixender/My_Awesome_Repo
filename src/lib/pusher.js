import Pusher from 'pusher'

export const pusher = new Pusher({
    appId: process.env.APP_ID,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    secret: process.env.SECRET,
    cluster: process.env.CLUSTER,
    useTLS: true,
})