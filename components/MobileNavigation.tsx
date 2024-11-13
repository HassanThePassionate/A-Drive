"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Separator } from "./ui/separator";
import { navItems } from "@/constant";
import Link from "next/link";
import { cn } from "@/lib/utils";
import FileUploader from "./FileUploader";
import { Button } from "./ui/button";
import { signOutUser } from "@/lib/actions/user.action";
interface Props {
  ownerId: string;
  accountId: string;
  avatar: string;
  email: string;
  full_name: string;
}

const MobileNavigation = ({
  ownerId,
  accountId,
  avatar,
  email,
  full_name,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();
  return (
    <header className='mobile-header'>
      <Image
        src='/assets/icons/logo-full-brand.svg'
        alt='logo'
        height={52}
        width={120}
        className='h-auto'
      />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Image
            src='/assets/icons/menu.svg'
            alt='Menu'
            height={30}
            width={30}
          />
        </SheetTrigger>
        <SheetContent className='shad-sheet h-screen px-3'>
          <SheetTitle>
            <div className='header-user'>
              <Image
                src={avatar}
                alt='Avatar'
                height={44}
                width={44}
                className='header-user-avatar'
              />
              <div className='sm:hidden lg:block'>
                <p className='subtitle-2 capitalize'>{full_name}</p>
                <p className='caption'>{email}</p>
              </div>
            </div>
            <Separator className='mb-4 bg-light-200/20' />
          </SheetTitle>
          <nav className='mobile-nav'>
            <ul className='mobile-nav-list'>
              {navItems.map(({ icon, url, name }) => (
                <Link href={url} key={name} className='lg:w-full'>
                  <li
                    className={cn(
                      "mobile-nav-item",
                      pathName === url && "shad-active"
                    )}
                  >
                    <Image
                      src={icon}
                      alt='name'
                      height={24}
                      width={24}
                      className={cn(
                        "nav-icon",
                        pathName === url && "nav-icon-active"
                      )}
                    />
                    <p>{name}</p>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>
          <Separator className='my-5 bg-light-200/20' />
          <div className='flex flex-col gap-5 justify-between pb-5'>
            <FileUploader />
            <Button
              type='button'
              className='mobile-sign-out-button'
              onClick={async () => await signOutUser()}
            >
              <Image
                src='/assets/icons/logout.svg'
                alt='logout'
                width={24}
                height={24}
              />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
