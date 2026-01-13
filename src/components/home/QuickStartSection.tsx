import React from 'react';
import Link from '@docusaurus/Link';
import styles from './home.module.css';

export default function QuickStartSection(): JSX.Element {
  return (
    <section className={styles.quickStartSection}>
      <div className="container">
        <div className={styles.quickStartContent}>
          <h2 className={styles.quickStartTitle}>准备好了吗？开始你的 PCode 之旅</h2>
          <div className={styles.quickStartLinks}>
            <Link
              className="button button--primary button--lg"
              to="/docs/quick-start/installation"
            >
              📦 安装指南
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="/docs/quick-start/create-first-project"
            >
              🚀 创建项目
            </Link>
            <Link
              className="button button--outline button--lg"
              to="/docs/quick-start/proposal-session"
            >
              💻 开始编码
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
