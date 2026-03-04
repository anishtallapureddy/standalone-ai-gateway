import { useState, type CSSProperties, type FC } from 'react';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

/* ─── palette ─── */
const C = {
  bg: '#0a0a0f',
  bgDeep: '#050508',
  blue: '#0078d4',
  cyan: '#00d4ff',
  purple: '#7b61ff',
  white: '#fff',
  gray: '#b0b0b0',
  cardBg: 'rgba(255,255,255,0.05)',
  cardBorder: 'rgba(255,255,255,0.1)',
  font: "'Segoe UI', system-ui, -apple-system, sans-serif",
  mono: "'Cascadia Code', 'Fira Code', 'Consolas', monospace",
};

/* ─── reusable style factories ─── */
const glassCard: CSSProperties = {
  background: C.cardBg,
  border: `1px solid ${C.cardBorder}`,
  borderRadius: 16,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
};

const btnSolid: CSSProperties = {
  padding: '14px 32px',
  fontSize: 16,
  fontWeight: 600,
  fontFamily: C.font,
  color: C.white,
  background: C.blue,
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  boxShadow: `0 0 24px ${C.blue}66`,
  transition: 'transform .15s, box-shadow .15s',
};

const btnOutline: CSSProperties = {
  ...btnSolid,
  background: 'transparent',
  border: `1.5px solid ${C.cardBorder}`,
  boxShadow: 'none',
};

