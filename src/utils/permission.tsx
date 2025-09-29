// utils/permissions.ts

import { useSession } from 'next-auth/react'

// Permission types
export type PermissionType = 'create' | 'update' | 'delete' | 'view'

// User type mapping
export const USER_TYPES = {
  NO_ACCESS: 0, // View only
  CREATOR: 1, // Create only
  EDITOR: 2, // Create + Update
  MANAGER: 9, // Create + Update + Delete
  SUPER_ADMIN: 99 // All permissions + special admin access
} as const

// Hook for checking permissions
export const usePermissions = () => {
  const { data: session } = useSession()
  const userType = (session?.user as any)?.user_type || 0

  const hasPermission = (permission: PermissionType): boolean => {
    switch (userType) {
      case USER_TYPES.SUPER_ADMIN: // 99 - All permissions
        return true

      case USER_TYPES.MANAGER: // 9 - Create, update, delete
        return permission === 'create' || permission === 'update' || permission === 'delete' || permission === 'view'

      case USER_TYPES.EDITOR: // 2 - Create and update
        return permission === 'create' || permission === 'update' || permission === 'view'

      case USER_TYPES.CREATOR: // 1 - Create only
        return permission === 'create' || permission === 'view'

      case USER_TYPES.NO_ACCESS: // 0 - View only
        return permission === 'view'

      default:
        return false
    }
  }

  const checkMultiplePermissions = (permissions: PermissionType[]): boolean => {
    return permissions.every((permission) => hasPermission(permission))
  }

  return {
    canCreate: hasPermission('create'),
    canUpdate: hasPermission('update'),
    canDelete: hasPermission('delete'),
    canView: hasPermission('view'),
    checkPermission: hasPermission,
    checkMultiplePermissions,
    userType
  }
}

// Standalone function for use outside components
export const checkUserPermission = (userType: number, permission: PermissionType): boolean => {
  switch (userType) {
    case USER_TYPES.SUPER_ADMIN: // 99 - All permissions
      return true

    case USER_TYPES.MANAGER: // 9 - Create, update, delete
      return permission === 'create' || permission === 'update' || permission === 'delete' || permission === 'view'

    case USER_TYPES.EDITOR: // 2 - Create and update
      return permission === 'create' || permission === 'update' || permission === 'view'

    case USER_TYPES.CREATOR: // 1 - Create only
      return permission === 'create' || permission === 'view'

    case USER_TYPES.NO_ACCESS: // 0 - View only
      return permission === 'view'

    default:
      return false
  }
}
