#### env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
AUTH_SECRET=""

DATABASE_URL=postgresql://postgres.

GUEPEX_API_URL=https://api.guepex.app/v1/parcels/
GUEPEX_API_ID=
GUEPEX_API_TOKEN=
GUEPEX_WEBHOOK_SECRET=1124b80b2d3bf81237e448ec41ae2bc0b246413af3ef0efc5133adb34a50583a

### Next Auth
https://www.youtube.com/watch?v=v6TPcU23wP8


### Prisma and Supabase
https://dev.to/isaacdyor/setting-up-nextjs-project-with-prisma-200j
npx prisma db push --force-reset
npx prisma studio
npx prisma migrate dev --name "Add status, message, and paymentId to Parcel model"
npx prisma generate

### Tunnel
https://docs.zrok.io/docs/getting-started/
https://myzrok.io/settings


### disable webwork in console
self.__WB_DISABLE_DEV_LOGS = true;
https://stackoverflow.com/questions/65952421/nextjs-remove-workbox-console-log-messages