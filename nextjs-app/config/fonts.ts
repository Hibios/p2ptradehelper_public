import localFont from 'next/font/local';

export const fontSans = localFont({
  src: [
    { path: '/fonts/SBSansTextCond-Regular.woff', weight: '400', style: 'normal' },
    { path: '/fonts/SBSansTextCond-Bold.woff', weight: '700', style: 'normal' },
  ],
  variable: '--font-sans',
});

export const fontMono = localFont({
  src: [
    { path: '/fonts/SBSansCondMono-Regular.woff', weight: '400', style: 'normal' },
    { path: '/fonts/SBSansCondMono-Bold.woff', weight: '700', style: 'normal' },
  ],
  variable: '--font-mono',
});