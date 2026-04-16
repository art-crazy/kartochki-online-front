// Re-run `npm run generate:api` to update generated files.

// Domain types
export type * from './generated/types.gen';

// SDK functions — use in Server Components and server actions
export * from './generated/sdk.gen';

// TanStack Query option factories and mutation helpers — use in Client Components.
// Explicit re-export avoids name conflicts with `Options` and `QueryKey` from sdk.gen.
export type { QueryKey } from './generated/@tanstack/react-query.gen';
export {
  // health
  getLiveHealthQueryKey,
  getLiveHealthOptions,
  getReadyHealthQueryKey,
  getReadyHealthOptions,
  // auth
  // oauth
  loginWithVkOAuthMutation,
  loginWithVkWidgetMutation,
  loginWithYandexWidgetMutation,
  // user
  getCurrentUserQueryKey,
  getCurrentUserOptions,
  // dashboard
  getDashboardQueryKey,
  getDashboardOptions,
  // projects
  listProjectsQueryKey,
  listProjectsOptions,
  createProjectMutation,
  deleteProjectMutation,
  getProjectByIdQueryKey,
  getProjectByIdOptions,
  patchProjectMutation,
  // generation
  getGenerateConfigQueryKey,
  getGenerateConfigOptions,
  uploadGenerationImageMutation,
  createGenerationMutation,
  getGenerationByIdQueryKey,
  getGenerationByIdOptions,
  // settings
  getSettingsQueryKey,
  getSettingsOptions,
  patchSettingsProfileMutation,
  patchSettingsDefaultsMutation,
  changeSettingsPasswordMutation,
  patchSettingsNotificationsMutation,
  deleteSettingsSessionMutation,
  rotateSettingsApiKeyMutation,
  postSettingsExportMutation,
  deleteSettingsAccountMutation,
  // billing
  getBillingQueryKey,
  getBillingOptions,
  createBillingCheckoutMutation,
  createBillingAddonCheckoutMutation,
  cancelBillingSubscriptionMutation,
  billingWebhookMutation,
  // blog
  listPublicBlogPostsQueryKey,
  listPublicBlogPostsOptions,
  getPublicBlogPostBySlugQueryKey,
  getPublicBlogPostBySlugOptions,
} from './generated/@tanstack/react-query.gen';
