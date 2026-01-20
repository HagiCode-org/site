import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import { Highlight } from 'prism-react-renderer';
import type { Token } from 'prism-react-renderer';
import styles from './docker-compose-generator.module.css';

// ============================================================================
// Type Definitions
// ============================================================================

type DatabaseType = 'internal' | 'external';
type HostOS = 'windows' | 'linux';
type LicenseKeyType = 'public' | 'custom';
type VolumeType = 'named' | 'bind';

interface DockerComposeConfig {
  // Basic settings
  httpPort: string;
  containerName: string;
  imageTag: string;
  hostOS: HostOS;

  // Environment (fixed)
  aspNetEnvironment: 'Production';
  timezone: 'Asia/Shanghai';

  // Database
  databaseType: DatabaseType;
  postgresDatabase: string;
  postgresUser: string;
  postgresPassword: string;
  externalDbHost?: string;
  externalDbPort?: string;
  volumeType: VolumeType;
  volumeName?: string;
  volumePath?: string;

  // API Keys
  licenseKeyType: LicenseKeyType;
  licenseKey: string;
  zaiApiKey: string;

  // Volume mounts
  workdirPath: string;
  workdirCreatedByRoot: boolean;

  // Advanced
  puid: string;
  pgid: string;
}

// ============================================================================
// Default Configuration
// ============================================================================

const defaultConfig: DockerComposeConfig = {
  httpPort: '45000',
  containerName: 'hagicode-app',
  imageTag: 'latest',
  hostOS: 'windows',
  aspNetEnvironment: 'Production',
  timezone: 'Asia/Shanghai',
  databaseType: 'internal',
  postgresDatabase: 'hagicode',
  postgresUser: 'postgres',
  postgresPassword: 'postgres',
  volumeType: 'named',
  volumeName: 'postgres-data',
  licenseKeyType: 'public',
  licenseKey: 'D76B5C-EC0A70-AEA453-BC9414-0A198D-V3',
  zaiApiKey: '',
  workdirPath: '',
  workdirCreatedByRoot: false,
  puid: '1000',
  pgid: '1000',
};

// ============================================================================
// YAML Generation Function
// ============================================================================

function generateYAML(config: DockerComposeConfig): string {
  const lines: string[] = [];

  // Header comment
  lines.push('# Hagicode Docker Compose 配置文件');
  lines.push('# 由 Docker Compose 生成器自动生成');
  lines.push(`# 生成时间: ${new Date().toLocaleString('zh-CN')}`);
  lines.push('');

  // Services section
  lines.push('services:');
  lines.push('  hagicode:');
  lines.push(`    image: newbe36524/hagicode:${config.imageTag}`);
  lines.push(`    container_name: ${config.containerName}`);
  lines.push('    environment:');
  lines.push(`      ASPNETCORE_ENVIRONMENT: ${config.aspNetEnvironment}`);
  lines.push('      ASPNETCORE_URLS: http://+:45000');
  lines.push(`      TZ: ${config.timezone}`);

  // Database connection string
  if (config.databaseType === 'internal') {
    lines.push(`      ConnectionStrings__Default: "Host=postgres;Port=5432;Database=${config.postgresDatabase};Username=${config.postgresUser};Password=${config.postgresPassword}"`);
  } else {
    lines.push(`      ConnectionStrings__Default: "Host=${config.externalDbHost};Port=${config.externalDbPort};Database=${config.postgresDatabase};Username=${config.postgresUser};Password=${config.postgresPassword}"`);
  }

  lines.push(`      License__Activation__LicenseKey: "${config.licenseKey}"`);

  // User mapping for Linux
  if (config.hostOS === 'linux' && (config.puid || config.pgid)) {
    lines.push(`      PUID: ${config.puid}`);
    lines.push(`      PGID: ${config.pgid}`);
  }

  lines.push(`      ZAI_API_KEY: "${config.zaiApiKey}"`);
  lines.push('    ports:');
  lines.push(`      - "${config.httpPort}:45000"`);
  lines.push('    volumes:');

  // Work directory mapping
  if (config.hostOS === 'windows') {
    lines.push(`      - ${config.workdirPath || 'C:\\\\repos'}:/app/workdir`);
  } else {
    lines.push(`      - ${config.workdirPath || '/home/user/repos'}:/app/workdir`);
  }

  // Depends on
  if (config.databaseType === 'internal') {
    lines.push('    depends_on:');
    lines.push('      postgres:');
    lines.push('        condition: service_healthy');
  }

  lines.push('    networks:');
  lines.push('      - pcode-network');
  lines.push('    restart: unless-stopped');

  // Internal PostgreSQL service
  if (config.databaseType === 'internal') {
    lines.push('');
    lines.push('  postgres:');
    lines.push('    image: bitnami/postgresql:latest');
    lines.push('    environment:');
    lines.push(`      POSTGRES_DATABASE: ${config.postgresDatabase}`);
    lines.push(`      POSTGRES_USER: ${config.postgresUser}`);
    lines.push(`      POSTGRES_PASSWORD: ${config.postgresPassword}`);
    lines.push('      POSTGRES_HOST_AUTH_METHOD: trust');
    lines.push(`      TZ: ${config.timezone}`);
    lines.push('    volumes:');

    if (config.volumeType === 'named') {
      const volName = config.volumeName || 'postgres-data';
      lines.push(`      - ${volName}:/bitnami/postgresql`);
    } else {
      const defaultPath = config.hostOS === 'windows' ? 'C:\\\\data\\\\postgres' : '/data/postgres';
      lines.push(`      - ${config.volumePath || defaultPath}:/bitnami/postgresql`);
    }

    lines.push('    healthcheck:');
    lines.push(`      test: ["CMD", "pg_isready", "-U", "${config.postgresUser}"]`);
    lines.push('      interval: 10s');
    lines.push('      timeout: 3s');
    lines.push('      retries: 3');
    lines.push('    networks:');
    lines.push('      - pcode-network');
    lines.push('    restart: unless-stopped');
  }

  // Volumes section
  if (config.databaseType === 'internal' && config.volumeType === 'named') {
    const volName = config.volumeName || 'postgres-data';
    lines.push('');
    lines.push('volumes:');
    lines.push(`  ${volName}:`);
  }

  // Networks section
  lines.push('');
  lines.push('networks:');
  lines.push('  pcode-network:');
  lines.push('    driver: bridge');

  return lines.join('\n');
}

