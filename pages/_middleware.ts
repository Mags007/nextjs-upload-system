import { server } from 'config/api';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
   const cookies = req.cookies;
   const uploadKey = cookies['upload_key'];
   const privatePages = ['/', '/shorter', '/haste'];
   let blockedPage = false;
   privatePages.forEach((page) => {
      if (req.nextUrl.pathname === page) blockedPage = true;
   });

   const response = await fetch(`${server}/api/auth/validateuploadkey`, {
      method: 'GET',
      headers: {
         Authorization: uploadKey,
      },
   });
   const json = await response?.json().catch(() => {});
   const isValideUploadKey = json?.valide || false;

   if (req.nextUrl.pathname?.startsWith('/dashboard')) blockedPage = true;

   if (
      blockedPage &&
      !isValideUploadKey &&
      ['/', '/shorter', '/haste'].includes(req.nextUrl.pathname)
   ) {
      const settings = await fetch(`${server}/api/settings`, {
         method: 'GET',
      });
      const settingsJson: {
         name: string;
         value: 'true' | 'false';
      }[] = await settings?.json().catch(() => {});
      const publicHaste = settingsJson.find(
         (setting) => setting.name === 'publicHaste',
      );
      const publicShorter = settingsJson.find(
         (setting) => setting.name === 'publicShorter',
      );
      const publicUpload = settingsJson.find(
         (setting) => setting.name === 'publicUpload',
      );
      if (publicHaste?.value === 'true' && req.nextUrl.pathname === '/haste') {
         blockedPage = false;
      }
      if (
         publicShorter?.value === 'true' &&
         req.nextUrl.pathname === '/shorter'
      ) {
         blockedPage = false;
      }
      if (publicUpload?.value === 'true' && req.nextUrl.pathname === '/') {
         blockedPage = false;
      }
   }

   if (
      !isValideUploadKey &&
      !req.nextUrl.pathname?.startsWith('/login') &&
      blockedPage
   ) {
      return NextResponse.redirect('/login?redirect=' + req.nextUrl.pathname);
   }
   return NextResponse.next();
}
