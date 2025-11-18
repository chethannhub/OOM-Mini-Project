"use client"

import Link from 'next/link'
import { MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">ParkGrid</span>
            </div>
            <p className="text-sm text-muted-foreground">Making parking hassle-free for everyone</p>
          </div>
          
          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Security", "FAQ"]
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers", "Contact"]
            },
            {
              title: "Legal",
              links: ["Privacy", "Terms", "Compliance", "Cookies"]
            }
          ].map((col, i) => (
            <div key={i} className="space-y-4">
              <h4 className="font-semibold">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2025 ParkGrid. All rights reserved.</p>
          <div className="flex gap-6">
            {["Twitter", "Facebook", "Instagram"].map((social, i) => (
              <Link key={i} href="#" className="text-sm text-muted-foreground hover:text-foreground transition">
                {social}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
