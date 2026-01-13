import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HeroSection from '../components/home/HeroSection';
import FeaturesShowcase from '../components/home/FeaturesShowcase';
import ShowcaseSection from '../components/home/ShowcaseSection';
import QuickStartSection from '../components/home/QuickStartSection';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`} description="智能 · 便捷 · 有趣 - 用 AI 重新定义代码开发体验">
      <main>
        <HeroSection />
        <FeaturesShowcase />
        <ShowcaseSection />
        <QuickStartSection />
      </main>
    </Layout>
  );
}
