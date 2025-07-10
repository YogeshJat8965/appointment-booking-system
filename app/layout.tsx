import { AppointmentProvider } from '@/context/AppointmentContext'
import './globals.css'

export const metadata = {
  title: 'Doctor Appointment System',
  description: 'A comprehensive doctor appointment management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppointmentProvider>
          {children}
        </AppointmentProvider>
      </body>
    </html>
  )
}