// ============================================================================
// Internal Components
// ============================================================================

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'select';
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
}

function FormField({
  label,
  value,
  onChange,
  type = 'text',
  options,
  placeholder,
  required = false,
}: FormFieldProps): JSX.Element {
  const inputId = label.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

  return (
    <div className={styles.formField}>
      <label htmlFor={inputId} className={styles.fieldLabel}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
      {type === 'select' ? (
        <select
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.fieldInput}
          aria-required={required}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={styles.fieldInput}
          aria-required={required}
        />
      )}
    </div>
  );
}

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  description?: string;
  warning?: boolean;
}

function FormSection({ title, children, description, warning }: FormSectionProps): JSX.Element {
  return (
    <div className={`${styles.formSection} ${warning ? styles.sectionWarning : ''}`}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {description && <p className={styles.sectionDescription}>{description}</p>}
      {children}
    </div>
  );
}

interface ConfigFormProps {
  config: DockerComposeConfig;
  onChange: (config: DockerComposeConfig) => void;
}

function ConfigForm({ config, onChange }: ConfigFormProps): JSX.Element {
  const updateConfig = <K extends keyof DockerComposeConfig>(
    key: K,
    value: DockerComposeConfig[K]
  ): void => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className={styles.configForm}>
      {/* Header */}
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Docker Compose 配置生成器</h2>
      </div>

      {/* Basic Settings */}
      <FormSection title="基础配置">
        <div className={styles.formRow}>
          <FormField
            label="HTTP 端口"
            type="number"
            value={config.httpPort}
            onChange={(v) => updateConfig('httpPort', v)}
            placeholder="45000"
            required
          />
          <FormField
            label="容器名称"
            value={config.containerName}
            onChange={(v) => updateConfig('containerName', v)}
            placeholder="hagicode-app"
          />
        </div>
        <div className={styles.formRow}>
          <FormField
            label="镜像版本"
            type="select"
            value={config.imageTag}
            onChange={(v) => updateConfig('imageTag', v)}
            options={[
              { value: 'latest', label: 'latest' },
            ]}
          />
          <FormField
            label="宿主机操作系统"
            type="select"
            value={config.hostOS}
            onChange={(v) => updateConfig('hostOS', v as HostOS)}
            options={[
              { value: 'windows', label: 'Windows' },
              { value: 'linux', label: 'Linux' },
            ]}
          />
        </div>
      </FormSection>

      {/* Database Configuration */}
      <FormSection
        title="数据库"
        description={config.databaseType === 'external' ?
          '使用外部数据库时，请确保数据库用户具有创建表的权限。' :
          undefined
        }
      >
        <div className={styles.formRow}>
          <FormField
            label="数据库类型"
            type="select"
            value={config.databaseType}
            onChange={(v) => updateConfig('databaseType', v as DatabaseType)}
            options={[
              { value: 'internal', label: '内置 PostgreSQL' },
              { value: 'external', label: '外部数据库' },
            ]}
          />
        </div>

        {config.databaseType === 'internal' ? (
          <>
            <div className={styles.formRow}>
              <FormField
                label="数据库名称"
                value={config.postgresDatabase}
                onChange={(v) => updateConfig('postgresDatabase', v)}
                placeholder="hagicode"
              />
              <FormField
                label="用户名"
                value={config.postgresUser}
                onChange={(v) => updateConfig('postgresUser', v)}
                placeholder="postgres"
              />
              <FormField
                label="密码"
                type="text"
                value={config.postgresPassword}
                onChange={(v) => updateConfig('postgresPassword', v)}
                placeholder="postgres"
              />
            </div>
            <div className={styles.formRow}>
              <FormField
                label="数据卷类型"
                type="select"
                value={config.volumeType}
                onChange={(v) => updateConfig('volumeType', v as VolumeType)}
                options={[
                  { value: 'named', label: '命名卷（Docker 管理）' },
                  { value: 'bind', label: '绑定挂载（指定路径）' },
                ]}
              />
              {config.volumeType === 'named' && (
                <FormField
                  label="数据卷名称"
                  value={config.volumeName || ''}
                  onChange={(v) => updateConfig('volumeName', v)}
                  placeholder="postgres-data"
                />
              )}
              {config.volumeType === 'bind' && (
                <FormField
                  label="数据卷路径"
                  value={config.volumePath || ''}
                  onChange={(v) => updateConfig('volumePath', v)}
                  placeholder={
                    config.hostOS === 'windows'
                      ? 'C:\\data\\postgres'
                      : '/data/postgres'
                  }
                />
              )}
            </div>
          </>
        ) : (
          <div className={styles.formRow}>
            <FormField
              label="数据库主机"
              value={config.externalDbHost || ''}
              onChange={(v) => updateConfig('externalDbHost', v)}
              placeholder="localhost"
              required
            />
            <FormField
              label="端口"
              type="number"
              value={config.externalDbPort || '5432'}
              onChange={(v) => updateConfig('externalDbPort', v)}
              placeholder="5432"
              required
            />
            <FormField
              label="数据库名称"
              value={config.postgresDatabase}
              onChange={(v) => updateConfig('postgresDatabase', v)}
              placeholder="hagicode"
              required
            />
            <FormField
              label="用户名"
              value={config.postgresUser}
              onChange={(v) => updateConfig('postgresUser', v)}
              placeholder="postgres"
              required
            />
            <FormField
              label="密码"
              type="text"
              value={config.postgresPassword}
              onChange={(v) => updateConfig('postgresPassword', v)}
              placeholder="your-password"
              required
            />
          </div>
        )}
      </FormSection>

      {/* API Keys */}
      <FormSection title="API 密钥">
        <div className={styles.formRow}>
          <FormField
            label="License Key 类型"
            type="select"
            value={config.licenseKeyType}
            onChange={(v) => updateConfig('licenseKeyType', v as LicenseKeyType)}
            options={[
              { value: 'public', label: '公测 Key（推荐）' },
              { value: 'custom', label: '自定义 Key' },
            ]}
          />
          {config.licenseKeyType === 'custom' && (
            <FormField
              label="自定义 License Key"
              value={config.licenseKey}
              onChange={(v) => updateConfig('licenseKey', v)}
              placeholder="输入您的 License Key"
            />
          )}
        </div>
        <FormField
          label="智谱 AI API Key"
          type="text"
          value={config.zaiApiKey}
          onChange={(v) => updateConfig('zaiApiKey', v)}
          placeholder="请输入您的智谱 AI API Key"
          required
        />
        <div className={styles.zaiLink}>
          <a
            href="https://www.bigmodel.cn/claude-code?ic=14BY54APZA"
            target="_blank"
            rel="noopener noreferrer"
          >
            获取智谱 AI API Key →
          </a>
        </div>
      </FormSection>

      {/* Volume Mounts */}
      <FormSection
        title="卷挂载"
        description="工作目录是指向您需要编辑的代码仓库路径，将被映射到容器的 /app/workdir"
      >
        <FormField
          label="工作目录路径"
          value={config.workdirPath}
          onChange={(v) => updateConfig('workdirPath', v)}
          placeholder={
            config.hostOS === 'windows'
              ? 'C:\\repos'
              : '/home/user/repos'
          }
          required
        />
        {config.hostOS === 'linux' && (
          <>
            <div className={styles.warningBox}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={config.workdirCreatedByRoot}
                  onChange={(e) => updateConfig('workdirCreatedByRoot', e.target.checked)}
                  className={styles.checkbox}
                />
                工作目录由 root 用户创建
              </label>
              {config.workdirCreatedByRoot && (
                <div className={styles.warningContent}>
                  <p className={styles.warningText}>
                    <strong>⚠️ 权限问题警告</strong>
                  </p>
                  <p>检测到工作目录由 root 用户创建，这会导致容器内无法正常写入文件。请选择以下方案之一：</p>
                  <ul className={styles.warningList}>
                    <li>修改目录权限：<code>chmod 777 /path/to/repos</code></li>
                    <li>创建非 root 用户并使用该用户创建目录</li>
                  </ul>
                </div>
              )}
            </div>
            {!config.workdirCreatedByRoot && (
              <div className={styles.userMappingBox}>
                <p className={styles.mappingDescription}>
                  <strong>配置用户权限映射</strong>
                </p>
                <p className={styles.mappingText}>
                  为解决容器内外的文件权限问题，需要配置 PUID 和 PGID。
                  请使用创建工作目录的用户 ID 和组 ID。
                </p>
                <p className={styles.mappingInstruction}>
                  获取当前用户 ID：<code>id username</code>
                  <br />
                  输出示例：<code>uid=1000(user) gid=1000(user)</code>
                </p>
                <div className={styles.formRow}>
                  <FormField
                    label="PUID（用户 ID）"
                    type="text"
                    value={config.puid}
                    onChange={(v) => updateConfig('puid', v)}
                    placeholder="1000"
                    required
                  />
                  <FormField
                    label="PGID（组 ID）"
                    type="text"
                    value={config.pgid}
                    onChange={(v) => updateConfig('pgid', v)}
                    placeholder="1000"
                    required
                  />
                </div>
              </div>
            )}
          </>
        )}
      </FormSection>
    </div>
  );
}

