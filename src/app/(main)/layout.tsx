
'use client';

import React from 'react';
import Link from 'next/link';
import {
  Menu,
} from 'lucide-react';
import { Nav, type NavLink } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';

const navLinks: NavLink[] = [
  { title: 'المبيعات اليومية', href: '/sales', icon: 'ShoppingCart' },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-l bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-4">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/sales" className="flex items-center gap-2 font-semibold">
               <Image src="/logo.png" alt="Osama Al-Khateeb Logo" width={180} height={40} priority />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Nav links={navLinks} />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">تبديل قائمة التنقل</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
               <SheetTitle className="sr-only">قائمة التنقل الرئيسية</SheetTitle>
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                 <Link href="/sales" className="flex items-center gap-2 font-semibold">
                    <Image src="/logo.png" alt="Osama Al-Khateeb Logo" width={180} height={40} priority />
                </Link>
              </div>
              <Nav links={navLinks} />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
