import React from 'react';
import Layout from '@theme-original/DocItem/Layout';
import type LayoutType from '@theme/DocItem/Layout';
import type { WrapperProps } from '@docusaurus/types';
import Head from '@docusaurus/Head';
import { useDoc } from '@docusaurus/plugin-content-docs/client';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): JSX.Element {
  const { metadata } = useDoc();

  // Build breadcrumb items from the doc's path
  const breadcrumbItems = React.useMemo(() => {
    const items = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://laruss.github.io/react-text-game/',
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
      const url = `https://laruss.github.io/react-text-game/${pathParts.slice(0, index + 1).join('/')}`;

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
