import { Helmet } from 'react-helmet-async';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Tinnzstore',
  url: 'https://tinnzstore.com',
  logo: 'https://tinnzstore.com/logo.png',
  description: 'Hosting premium Minecraft, VPS, Dedicated Server dan Baremetal di Indonesia.',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+62-878-4481-2351',
    contactType: 'customer service',
    availableLanguage: ['Indonesian', 'English']
  },
  sameAs: [
    'https://www.instagram.com/tinnzstore_id',
    'https://www.tiktok.com/@tinnzstore_id'
  ]
};

export const JsonLd: React.FC = () => (
  <Helmet>
    <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
  </Helmet>
);
