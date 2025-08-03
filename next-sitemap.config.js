// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://redtestlab.com', // your production domain
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: [], // add paths you want to exclude
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [], // optional
      },
    ],
  },
};
