import { Show, type JSX } from 'solid-js';
const company = 'Company Inc.';

interface LeftFooterProps {
  show?: boolean;
}
export const LeftFooter = (props: LeftFooterProps): JSX.Element => {
  return (
    <Show when={props.show}>
      <p>© 2025 {company}.</p>
    </Show>
  );
};