interface ConfigPreviewProps {
  yaml: string;
  onCopy: () => void;
  copied: boolean;
}

function ConfigPreview({ yaml, onCopy, copied }: ConfigPreviewProps): JSX.Element {
  return (
    <div className={styles.previewPanel}>
      <div className={styles.previewHeader}>
        <h3 className={styles.previewTitle}>生成的配置</h3>
        <button
          type="button"
          onClick={onCopy}
          className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
        >
          {copied ? '已复制!' : '复制'}
        </button>
      </div>
      <div className={styles.codeBlock}>
        <Highlight
          code={yaml}
          language="yaml"
        >
          {({
            className,
            style,
            tokens,
            getLineProps,
            getTokenProps,
          }: {
            className: string;
            style: React.CSSProperties;
            tokens: Token[][];
            getLineProps: (props: { line: Token[]; key: number }) => React.HTMLAttributes<HTMLDivElement>;
            getTokenProps: (props: { token: Token; key: number }) => React.HTMLAttributes<HTMLElement>;
          }) => (
            <pre className={className} style={style}>
              {tokens.map((line: Token[], i: number) => (
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token: Token, key: number) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function DockerComposeGenerator(): JSX.Element {
  const [config, setConfig] = useState<DockerComposeConfig>(defaultConfig);
  const [copied, setCopied] = useState(false);

  const yaml = useMemo(() => generateYAML(config), [config]);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(yaml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Layout
      title="Docker Compose 生成器"
      description="快速生成 Hagicode Docker Compose 配置文件"
    >
      <main className={styles.generatorContainer}>
        <div className={styles.generatorLayout}>
          <div className={styles.configPanel}>
            <ConfigForm config={config} onChange={setConfig} />
          </div>
          <ConfigPreview yaml={yaml} onCopy={handleCopy} copied={copied} />
        </div>

        {copied && (
          <div className={styles.copyFeedback} role="status" aria-live="polite">
            已复制到剪贴板!
          </div>
        )}
      </main>
    </Layout>
  );
}
