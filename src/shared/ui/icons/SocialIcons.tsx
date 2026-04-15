type SocialIconProps = {
  size?: number;
};

export function YandexIcon({ size = 52 }: SocialIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect width="40" height="40" fill="#F8604A" rx="20"/>
      <path fill="#fff" d="M22.776 31.5h4.178v-24h-6.078c-6.112 0-9.324 3.142-9.324 7.77 0 3.695 1.762 5.87 4.904 8.115L11 31.5h4.524l6.077-9.082-2.106-1.416c-2.555-1.726-3.799-3.073-3.799-5.974 0-2.555 1.796-4.282 5.215-4.282h1.864V31.5Z"/>
    </svg>
  );
}

export function VkIcon({ size = 52 }: SocialIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect width="40" height="40" fill="#0077FF" rx="20"/>
      <path fill="#fff" d="M21.176 27c-7.424 0-11.653-5.088-11.826-13.556h3.715c.12 6.212 2.862 8.845 5.033 9.389V13.444h3.497v5.365c2.144-.23 4.397-2.676 5.16-5.365h3.443c-.588 3.338-3.03 5.784-4.767 6.763 1.737.805 4.506 2.943 5.569 6.793h-3.79c-.828-2.58-2.89-4.578-5.615-4.851V27h-.42Z"/>
    </svg>
  );
}
