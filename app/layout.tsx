import './globals.css'

export const metadata = {
  title: 'RVTools AWS S3 Upload',
  description: 'a Zip File Upload Management Portal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
