'use client'

import {Image} from "@heroui/image";
import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';
 
export default function NotFound() {
  const router = useRouter();

  const goToMainPage = () => {
    router.push(`/`);
  };

  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <Image
        width={300}
        alt="Loading cat"
        src="/cat404.png"/>
      <h2 className="text-xl font-semibold">404 Страница не найдена</h2>
      <Button onPress={goToMainPage} radius="sm" className="main-button h-8">На главную</Button>
    </main>
  );
}