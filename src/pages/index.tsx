import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`} description="Build better code with PCode">
      <main>
        <div style={{ padding: '4rem 0', textAlign: 'center', background: 'linear-gradient(180deg, var(--ifm-background-color) 0%, var(--ifm-color-emphasis-100) 100%)' }}>
          <div className="container">
            <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              {siteConfig.title}
            </h1>
            <p style={{ fontSize: '1.5rem', color: 'var(--ifm-color-secondary)', marginBottom: '2rem' }}>
              {siteConfig.tagline}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <a className="button button--primary button--lg" href="/docs/installation">
                Get Started
              </a>
              <a className="button button--secondary button--lg" href="/docs/feature-guides">
                Learn More
              </a>
            </div>
          </div>
        </div>

        <div style={{ padding: '4rem 0' }}>
          <div className="container">
            <div className="row">
              <div className="col col--4">
                <h2>🚀 Easy Installation</h2>
                <p>Get up and running in minutes with our simple setup process.</p>
              </div>
              <div className="col col--4">
                <h2>📚 Comprehensive Docs</h2>
                <p>Detailed guides, examples, and best practices at your fingertips.</p>
              </div>
              <div className="col col--4">
                <h2>💬 Active Community</h2>
                <p>Join our growing community of developers using PCode.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
