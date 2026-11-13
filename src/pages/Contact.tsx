import ContactForm from '../components/ContactForm.tsx';
import ExternalAnchor from '../components/ExternalAnchor.tsx';
import PageHeader from '../components/PageHeader.tsx';
import { contactLinks, contactPage } from '../content/contact.ts';
import type { ContactLink } from '../content/types.ts';
import styles from './Contact.module.css';

function LinkRow({ link }: { link: ContactLink }) {
  const content = (
    <>
      <span className={styles.rowLabel}>{link.label}</span>
      <span className={styles.rowText}>{link.text}</span>
    </>
  );

  if (link.kind === 'external') {
    return (
      <ExternalAnchor href={link.href} className={styles.row}>
        {content}
      </ExternalAnchor>
    );
  }
  return (
    <a href={link.href} className={styles.row}>
      {content}
    </a>
  );
}

function Contact() {
  return (
    <>
      <PageHeader
        title={contactPage.title}
        sub={contactPage.sub}
        accent="var(--c-contact)"
        pose="phone"
      />

      <div className={styles.layout}>
        <ContactForm />

        <ul className={styles.links} aria-label={contactPage.linksLabel}>
          {contactLinks.map((link) => (
            <li key={link.href}>
              <LinkRow link={link} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Contact;
