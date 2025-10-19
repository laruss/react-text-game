import Head from '@docusaurus/Head';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import type { WrapperProps } from '@docusaurus/types';
import type LayoutType from '@theme/DocItem/Layout';
import Layout from '@theme-original/DocItem/Layout';
import React from 'react';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props) {
  const { metadata } = useDoc();

  // Build breadcrumb items from the doc's path
  const breadcrumbItems = React.useMemo(() => {
    const items = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://reacttextgame.dev/',
      },
    ];

    // Parse the permalink to build breadcrumbs
    const pathParts = metadata.permalink
      .replace('/react-text-game/', '')
      .split('/')
      .filter(Boolean);

    pathParts.forEach((part, index) => {
      const position = index + 2;
      const isLast = index === pathParts.length - 1;
      const url = `https://reacttextgame.dev/${pathParts.slice(0, index + 1).join('/')}`;

      items.push({
        '@type': 'ListItem',
        position,
        name: isLast ? metadata.title : part.replace(/-/g, ' '),
        item: url,
      });
    });

    return items;
  }, [metadata.permalink, metadata.title]);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };

  return (
    <>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Head>
      <Layout {...props} />
    </>
  );
}
