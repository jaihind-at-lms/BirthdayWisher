/**
 * Application-level UI messages.
 * Import `messages` and access keys directly — never hardcode strings in components.
 *
 * @example
 *   import messages from '@project/Utils/messages'
 *   showErrorToast(messages.unauthorized.message)
 */
const messages = {
  noRecordFound: {
    message: 'No records found.',
  },
  deleteMessage: 'Are you sure you want to delete this?',
  unauthorized: {
    message: 'Invalid email or password.',
  },
  unauthorizedUser: {
    message: 'Unauthorized user.',
  },
} as const

export type Messages = typeof messages
export default messages
