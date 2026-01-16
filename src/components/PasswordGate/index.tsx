import React, { useState, FormEvent } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

interface PasswordGateProps {
  onSuccess: () => void;
}

export default function PasswordGate({ onSuccess }: PasswordGateProps): JSX.Element {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { siteConfig } = useDocusaurusContext();

  const sitePassword = siteConfig.customFields?.sitePassword as string;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === sitePassword) {
      sessionStorage.setItem('opentelco-auth', 'true');
      onSuccess();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <img src="/img/GSMA.jpeg" alt="GSMA Logo" className={styles.logoImage} />
        </div>
        <h1 className={styles.title}>Open Telco</h1>
        <p className={styles.subtitle}>Preview Access</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Enter password"
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            autoFocus
          />
          {error && (
            <p className={styles.errorText}>Incorrect password. Please try again.</p>
          )}
          <button type="submit" className={styles.button}>
            Access Site
          </button>
        </form>

        <p className={styles.hint}>
          This site is currently in preview mode.
        </p>
      </div>
    </div>
  );
}
