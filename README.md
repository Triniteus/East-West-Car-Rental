{
  "name": "east-west-car-rental",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "^18",
    "react-dom": "^18",
    "@supabase/supabase-js": "^2.39.7",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "typescript": "^5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "sonner": "^1.4.3",
    "lucide-react": "^0.263.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "eslint": "^8",
    "eslint-config-next": "14.2.3"
  }
}

/* 
## COMPLETE SETUP GUIDE

### Step 1: Install Dependencies
Run the following command to install all required packages:

```bash
npm install @supabase/supabase-js bcryptjs jsonwebtoken sonner @types/bcryptjs @types/jsonwebtoken
```

### Step 2: Set up Supabase Project
1. Go to https://supabase.com and create a new project
2. Wait for the project to be fully initialized
3. Go to Settings > API to get your project URL and keys
4. Go to SQL Editor and run the provided SQL schema to create all tables

### Step 3: Configure Environment Variables
Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin JWT Secret (generate a strong random string)
ADMIN_JWT_SECRET=your-super-secret-jwt-key-for-admin-auth

# NextAuth Configuration  
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### Step 4: Create Required UI Components
Make sure you have the following shadcn/ui components installed:
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add textarea
```

### Step 5: File Structure
Create the following directory structure:

```
app/
├── (admin)/
│   └── admin/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── login/
│       │   └── page.tsx
│       ├── bookings/
│       │   └── page.tsx
│       ├── vehicles/
│       │   └── page.tsx
│       └── messages/
│           └── page.tsx
├── api/
│   ├── admin/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   └── logout/
│   │   │       └── route.ts
│   │   └── bookings/
│   │       └── route.ts
│   ├── bookings/
│   │   └── route.ts
│   ├── contact/
│   │   └── route.ts
│   └── vehicles/
│       └── route.ts
├── contact/
│   └── page.tsx
└── booking/
    ├── self-drive/
    │   └── page.tsx
    └── chauffeur/
        └── page.tsx

lib/
├── admin-auth.ts
└── booking-utils.ts

components/
├── ui/
│   ├── button.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── separator.tsx
│   ├── checkbox.tsx
│   ├── skeleton.tsx
│   └── textarea.tsx
├── calendar.tsx
├── booking-form-step1.tsx
├── booking-form-step2.tsx
├── vehicle-selection-with-availability.tsx
├── whatsapp-quote.tsx
├── whatsapp-thank-you.tsx
├── payment-gateway.tsx
├── booking-confirmation.tsx
└── date-time-picker.tsx
```

### Step 6: Update Existing Components
Replace your existing booking components with the updated versions provided. The main changes:

1. **booking-utils.ts** - Now fetches data from Supabase instead of hardcoded arrays
2. **All form components** - Updated to use responsive design and new utilities
3. **Contact form** - Now saves to database via API
4. **Payment components** - Updated to save booking data to database

### Step 7: Admin Setup
1. The SQL schema creates a default admin user:
   - Email: admin@eastwest.com
   - Password: admin123

2. **IMPORTANT**: Change this password immediately after first login!

3. Access the admin panel at: http://localhost:3000/admin

### Step 8: Admin Features
The admin panel includes:

1. **Dashboard**: Overview of bookings, revenue, and messages
2. **Bookings Management**: View all customer bookings with filtering and search
3. **Vehicle Management**: Add, edit, deactivate vehicles and manage pricing
4. **Messages**: View contact form submissions
5. **Secure Authentication**: JWT-based login system

### Step 9: Database Row Level Security (RLS)
The setup includes proper RLS policies:
- Public users can view vehicles and rates (read-only)
- Public users can insert bookings and contact messages
- Admin users have full access to all data via service role key

### Step 10: Production Deployment
For production:

1. Update environment variables with production URLs
2. Set secure CORS policies in Supabase
3. Configure proper database backups
4. Set up monitoring and logging
5. Update the default admin credentials

### Step 11: Testing the Setup
1. Start your development server: `npm run dev`
2. Test the booking flow on the main site
3. Submit a contact form message
4. Log into admin panel and verify data appears
5. Test admin functions like viewing bookings and managing vehicles

### Security Notes
- Admin authentication uses httpOnly cookies for security
- JWT tokens expire after 24 hours
- All sensitive operations require admin authentication
- Database uses Row Level Security for data protection
- Passwords are hashed with bcrypt

### Troubleshooting
Common issues and solutions:

1. **Supabase connection errors**: Check your URL and keys in .env.local
2. **Admin login fails**: Ensure you've run the SQL schema to create admin_users table
3. **Components not found**: Make sure all shadcn/ui components are installed
4. **API routes 404**: Ensure file structure matches exactly as shown above
5. **Database errors**: Check Supabase logs in the dashboard

This complete setup gives you a fully functional car rental booking system with admin panel!
*/