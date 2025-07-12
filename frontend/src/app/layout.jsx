
import "./globals.css";
import Providers from "./lib/Providers";


export const metadata = {
  title: "Academic Next App",
  description: "School app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
       
      >  <Providers>
         
            {children}
          
     </Providers>
      </body>
    </html>
  );
}






