
import "./globals.css";
import FathomAnalytics from "../components/FathomAnalytics";
import { client } from "../sanity/client";
import ThemeWrapper from "../components/layout/ThemeWrapper";
import Layout from "../components/layout/Layout";


const SETTINGS_QUERY = `*[_type == "settings"][0]`;
const options = { next: { revalidate: 30 } };

export const metadata = async () => {
  const settings = await client.fetch(SETTINGS_QUERY, {}, options);
  const title = settings?.title || "Infinite Vision";
  return ({
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: settings?.description || "Infinite Vision - Painting and Outdoor Services. We provide high-quality painting and outdoor services for your home or business.", 
    // alternates: {
    //   types: {
    //     'application/rss+xml': `https://${process.env.NEXT_PUBLIC_DOMAIN}/feed.xml`,
    //   },
    // }
  })
};

export default async function RootLayout({ children }) {

  const settings = await client.fetch(SETTINGS_QUERY, {}, options);

  const theme = settings?.theme || "light";
  
  return (
    <html lang="en" className="bg-neutral">
      <FathomAnalytics />
      
      <body className="bg-base-100">
        <ThemeWrapper theme={theme}>
        
        <Layout settings={settings}>
          {children}
        </Layout>
        </ThemeWrapper>
      </body>
    </html>
  );
}
