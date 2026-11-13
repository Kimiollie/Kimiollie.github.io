import type { AnchorHTMLAttributes } from 'react';

type ExternalAnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'> & {
  href: string;
};

/** A link to another site. Opens in a new tab, safely. */
function ExternalAnchor(props: ExternalAnchorProps) {
  return <a {...props} target="_blank" rel="noopener noreferrer" />;
}

export default ExternalAnchor;
