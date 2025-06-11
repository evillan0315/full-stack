import type { JSX } from 'solid-js';
import { Icon } from '@iconify-icon/solid';

/**
 * Props for the FeatureCard component.
 */
type FeatureCardProps = {
  /**
   * The icon to display in the card. This should be a valid icon identifier
   * supported by the `@iconify-icon/solid` library.  For example, 'mdi:account'.
   *
   * @example
   * ```typescript
   * <FeatureCard icon="mdi:account" title="Account Management" description="Manage your user accounts efficiently." />
   * ```
   *
   *  **Best Practices:**
   *  - Refer to the `@iconify-icon/solid` documentation for available icon sets and identifiers.
   *  - Consider creating a type alias or enum for valid icon values if your application uses a limited set of icons.  This will improve type safety.
   *  - Use a consistent naming convention for icons to improve maintainability.
   */
  icon: any; // You can refine this type based on your icon system

  /**
   * The title of the feature card.  This will be displayed prominently.
   *
   * @example
   * ```typescript
   * <FeatureCard title="Performance Optimization" description="Improve the speed and responsiveness of your application." />
   * ```
   */
  title: string;

  /**
   * A brief description of the feature.  This provides more detail about what the feature does.
   *
   * @example
   * ```typescript
   * <FeatureCard title="Real-time Data" description="Access up-to-date information from various sources." />
   * ```
   */
  description: string;
};

/**
 * A card component to display a feature with an icon, title, and description.
 *  It utilizes `@iconify-icon/solid` for rendering icons.  Styling is applied using Tailwind CSS.
 *
 * @param {FeatureCardProps} props - The props for the FeatureCard component.
 * @returns {JSX.Element} A JSX element representing the FeatureCard.
 *
 * @example
 * ```typescript
 * <FeatureCard
 *   icon="mdi:rocket"
 *   title="Blazing Fast Performance"
 *   description="Experience unparalleled speed and responsiveness with our optimized algorithms."
 * />
 * ```
 *
 * **Component Features:**
 *  - Displays an icon using `@iconify-icon/solid`.
 *  - Shows a title for the feature.
 *  - Provides a description of the feature.
 *  - Uses Tailwind CSS classes for styling, including:
 *     - `p-6`: Padding of 6 units.
 *     - `border`: Adds a border.
 *     - `rounded-lg`: Rounds the corners.
 *     - `bg-gray-800/10`: A semi-transparent gray background.
 *     - `border-gray-500/30`: A semi-transparent gray border.
 *     - `hover:shadow-lg`: Adds a shadow on hover.
 *     - `transition`: Enables smooth transitions for hover effects.
 *     - `cursor-default`: Sets the cursor to the default pointer.
 *     - `text-sky-500`: Sets the icon color to sky-500.
 *     - `shrink-0`: Prevents the icon from shrinking.
 *     - `text-xl`: Sets the title text size to extra large.
 *     - `font-semibold`: Makes the title font semi-bold.
 *     - `mb-2`: Adds a margin-bottom to the title.
 */
const FeatureCard = (props: FeatureCardProps): JSX.Element => {
  return (
    <div class="p-6 border rounded-lg bg-gray-800/10 border-gray-500/30 hover:shadow-lg transition cursor-default ">
      <Icon icon={props.icon} width="50" height="50" class="text-sky-500 shrink-0" />
      <h3 class="text-xl font-semibold mb-2">{props.title}</h3>
      <p class="">{props.description}</p>
    </div>
  );
};

export default FeatureCard;
