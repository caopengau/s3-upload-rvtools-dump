'use client'

import Link from "next/link"
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { useState } from "react"

import { constructTagging } from "./util"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Component() {

  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!file) {
      alert('Please select a file to upload.')
      return
    }

    setUploading(true)

    const tagSets = {
      firstName: (e.currentTarget.elements.namedItem('firstName') as HTMLInputElement).value,
      lastName: (e.currentTarget.elements.namedItem('lastName') as HTMLInputElement).value,
      email: (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value,
      accountManager: (e.currentTarget.elements.namedItem('accountManager') as HTMLInputElement).value,
      phone: (e.currentTarget.elements.namedItem('phone') as HTMLInputElement).value,
    }

    const response = await fetch('/api/upload',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: file.name, contentType: file.type, tagSets }),
      }
    )

    if (response.ok) {
      const { url, fields } = await response.json()
      const formData = new FormData()
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string)
      })
      formData.append('Tagging', constructTagging(tagSets))

      formData.append('file', file)

      const uploadResponse = await fetch(url, {
        method: 'POST',
        body: formData
      })

      if (uploadResponse.ok) {
        alert('Upload successful!')
      } else {
        console.error('S3 Upload Error:', uploadResponse)
        alert('Upload failed.')
      }
    } else {
      alert('Failed to get pre-signed URL.')
    }

    setUploading(false)
  }

  return (
    <div className="flex flex-col h-screen">
      <nav className="bg-[#FEC40E] p-4 text-black">
        <div className="container mx-auto flex justify-between items-center">
          <Image src="/assets/logo.svg" alt="Logo"
            width={100}
            height={50} />
          <div className="flex space-x-4">
            {/* <Link href="#">
              <LayoutDashboardIcon className="h-4 w-4" />
              <span className="sr-only">Dashboard</span>
            </Link>
            <Link href="#">
              <UsersIcon className="h-4 w-4" />
              <span className="sr-only">Users</span>
            </Link>
            <Link href="#">
              <SettingsIcon className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Link> */}
          </div>
        </div>
      </nav>
      <div className="mt-10 flex-grow mb-10">
        <form onSubmit={handleSubmit}>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Zip File Upload Management</CardTitle>
              <CardDescription>Enter meta details to the file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" placeholder="John" required defaultValue={''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="johndoe@example.com" required type="email" defaultValue={''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountManager">Account Manager</Label>
                  <Input id="accountManager" placeholder="John Doe" required defaultValue={''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="04xxxxxxxx" required defaultValue={''} />
                </div>
              </div>
            </CardContent>

            <CardContent>
              <h1 className="text-2xl font-bold">Pick a File</h1>
              <div className="flex justify-center">
                <input
                  id="file"
                  type="file"
                  onChange={(e) => {
                    const files = e.target.files
                    if (files) {
                      setFile(files[0])
                    }
                  }}
                  accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full mt-4" type="submit" disabled={uploading}>
                Submit
              </Button>
            </CardFooter>

          </Card>
        </form>
      </div>
      <footer className="bg-[#FEC40E] p-4 text-center text-black">
        <p>© 2024 V2 Digital. All rights reserved.</p>
      </footer>
    </div>
  )
}

function LayoutDashboardIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  )
}


function SettingsIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}


function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}