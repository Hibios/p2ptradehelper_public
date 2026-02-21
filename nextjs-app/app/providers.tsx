'use client'
import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes";
import { ModalProvider } from "./contexts/ModalContext";
import { HeaderProvider } from "./contexts/HeaderContext";

export interface HeaderProviderProps {
  headers: { [key: string]: string };
  children: React.ReactNode;
}

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}


export interface ProviderProps {
  children: React.ReactNode;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
    </HeroUIProvider>
  );
}

export function ErrorProviders(props: ProviderProps) {
  return (
    <HeroUIProvider>
      <ModalProvider>{props.children}</ModalProvider>
    </HeroUIProvider>
  );
}

export function HeadersProviders({ headers, children }: HeaderProviderProps) {
  return (
    <HeroUIProvider>
      <HeaderProvider headers={headers}>{children}</HeaderProvider>
    </HeroUIProvider>
  );
}

