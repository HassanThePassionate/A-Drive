import Image from "next/image";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex min-h-screen'>
      <section className='p-10 bg-brand w-1/2 hidden lg:flex items-center justify-center xl:w-2/5'>
        <div className='flex flex-col max-h-[800px] max-w-[430px] justify-center space-y-12'>
          <Image
            src='/assets/icons/logo-full.svg'
            alt='logo'
            width={224}
            height={82}
            className='h-auto'
          />
          <div className='space-y-5 text-white'>
            <h1 className='h1'>Manage your files to best way</h1>
            <p className='body-1'>
              This is the place where you can store all the documents.
            </p>
          </div>
          <Image
            src='/assets/images/files.png'
            alt='files'
            height={342}
            width={342}
            className='transition hover:rotate-2 scale-105'
          />
        </div>
      </section>
      <section className='flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0'>
        <div className='mb-16 lg:hidden'>
          <Image
            src='/assets/icons/logo-full-brand.svg'
            alt='logo'
            width={224}
            height={82}
            className='h-auto w-[200px] lg:w-[250px]'
          />
        </div>
        {children}
      </section>
    </div>
  );
};

export default layout;
