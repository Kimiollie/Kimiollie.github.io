import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { contactForm, contactPage, email } from '../content/contact.ts';
import styles from './ContactForm.module.css';

type Field = 'name' | 'email' | 'message';
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;
type Status = 'idle' | 'sending' | 'success' | 'error' | 'missing-id';

const EMPTY: Values = { name: '', email: '', message: '' };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELDS: Field[] = ['name', 'email', 'message'];

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = contactForm.errors.nameRequired;
  if (!values.email.trim()) errors.email = contactForm.errors.emailRequired;
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = contactForm.errors.emailInvalid;
  if (!values.message.trim()) errors.message = contactForm.errors.messageRequired;
  return errors;
}

function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.target.name as Field;
    setValues((current) => ({ ...current, [field]: event.target.value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
    if (status === 'success' || status === 'error') setStatus('idle');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;

    const found = validate(values);
    setErrors(found);
    const firstInvalid = FIELDS.find((field) => found[field]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const formId = import.meta.env.VITE_FORMSPREE_ID;
    if (!formId) {
      setStatus(import.meta.env.DEV ? 'missing-id' : 'error');
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
        }),
      });
      if (!response.ok) throw new Error(`Formspree responded ${response.status}`);
      setValues(EMPTY);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const fieldProps = (field: Field) => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    onChange: handleChange,
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `contact-${field}-error` : undefined,
    className: styles.input,
  });

  const errorText = (field: Field) =>
    errors[field] && (
      <p id={`contact-${field}-error`} className={styles.error}>
        {errors[field]}
      </p>
    );

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="contact-name">{contactForm.nameLabel}</label>
        <input {...fieldProps('name')} type="text" autoComplete="name" />
        {errorText('name')}
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-email">{contactForm.emailLabel}</label>
        <input {...fieldProps('email')} type="email" autoComplete="email" />
        {errorText('email')}
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message">{contactForm.messageLabel}</label>
        <textarea {...fieldProps('message')} rows={6} />
        {errorText('message')}
      </div>

      <button type="submit" className={styles.submit} disabled={status === 'sending'}>
        {status === 'sending' ? contactForm.sending : contactForm.submit}
      </button>

      <div className={styles.status} role="status" aria-live="polite">
        {status === 'success' && <p className={styles.success}>{contactPage.successMessage}</p>}
        {status === 'error' && (
          <p className={styles.failure}>
            {contactForm.sendError} <a href={`mailto:${email}`}>{email}</a>.
          </p>
        )}
        {status === 'missing-id' && import.meta.env.DEV && (
          <p className={styles.devWarning}>{contactForm.missingIdWarning}</p>
        )}
      </div>
    </form>
  );
}

export default ContactForm;
