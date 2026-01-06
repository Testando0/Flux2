import "./globals.css";

export const metadata = {
  title: "FLUX Turbo Generator",
  description: "Gerador de imagens ultra-rápido",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className="bg-slate-950 text-white">{children}</body>
    </html>
  );
}
