import PageHeader from '../components/PageHeader.tsx';
import { contactPage } from '../content/contact.ts';

function Contact() {
  return (
    <PageHeader
      title={contactPage.title}
      sub={contactPage.sub}
      accent="var(--c-contact)"
      pose="mailbox"
    />
  );
}

export default Contact;
