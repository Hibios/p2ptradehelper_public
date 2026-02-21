"use client"

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-row w-full pl-6">
      {children}
    </section>
  );
}