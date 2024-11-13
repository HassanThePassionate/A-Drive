"use client";
import { avatarPlaceholderUrl, navItems } from "@/constant";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
interface Props {
  full_name: string;
  email: string;
  avatar: string;
}
const Sidebar = ({ full_name, email, avatar }: Props) => {
  const pathName = usePathname();
  return (
    <aside className='sidebar'>
      <Link href='/'>
        <Image
          src='/assets/icons/logo-full-brand.svg'
          alt='logo'
          height={50}
          width={160}
          className='hidden h-auto lg:block'
        />
        <Image
          src='/assets/icons/logo-brand.svg'
          alt='logo'
          height={52}
          width={52}
          className='lg:hidden'
        />
      </Link>
      <nav className='sidebar-nav'>
        <ul className='flex flex-1 flex-col gap-6'>
          {navItems.map(({ icon, url, name }) => (
            <Link href={url} key={name} className='lg:w-full'>
              <li
                className={cn(
                  "sidebar-nav-item",
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
                <p className='hidden lg:block'>{name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
      <Image
        src='/assets/images/files-2.png'
        alt='file-img'
        width={506}
        height={418}
        className='w-full'
      />
      <div className='sidebar-user-info'>
        <Image
          src={avatar}
          alt='avatar'
          height={44}
          width={44}
          className='sidebar-user-avatar'
        />
        <div className='hidden lg:block'>
          <p className='subtitle-2 capitalize'>{full_name}</p>
          <p className='caption'>{email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