/* ─── component ─── */
const LandingPage: FC<LandingPageProps> = ({ onLogin, onSignup }) => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  /* ── nav ── */
  const nav = (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        height: 64,
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        fontFamily: C.font,
      }}
    >
      {/* logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 22 }}>⚡</span>
        <span style={{ color: C.white, fontWeight: 700, fontSize: 17, letterSpacing: -0.3 }}>
          Azure AI Gateway
        </span>
      </div>

      {/* centre links */}
      <div style={{ display: 'flex', gap: 36 }}>
        {['Pricing', 'Docs', 'Blog', 'Demo'].map((t) => (
          <a
            key={t}
            href={`#${t.toLowerCase()}`}
            style={{
              color: C.gray,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
              transition: 'color .15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = C.white;
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = C.gray;
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            {t}
          </a>
        ))}
      </div>

      {/* auth buttons */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={onLogin}
          style={{
            padding: '8px 20px',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: C.font,
            color: C.white,
            background: 'transparent',
            border: `1.5px solid ${C.cardBorder}`,
            borderRadius: 6,
            cursor: 'pointer',
            transition: 'border-color .15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.white)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.cardBorder)}
        >
          Login
        </button>
        <button
          onClick={onSignup}
          style={{
            padding: '8px 20px',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: C.font,
            color: C.white,
            background: C.blue,
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            boxShadow: `0 0 16px ${C.blue}55`,
            transition: 'box-shadow .15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 28px ${C.blue}99`)}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0 0 16px ${C.blue}55`)}
        >
          Sign Up
        </button>
      </div>
    </nav>
  );

  /* ── hero ── */
  const hero = (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 24px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 800,
          height: 800,
          background: `radial-gradient(circle, ${C.blue}18 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <h1
        style={{
          fontSize: 56,
          fontWeight: 800,
          lineHeight: 1.15,
          margin: 0,
          fontFamily: C.font,
          background: `linear-gradient(135deg, ${C.white} 30%, ${C.cyan})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          maxWidth: 800,
        }}
      >
        The Intelligent Gateway for Enterprise&nbsp;AI
      </h1>

      <p
        style={{
          fontSize: 20,
          color: C.gray,
          maxWidth: 700,
          margin: '28px auto 0',
          lineHeight: 1.65,
          fontFamily: C.font,
        }}
      >
        Route, govern, and observe all your AI models, tools, and agents from a single control
        plane. Multi-cloud. Multi-tenant. Production-ready.
      </p>

      <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
        <button
          onClick={onSignup}
          style={btnSolid}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 0 36px ${C.blue}88`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 0 24px ${C.blue}66`;
          }}
        >
          Get Started Free
        </button>
        <button
          style={btnOutline}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = C.white;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = C.cardBorder;
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Request Demo
        </button>
      </div>

      {/* gateway diagram */}
      <div
        style={{
          ...glassCard,
          marginTop: 72,
          padding: '40px 48px',
          maxWidth: 680,
          width: '100%',
          boxShadow: `0 0 48px ${C.blue}1a, inset 0 1px 0 rgba(255,255,255,0.06)`,
          position: 'relative',
        }}
      >
        {/* providers row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          {['Azure OpenAI', 'Anthropic', 'Gemini', 'Bedrock'].map((m) => (
            <span
              key={m}
              style={{
                padding: '8px 18px',
                fontSize: 13,
                fontWeight: 600,
                color: C.cyan,
                border: `1px solid ${C.cyan}44`,
                borderRadius: 8,
                fontFamily: C.font,
                background: `${C.cyan}0a`,
              }}
            >
              {m}
            </span>
          ))}
        </div>

        {/* arrows down */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 80,
            margin: '14px 0',
            color: `${C.blue}88`,
            fontSize: 18,
            fontFamily: C.mono,
          }}
        >
          {'↓ ↓ ↓ ↓'.split(' ').map((a, i) => (
            <span key={i}>{a}</span>
          ))}
        </div>

        {/* gateway box */}
        <div
          style={{
            border: `2px solid ${C.blue}`,
            borderRadius: 12,
            padding: '18px 0',
            textAlign: 'center',
            background: `linear-gradient(180deg, ${C.blue}12 0%, transparent 100%)`,
            boxShadow: `0 0 32px ${C.blue}33`,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, color: C.white, fontFamily: C.font }}>
            Azure AI Gateway
          </div>
          <div style={{ fontSize: 13, color: C.gray, marginTop: 4, fontFamily: C.font }}>
            Route&nbsp; · &nbsp;Govern&nbsp; · &nbsp;Observe
          </div>
        </div>

        {/* arrows down */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 100,
            margin: '14px 0',
            color: `${C.blue}88`,
            fontSize: 18,
            fontFamily: C.mono,
          }}
        >
          {'↓ ↓ ↓'.split(' ').map((a, i) => (
            <span key={i}>{a}</span>
          ))}
        </div>

        {/* consumers row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
          {['Agents', 'Apps', 'Users'].map((c) => (
            <span
              key={c}
              style={{
                padding: '8px 24px',
                fontSize: 13,
                fontWeight: 600,
                color: C.purple,
                border: `1px solid ${C.purple}44`,
                borderRadius: 8,
                fontFamily: C.font,
                background: `${C.purple}0a`,
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );

  /* ── trusted strip ── */
  const trusted = (
    <section style={{ padding: '40px 24px 56px', textAlign: 'center' }}>
      <p style={{ fontSize: 13, color: C.gray, opacity: 0.5, marginBottom: 28, fontFamily: C.font }}>
        TRUSTED BY ENTERPRISE
      </p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 56,
          flexWrap: 'wrap',
          opacity: 0.3,
        }}
      >
        {['Fortune 500', 'Global Bank', 'Tech Corp', 'Healthcare Co', 'Retail Giant'].map((c) => (
          <span
            key={c}
            style={{ fontSize: 16, fontWeight: 600, color: C.gray, fontFamily: C.font, letterSpacing: 1 }}
          >
            {c}
          </span>
        ))}
      </div>
    </section>
  );

  /* ── features ── */
  const features = [
    {
      icon: '🌐',
      title: 'Multi-Cloud Model Access',
      desc: 'Route to Azure OpenAI, Anthropic, Google Gemini, AWS Bedrock, and custom models through a unified API.',
    },
    {
      icon: '🛡️',
      title: 'Enterprise Governance',
      desc: 'Runtime policies, design-time rules, and RAI guardrails. Approve, audit, and enforce at scale.',
    },
    {
      icon: '📊',
      title: 'Token Observability',
      desc: 'Real-time analytics on token consumption by user, app, model, and namespace. FinOps built in.',
    },
    {
      icon: '🔀',
      title: 'Intelligent Routing',
      desc: 'Load balance across regions, auto-failover from PTU to PAYGO, latency-based routing with health checks.',
    },
    {
      icon: '🧩',
      title: 'MCP & Tool Catalog',
      desc: 'Convert OpenAPI specs to MCP servers with zero code. Discover tools through a governed enterprise catalog.',
    },
    {
      icon: '🔑',
      title: 'Per-Consumer Quotas',
      desc: 'Authenticate users and apps, issue API keys, enforce per-consumer rate limits and token budgets.',
    },
  ];

  const featuresSection = (
    <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <h2
        style={{
          textAlign: 'center',
          fontSize: 40,
          fontWeight: 700,
          color: C.white,
          margin: '0 0 56px',
          fontFamily: C.font,
        }}
      >
        Everything you need to&nbsp;
        <span style={{ color: C.cyan }}>govern AI at scale</span>
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
        }}
      >
        {features.map((f, i) => {
          const isHov = hoveredFeature === i;
          return (
            <div
              key={f.title}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
              style={{
                ...glassCard,
                padding: '36px 28px',
                transition: 'transform .2s, border-color .2s, box-shadow .2s',
                transform: isHov ? 'translateY(-4px)' : 'none',
                borderColor: isHov ? `${C.blue}55` : C.cardBorder,
                boxShadow: isHov ? `0 8px 32px ${C.blue}1a` : 'none',
                cursor: 'default',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: C.white, margin: '0 0 10px', fontFamily: C.font }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 14, color: C.gray, lineHeight: 1.7, margin: 0, fontFamily: C.font }}>
                {f.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );

  /* ── code preview ── */
  const codePreview = (
    <section style={{ padding: '80px 24px', maxWidth: 780, margin: '0 auto' }}>
      <h2
        style={{
          textAlign: 'center',
          fontSize: 40,
          fontWeight: 700,
          color: C.white,
          margin: '0 0 40px',
          fontFamily: C.font,
        }}
      >
        Ship in Minutes, Not Months
      </h2>

      <div
        style={{
          ...glassCard,
          padding: 0,
          overflow: 'hidden',
          boxShadow: `0 0 48px ${C.blue}12`,
        }}
      >
        {/* terminal title bar */}
        <div
          style={{
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            borderBottom: `1px solid ${C.cardBorder}`,
          }}
        >
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
          <span style={{ flex: 1, textAlign: 'center', fontSize: 12, color: C.gray, fontFamily: C.mono }}>
            terminal
          </span>
        </div>

        <pre
          style={{
            margin: 0,
            padding: '28px 28px',
            fontFamily: C.mono,
            fontSize: 14,
            lineHeight: 1.75,
            overflowX: 'auto',
            color: C.gray,
          }}
        >
          <code>
            <span style={{ color: '#6a9955' }}>{'# Connect any model in seconds'}</span>
            {'\n'}
            <span style={{ color: C.white }}>curl</span>
            <span style={{ color: '#ce9178' }}> https://gateway.contoso.com/v1/chat/completions</span>
            <span style={{ color: C.white }}> \</span>
            {'\n'}
            <span style={{ color: C.cyan }}>  -H</span>
            <span style={{ color: '#ce9178' }}> "Authorization: Bearer $API_KEY"</span>
            <span style={{ color: C.white }}> \</span>
            {'\n'}
            <span style={{ color: C.cyan }}>  -d</span>
            <span style={{ color: '#ce9178' }}> {"'"}</span>
            <span style={{ color: '#ce9178' }}>{'{'}</span>
            {'\n'}
            <span style={{ color: '#ce9178' }}>{'    "model": "gpt-4o",'}</span>
            {'\n'}
            <span style={{ color: '#ce9178' }}>{'    "messages": [{"role": "user", "content": "Hello!"}]'}</span>
            {'\n'}
            <span style={{ color: '#ce9178' }}>{"  }'"}</span>
          </code>
        </pre>
      </div>
    </section>
  );

  /* ── CTA banner ── */
  const ctaBanner = (
    <section
      style={{
        margin: '64px 24px',
        padding: '72px 24px',
        borderRadius: 24,
        textAlign: 'center',
        background: `linear-gradient(135deg, ${C.blue}33 0%, ${C.purple}33 100%)`,
        border: `1px solid ${C.cardBorder}`,
        maxWidth: 1100,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <h2 style={{ fontSize: 36, fontWeight: 700, color: C.white, margin: '0 0 16px', fontFamily: C.font }}>
        Ready to centralize your AI operations?
      </h2>
      <p style={{ fontSize: 17, color: C.gray, margin: '0 0 36px', fontFamily: C.font }}>
        Start free and scale when you're ready — no credit card required.
      </p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        <button
          onClick={onSignup}
          style={btnSolid}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 0 36px ${C.blue}88`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 0 24px ${C.blue}66`;
          }}
        >
          Get Started Free
        </button>
        <button
          style={btnOutline}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = C.white;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = C.cardBorder;
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Talk to Sales
        </button>
      </div>
    </section>
  );

  /* ── footer ── */
  const footerCols: Record<string, string[]> = {
    Product: ['Features', 'Pricing', 'Docs', 'Changelog'],
    Resources: ['Blog', 'Tutorials', 'API Reference', 'Status'],
    Company: ['About', 'Careers', 'Contact', 'Security'],
    Legal: ['Privacy', 'Terms', 'SLA'],
  };

  const footer = (
    <footer style={{ background: C.bgDeep, padding: '64px 48px 40px', fontFamily: C.font }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 40,
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        {Object.entries(footerCols).map(([heading, links]) => (
          <div key={heading}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 20, letterSpacing: 0.8 }}>
              {heading}
            </h4>
            {links.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(/\s/g, '-')}`}
                style={{
                  display: 'block',
                  fontSize: 13,
                  color: C.gray,
                  textDecoration: 'none',
                  marginBottom: 14,
                  transition: 'color .15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.gray)}
              >
                {l}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div
        style={{
          borderTop: `1px solid ${C.cardBorder}`,
          marginTop: 48,
          paddingTop: 28,
          maxWidth: 1100,
          margin: '48px auto 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <span style={{ fontSize: 13, color: C.gray, opacity: 0.6 }}>
          © 2026 Microsoft. Azure AI Gateway.
        </span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['GitHub', 'X', 'LinkedIn'].map((s) => (
            <a
              key={s}
              href={`#${s.toLowerCase()}`}
              style={{ fontSize: 13, color: C.gray, textDecoration: 'none', transition: 'color .15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.gray)}
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );

  /* ── page shell ── */
  return (
    <div
      style={{
        background: C.bg,
        color: C.white,
        minHeight: '100vh',
        fontFamily: C.font,
        scrollBehavior: 'smooth',
        overflowX: 'hidden',
      }}
    >
      {nav}
      {hero}
      {trusted}
      {featuresSection}
      {codePreview}
      {ctaBanner}
      {footer}
    </div>
  );
};

export default LandingPage;
